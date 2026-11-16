import { cp, mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const builtClient = path.join(projectRoot, "dist", "public");
const vercelPublic = path.join(projectRoot, "public");
const runtimeDirectory = path.join(vercelPublic, "__runtime");

await rm(vercelPublic, { recursive: true, force: true });
await cp(builtClient, vercelPublic, { recursive: true });
await mkdir(runtimeDirectory, { recursive: true });
await rename(
  path.join(vercelPublic, "index.html"),
  path.join(runtimeDirectory, "index.html")
);

// These documents are generated dynamically by Express so indexing remains gated by site settings.
await Promise.all([
  rm(path.join(vercelPublic, "robots.txt"), { force: true }),
  rm(path.join(vercelPublic, "sitemap.xml"), { force: true }),
  rm(path.join(vercelPublic, "api"), { recursive: true, force: true }),
]);

console.log(
  "Prepared Vercel static assets in public/ and retained the SPA template for Express SSR."
);
