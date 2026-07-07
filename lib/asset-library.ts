type LibraryConfig = {
  directory: string;
  files: string[];
  title: string;
};

export type AssetItem = {
  extension: string;
  href: string;
  label: string;
  name: string;
};

export type AssetLibrary = Omit<LibraryConfig, "files"> & {
  items: AssetItem[];
};

const libraries: LibraryConfig[] = [
  {
    directory: "logos",
    title: "Brand logos",
    files: [
      "leaseMagnetsCollapsedIconTYG.png",
      "lm-favicon-tyg.png",
      "lm-logo-light-tyg.svg",
      "lm-logo-tyg-white.svg",
      "lm-logo-tyg.png",
      "lm-logo-tyg.svg",
      "tour-logo-dark-tyg.svg",
      "tour-logo-tyg.svg",
      "tourCollapsedIconTYG.png",
      "tourLogov2TYG.png",
    ],
  },
  {
    directory: "invoices-shared",
    title: "Shared invoices",
    files: [
      "Vantage-Cardinal-Premium-Statement-of-Account.pdf",
      "cls-bulk-tour-production-actor.html",
      "cls-gateway-lofts-tour-production-actor.html",
      "cls-midtown-905-tour-production-actor.html",
      "forum-actor-march-per-region.html",
      "forum-actor-march.html",
      "forum-campus-suites-quad-monthly-subscription-may-dec-2026.html",
      "forum-campus-suites-quad-tour-production-actor.html",
      "forum-campus-suites-quad.html",
      "forum-expedited-417-nelson-west-village-suites.html",
      "forum-lmvd1el-0001-1eleven-ottawa.html",
      "forum-lmvd3k8-0001-308-king-waterloo.html",
      "forum-lmvdabw-0001-alma-byward-market-ottawa.html",
      "forum-lmvdagp-0001-alma-guelph.html",
      "forum-lmvdaql-0001-alma-quartier-latin-montreal.html",
      "forum-lmvdash-0001-alma-sandy-hill-ottawa.html",
      "forum-lmvdasv-0001-alma-shaughnessy-village-montreal.html",
      "forum-lmvdfhh-0001-fergus-hespeler-house-waterloo.html",
      "forum-lmvdkst-0001-king-street-towers-waterloo.html",
      "forum-lmvdtho-0001-theo-ottawa.html",
      "forum-lmvdugc-0004-monthly-subscription-may-dec-2026.html",
      "forum-ugc-march.html",
      "reputation-data-student-senior-march-2026.html",
      "vantage-cardinal-soa-premium.html",
    ],
  },
  {
    directory: "quotes-shared",
    title: "Shared quotes",
    files: [
      "abbot-peakmade-matterport-video.html",
      "alaina-beachclub-the-essex-station42.html",
      "cardinal-group-management-services-proposal.html",
      "cls-the-waverly-ads.html",
      "csl-nickhindadi-canada-liveandai.html",
      "jaylyndandrittenhouse-peakmade-new.html",
      "jaylyndandrittenhouse-peakmade.html",
      "margeandmariah.html",
      "md-real-chicago-straits-row.html",
      "md-real-ny-313gramercy-181front.html",
      "nicole-haasch-peakmade-urbania-nomi-125.html",
      "socam-290-tour-proposal.html",
      "spm-living-proposal.html",
      "the-carmin-tempe-tour-proposal.html",
      "the-waverly-social-video-photo-ads.html",
    ],
  },
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

function readLibrary({ directory, files, title }: LibraryConfig): AssetLibrary {
  const items = files
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const extension = name.split(".").pop()?.toUpperCase() ?? "";

      return {
        extension,
        href: buildHref(directory, name),
        label: formatLabel(name),
        name,
      };
    });

  return { directory, title, items };
}

export async function getAssetLibrary() {
  return libraries.map(readLibrary);
}

export async function getAssetSummary() {
  const collections = await getAssetLibrary();

  return {
    logos:
      collections.find((collection) => collection.directory === "logos")?.items
        .length ?? 0,
    invoices:
      collections.find((collection) => collection.directory === "invoices-shared")
        ?.items.length ?? 0,
    quotes:
      collections.find((collection) => collection.directory === "quotes-shared")
        ?.items.length ?? 0,
  };
}
