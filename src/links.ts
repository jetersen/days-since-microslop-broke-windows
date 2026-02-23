const domains = {
  today: "https://didmicroslopbreakwindows.today",
  archive: "https://microslopbroke.win",
} as const;

const paths = {
  today: "/today/",
  archive: "/archive/",
} as const;

export function siteUrl(site: "today" | "archive"): string {
  return import.meta.env.DEV ? paths[site] : domains[site];
}
