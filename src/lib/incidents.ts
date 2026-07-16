import type { CollectionEntry } from "astro:content";
import { siteUrl } from "@/links";

type Incident = CollectionEntry<"incidents">;

const ARCHIVE_ORIGIN = "https://microslopbroke.win";

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Incident URLs intentionally use the filename-derived ID without its date
 * prefix. This keeps URLs short and stable when a title or incident date is
 * corrected, while preserving the KB number used by searchers.
 */
export function incidentSlug(incident: Pick<Incident, "id" | "data">): string {
  const idSlug = normalizeSlug(incident.id);
  const kbSlug = incident.data.kb ? normalizeSlug(incident.data.kb) : "";

  if (kbSlug && idSlug.includes(kbSlug)) {
    return idSlug;
  }

  return kbSlug ? `${idSlug}-${kbSlug}` : idSlug;
}

export function incidentPath(
  incident: Pick<Incident, "id" | "data">
): string {
  const base = siteUrl("archive").replace(/\/$/, "");
  return `${base}/incidents/${incidentSlug(incident)}/`;
}

export function incidentCanonicalUrl(
  incident: Pick<Incident, "id" | "data">
): string {
  return `${ARCHIVE_ORIGIN}/incidents/${incidentSlug(incident)}/`;
}

export function sourceLabel(
  url: string,
  incident: Pick<Incident, "data">
): string {
  const { hostname, pathname } = new URL(url);
  const site = hostname.replace(/^www\./, "");
  const kb = incident.data.kb ?? "Windows update";

  if (hostname === "learn.microsoft.com") {
    return pathname.includes("/release-health/")
      ? `Microsoft Windows release health: ${kb} known issue`
      : `Microsoft Learn: ${kb}`;
  }

  if (hostname === "support.microsoft.com") {
    return `Microsoft Support: ${kb}`;
  }

  const publisherNames: Record<string, string> = {
    "bleepingcomputer.com": "BleepingComputer",
    "borncity.com": "Born's Tech and Windows World",
    "neowin.net": "Neowin",
    "theregister.com": "The Register",
    "windowscentral.com": "Windows Central",
    "windowsforum.com": "Windows Forum",
    "windowslatest.com": "Windows Latest",
  };
  const publisher = publisherNames[site] ?? site;

  return `${publisher}: ${kb} incident report`;
}

export function relatedIncidents(
  incident: Incident,
  incidents: Incident[],
  limit = 3
): Incident[] {
  const affected = new Set(incident.data.affected);

  return incidents
    .filter((candidate) => candidate.id !== incident.id)
    .map((candidate) => ({
      candidate,
      shared: candidate.data.affected.filter((tag) => affected.has(tag)).length,
      distance: Math.abs(
        candidate.data.date.getTime() - incident.data.date.getTime()
      ),
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.distance - b.distance ||
        b.candidate.data.date.getTime() - a.candidate.data.date.getTime()
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
