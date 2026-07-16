import { readdir, readFile, writeFile } from "node:fs/promises";

const incidentsDir = new URL("../src/content/incidents/", import.meta.url);
const files = (await readdir(incidentsDir)).filter((name) => name.endsWith(".md"));

for (const file of files) {
  const path = new URL(file, incidentsDir);
  const lines = (await readFile(path, "utf8")).split("\n");
  const seen = new Set<string>();
  let inSources = false;

  const deduplicated = lines.filter((line) => {
    if (/^sources:/.test(line)) {
      inSources = true;
      return true;
    }

    if (inSources && (/^[A-Za-z]/.test(line) || line === "---")) {
      inSources = false;
    }

    if (!inSources) return true;

    const url = line.match(/https?:\/\/[^\s"']+/)?.[0];
    if (!url || !seen.has(url)) {
      if (url) seen.add(url);
      return true;
    }

    console.log(`  removed duplicate: ${url} (${file.replace(/\.md$/, "")})`);
    return false;
  });

  await writeFile(path, deduplicated.join("\n"));
}
