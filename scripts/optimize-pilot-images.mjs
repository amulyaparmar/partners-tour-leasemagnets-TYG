import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";

// Reuse the image encoder bundled with Next.js; no extra dependency is needed.
const require = createRequire(import.meta.resolve("next/package.json"));
const sharp = require("sharp");
const directory = new URL("../public/knowledgebase/tour-report-ai-marketing-visibility-platform/", import.meta.url);
const placeholders = {};
for (const name of ["traffic", "reviews", "search", "ads", "comp-ads"]) {
  const source = new URL(`pilot-${name}.png`, directory);
  for (const width of [320, 960, 1920]) {
    await sharp(source.pathname)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 1920 ? 85 : 78, effort: 6 })
      .toFile(new URL(`pilot-${name}-${width}.webp`, directory).pathname);
  }
  const preview = await sharp(source.pathname).resize({ width: 24 }).webp({ quality: 35 }).toBuffer();
  placeholders[name] = `data:image/webp;base64,${preview.toString("base64")}`;
}
await writeFile(new URL("../app/knowledgebase/tour-report-ai-marketing-visibility-platform/pilot-placeholders.json", import.meta.url), JSON.stringify(placeholders, null, 2) + "\n");
