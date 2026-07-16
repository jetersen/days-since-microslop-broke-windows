import type { AstroIntegration } from "astro";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const DEPLOY_DIR = ".deploy";

async function copyIfPresent(source: string, destination: string) {
  if (existsSync(source)) {
    await cp(source, destination, { recursive: true });
  }
}

async function appendSitemap(robotsPath: string, sitemapUrl: string) {
  const robots = await readFile(robotsPath, "utf8");
  await writeFile(robotsPath, `${robots.trimEnd()}\n\nSitemap: ${sitemapUrl}\n`);
}

export function deployOutput(): AstroIntegration {
  return {
    name: "deploy-output",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const dist = fileURLToPath(dir);
        const today = `${DEPLOY_DIR}/today`;
        const archive = `${DEPLOY_DIR}/archive`;

        await rm(DEPLOY_DIR, { recursive: true, force: true });
        await Promise.all([
          mkdir(today, { recursive: true }),
          mkdir(archive, { recursive: true }),
        ]);

        const copySharedAssets = (target: string) =>
          Promise.all([
            copyIfPresent(join(dist, "_astro"), join(target, "_astro")),
            copyIfPresent(join(dist, "images"), join(target, "images")),
            cp(join(dist, "favicon.svg"), join(target, "favicon.svg")),
            cp(join(dist, "robots.txt"), join(target, "robots.txt")),
          ]);

        await Promise.all([copySharedAssets(today), copySharedAssets(archive)]);

        const sitemapFiles = (await readdir(dist)).filter((name) =>
          /^sitemap-\d+\.xml$/.test(name),
        );

        await Promise.all([
          cp(join(dist, "today/index.html"), join(today, "index.html")),
          cp(join(dist, "archive"), archive, { recursive: true }),
          cp(join(dist, "sitemap-index.xml"), join(archive, "sitemap-index.xml")),
          ...sitemapFiles.map((name) =>
            cp(join(dist, name), join(archive, name)),
          ),
        ]);

        await Promise.all([
          appendSitemap(
            `${today}/robots.txt`,
            "https://didmicroslopbreakwindows.today/sitemap.xml",
          ),
          appendSitemap(
            `${archive}/robots.txt`,
            "https://microslopbroke.win/sitemap-index.xml",
          ),
          writeFile(
            `${today}/sitemap.xml`,
            `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://didmicroslopbreakwindows.today/</loc>
  </url>
</urlset>
`,
          ),
        ]);
      },
    },
  };
}
