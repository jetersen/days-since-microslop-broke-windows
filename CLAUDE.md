# days-since-microslop-broke-windows

A satirical "days since the last incident" site tracking Windows updates that broke Windows. Built with Astro, deployed via Cloudflare (`wrangler.today.toml` / `wrangler.archive.toml`).

## Adding new incidents

Incidents live in `src/content/incidents/`, one markdown file per incident, named `YYYY-MM-DD-kbNNNNNNN.md`. The schema is enforced by zod in `src/content.config.ts`:

```yaml
---
title: "Short punchy description of what broke"
date: YYYY-MM-DD          # date of the ORIGINATING update, not when news broke
kb: "KB1234567"           # the KB that caused the breakage (optional)
severity: annoyance | broken | catastrophic
affected: ["Boot", "BSOD", ...]
fixed: false              # set true + fixDate when Microsoft resolves it
fixDate: YYYY-MM-DD       # optional
sources:
  - "https://..."
---

One paragraph of prose describing the incident.
```

### Workflow for updating the site

1. Find the date of the most recent incident file (`ls src/content/incidents/ | tail`) — that's the start of the search window.
2. Search news for Windows update breakage between then and today. Every Patch Tuesday (second Tuesday of the month) is a candidate, plus preview/out-of-band updates. Good sources: Windows Latest, Neowin, BleepingComputer, gHacks, Windows Central, and Microsoft's release health pages (`learn.microsoft.com/en-us/windows/release-health/status-windows-11-*`).
3. Cross-check KB numbers and dates against Microsoft release health — news outlets sometimes attribute an issue to the wrong update. Use the *originating update* (per release health) for the file's `date` and `kb`.
4. While searching, also check whether existing `fixed: false` incidents got resolved; if so, set `fixed: true` and `fixDate` (date of the fixing update) and optionally add a source documenting the fix.
5. Validate with `npm run build` — the zod schema will reject malformed frontmatter.

### Conventions

- **Tone is satirical, facts are not.** The site is a joke ("days since Microslop broke Windows"), so titles can and should be a little funny — e.g. "Preview update turns Dell laptops into shutdown-prone space heaters" — and the body can carry the same dry wit. The line: humor lives in the phrasing, never in the facts. Every claim in the description must stay true to the issue at hand — no exaggerated or invented details.
- **Severity:** `annoyance` = cosmetic/minor, `broken` = a feature or install process genuinely broken, `catastrophic` = boot failures, BSODs, data loss, lockouts.
- **`affected` tags:** reuse existing tags where possible (check with `grep -h '^affected:' src/content/incidents/*.md`). Common ones: Boot, BSOD, File Explorer, Windows Update, Networking, Installation, BitLocker, Enterprise, Performance. New tags are fine for genuinely new things (e.g. OneDrive, AutoCAD).
- **Body:** one paragraph, factual and sourced, written with dry wit. Include error codes, affected hardware/configs, and workaround/fix status.
