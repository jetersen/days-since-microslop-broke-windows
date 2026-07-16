# Days Since Microslop Broke Windows

A satirical "days since the last workplace accident" counter — except the workplace is Windows Update and the accidents keep coming. The site tracks every Windows update that broke Windows in some way, with a running counter since the latest incident and a full archive going back to 2021.

Titles are tongue-in-cheek; the facts underneath are real, sourced, and cross-checked against [Microsoft's release health dashboard](https://learn.microsoft.com/en-us/windows/release-health/).

## Live sites

One Astro build, two deployments:

| Site | Content |
| :--- | :--- |
| [didmicroslopbreakwindows.today](https://didmicroslopbreakwindows.today) | The counter — days since the last incident |
| [microslopbroke.win](https://microslopbroke.win) | The archive — every incident on record |

Deployment happens automatically on push to `main` via GitHub Actions, which splits the build output and ships each site to Cloudflare Workers (`wrangler.today.toml` / `wrangler.archive.toml`).

## How it works

Incidents live in `src/content/incidents/` as one markdown file per incident (`YYYY-MM-DD-kbNNNNNNN.md`), validated by the zod schema in `src/content.config.ts`:

```yaml
---
title: "Windows forgets how to turn off, laptops cook in bags"
date: 2026-01-13
kb: "KB5073455"
severity: broken            # annoyance | broken | catastrophic
affected: ["Shutdown", "Hibernation", "Sleep"]
fixed: true
fixDate: 2026-02-10
sources:
  - "https://..."
---

One paragraph describing what broke, factually and with sources.
```

See [CLAUDE.md](CLAUDE.md) for the full workflow of researching and adding new incidents.

## Development

Requires Node.js >= 22.12.

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the build locally |
