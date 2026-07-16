import { readdir, readFile } from "node:fs/promises";

const incidentsDir = new URL("../src/content/incidents/", import.meta.url);
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36";
const maxRetries = 5;

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function sourceUrls(markdown: string): string[] {
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "";
  const sources = frontmatter.match(/^sources:\s*\n((?:\s+-\s+.*\n?)*)/m)?.[1] ?? "";
  return [...sources.matchAll(/https?:\/\/[^\s"']+/g)].map(([url]) => url);
}

async function statusFor(url: string): Promise<number> {
  let backoff = 2_000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": userAgent },
        signal: AbortSignal.timeout(15_000),
      });

      if (response.status !== 429 || attempt === maxRetries) {
        return response.status;
      }
    } catch {
      if (attempt === maxRetries) return 0;
    }

    console.error(
      `  retry ${attempt + 1}/${maxRetries} in ${backoff / 1_000}s: ${url}`,
    );
    await sleep(backoff);
    backoff *= 2;
  }

  return 0;
}

const files = (await readdir(incidentsDir)).filter((name) => name.endsWith(".md"));
const seen = new Set<string>();
let ok = 0;
let failed = 0;

for (const file of files) {
  const markdown = await readFile(new URL(file, incidentsDir), "utf8");

  for (const url of sourceUrls(markdown)) {
    if (seen.has(url)) continue;
    seen.add(url);

    const status = await statusFor(url);
    if (status >= 200 && status < 400) {
      ok++;
    } else {
      failed++;
      console.log(` FAIL [${status || "ERR"}] ${url} (${file.replace(/\.md$/, "")})`);
    }
  }
}

console.log(`\nResults: ${ok}/${seen.size} OK, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
