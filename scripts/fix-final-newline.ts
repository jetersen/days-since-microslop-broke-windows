import { readdir, readFile, writeFile } from "node:fs/promises";

const incidentsDir = new URL("../src/content/incidents/", import.meta.url);
const files = (await readdir(incidentsDir)).filter((name) => name.endsWith(".md"));

for (const file of files) {
  const path = new URL(file, incidentsDir);
  const content = await readFile(path, "utf8");

  if (content && !content.endsWith("\n")) {
    await writeFile(path, `${content}\n`);
    console.log(`fixed: ${file}`);
  }
}
