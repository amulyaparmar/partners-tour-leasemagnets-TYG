import { readdir } from "node:fs/promises";
import path from "node:path";

type LibraryConfig = {
  directory: string;
  title: string;
};

export type AssetItem = {
  extension: string;
  href: string;
  label: string;
  name: string;
};

export type AssetLibrary = LibraryConfig & {
  items: AssetItem[];
};

const libraries: LibraryConfig[] = [
  { directory: "logos", title: "Brand logos" },
  { directory: "invoices-shared", title: "Shared invoices" },
  { directory: "quotes-shared", title: "Shared quotes" },
];

function formatLabel(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildHref(directory: string, fileName: string) {
  return `/${directory}/${encodeURIComponent(fileName)}`;
}

async function readLibrary({
  directory,
  title,
}: LibraryConfig): Promise<AssetLibrary> {
  const fullPath = path.join(process.cwd(), "public", directory);
  const entries = await readdir(fullPath, { withFileTypes: true });

  const items = entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      const extension = path.extname(entry.name).replace(".", "").toUpperCase();

      return {
        extension,
        href: buildHref(directory, entry.name),
        label: formatLabel(entry.name),
        name: entry.name,
      };
    });

  return { directory, title, items };
}

export async function getAssetLibrary() {
  return Promise.all(libraries.map(readLibrary));
}

export async function getAssetSummary() {
  const collections = await getAssetLibrary();

  return {
    logos: collections.find((collection) => collection.directory === "logos")
      ?.items.length ?? 0,
    invoices:
      collections.find((collection) => collection.directory === "invoices-shared")
        ?.items.length ?? 0,
    quotes:
      collections.find((collection) => collection.directory === "quotes-shared")
        ?.items.length ?? 0,
  };
}
