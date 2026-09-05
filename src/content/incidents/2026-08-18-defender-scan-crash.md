---
title: "Defender update protects PCs from the grave threat of completing a scan"
date: 2026-08-18
severity: broken
affected: ["Windows Defender", "Antivirus", "Security", "System Stability"]
fixed: true
fixDate: 2026-08-19
sources:
  - "https://www.bleepingcomputer.com/news/microsoft/microsoft-fixes-known-issue-causing-windows-defender-crashes/"
  - "https://borncity.com/win/2026/08/19/windows-defender-crashes-during-a-quick-scan-august-18-2026/"
  - "https://mat.ethz.ch/department/services/it-support/D-MATL-ISG-News/2026/08/windows-microsoft-fixes-windows-defender-crashes-with-signature-update-14572360.html"
---

A Microsoft Defender security-intelligence update distributed through Windows Update caused quick and full scans to fail on some Windows 10 and Windows 11 systems, sometimes stopping the antivirus service and displaying “Threat service has stopped. Restart it now.” Affected installations logged `MsMpEng.exe` crashes in `mpengine.dll` with access-violation exception `0xc0000005`; users also reported offline scans stalling near completion. Microsoft repaired its antivirus with another antivirus update less than a day later: Defender signature version 1.457.236.0 or newer restored scanning automatically.
