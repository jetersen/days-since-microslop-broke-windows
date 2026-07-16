import { execFileSync } from "node:child_process";

const INCIDENTS_DIR = "src/content/incidents";
let dates: Map<string, string> | undefined;
let firstDates: Map<string, string> | undefined;

function incidentSlug(path: string): string | undefined {
  return path
    .split("/")
    .pop()
    ?.replace(/\.md$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .toLowerCase();
}

export function incidentGitDates(): Map<string, string> {
  if (dates) return dates;

  try {
    const log = execFileSync(
      "git",
      ["log", "--format=@@%cI", "--name-only", "--", INCIDENTS_DIR],
      { encoding: "utf8" }
    );
    dates = new Map<string, string>();
    firstDates = new Map<string, string>();
    let commitDate: string | undefined;

    for (const line of log.split("\n")) {
      if (line.startsWith("@@")) {
        commitDate = line.slice(2);
        continue;
      }

      if (!commitDate || !line.startsWith(`${INCIDENTS_DIR}/`)) continue;
      const slug = incidentSlug(line);
      if (!slug) continue;
      if (!dates.has(slug)) dates.set(slug, commitDate);
      firstDates.set(slug, commitDate);
    }

    return dates;
  } catch {
    dates = new Map();
    firstDates = new Map();
    return dates;
  }
}

/**
 * Returns the last committed change to a content file. Builds without Git
 * metadata intentionally return undefined instead of inventing a timestamp.
 */
export function incidentGitLastModified(path: string): string | undefined {
  const slug = incidentSlug(path);
  return slug ? incidentGitDates().get(slug) : undefined;
}

export function incidentGitFirstPublished(path: string): string | undefined {
  incidentGitDates();
  const slug = incidentSlug(path);
  return slug ? firstDates?.get(slug) : undefined;
}
