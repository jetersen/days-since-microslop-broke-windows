---
title: "OneDrive update installs another Photos app because one apparently wasn't enough"
date: 2026-07-29
severity: annoyance
affected: ["OneDrive", "Photos", "Enterprise", "Privacy", "Applications"]
fixed: false
sources:
  - "https://www.windowslatest.com/2026/08/07/microsoft-admits-it-force-installed-ai-powered-onedrive-on-windows-11-says-its-not-training-on-your-faces-really/"
  - "https://www.windowscentral.com/microsoft/windows-11/were-fixing-that-microsoft-admits-error-that-caused-new-onedrive-photos-app-to-appear-on-millions-of-windows-11-pcs"
  - "https://learn.microsoft.com/en-us/sharepoint/sync-client-update-process"
---

Microsoft used the self-updating OneDrive sync client to add a new OneDrive Photos experience to Windows 11 PCs without asking, including enterprise devices and machines whose owners did not use a personal Microsoft account. The WebView2 app appeared separately in Start and Windows Search, could display local photos, and initially offered no independent uninstall option: removing it also meant removing the OneDrive sync client. Microsoft said its optional face-grouping feature processes only photos stored in OneDrive, runs in the cloud with explicit consent, and does not train its AI models. After the rollout escaped much farther than intended, Microsoft called the Photos experience an incubation project, promised separate removal and administrative controls, and began fixing the deployment it had helpfully volunteered everyone to test.
