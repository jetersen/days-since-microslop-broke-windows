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

export function archivePath(path = ""): string {
  const suffix = path.replace(/^\/+|\/+$/g, "");
  const base = import.meta.env.DEV ? paths.archive : "/";
  return suffix ? `${base}${suffix}/` : base;
}
