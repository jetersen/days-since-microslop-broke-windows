import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import { incidentGitDates } from "./src/lib/git-dates";
import { deployOutput } from "./src/integrations/deploy-output";

const archiveOrigin = "https://microslopbroke.win";
const gitDates = incidentGitDates();

export default defineConfig({
  site: archiveOrigin,
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname.startsWith("/archive"),
      serialize(item) {
        const url = new URL(item.url);
        url.pathname = url.pathname.replace(/^\/archive(?=\/|$)/, "") || "/";
        item.url = url.href;

        const slug = url.pathname.match(/^\/incidents\/([^/]+)\/?$/)?.[1];
        if (slug && gitDates.has(slug)) item.lastmod = gitDates.get(slug);

        return item;
      },
      namespaces: { news: false, video: false, xhtml: false },
    }),
    compress(),
    deployOutput(),
  ],
});
