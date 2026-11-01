---
title: Feature Zones
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Feature Zones

Features in the program are not thrown together in a pile; they are divided into several zones by "risk level and purpose". This page gives you an overview; for detailed usage of each zone, follow the corresponding link.

## One Table to Understand All Zones

| Zone | Positioning | What's Inside |
| --- | --- | --- |
| 🟢 Beginner Zone | Not enabled by default, no risk confirmation required | Win11 classic context menu, taskbar/Explorer tweaks, disabling ads/telemetry/notification suggestions, safe UWP uninstall (whitelist), power/indexing/autoplay/thumbnail optimizations, one-click restore |
| 🟡 Advanced Zone | Unlocked after checking the risk warning | Windows Update pause limit / disabling, one-click restore |
| 📦 Uninstaller | Standalone page | Batch Win32 software uninstall, leftover scan and cleanup, cleanup report export, linked with "Unlock" |
| 🔓 Unlock | Standalone page | Find locking processes, close programs to release locks, delayed delete on boot |
| 🔴 High-Risk Plugin Zone | External DLL plugins | Disable Defender / Disable Firewall / Remove Edge·WebView2. The main program itself contains no high-risk code; it only dynamically loads plugin DLLs under the `plugins` directory |
| ⚙️ Settings | Standalone page | Appearance, import/export of configuration presets, log directory, one-click initialize everything, About and changelog |
| 💖 Special Thanks | Standalone page | Other open source projects integrated into this project |

## Why It's Divided This Way

- Operations in the **Beginner Zone** are relatively gentle, so no risk confirmation is required — suitable for folks who just finished installing their system;
- Operations in the **Advanced Zone** have a bigger impact (e.g. touching Windows Update), so you must check the risk warning before they unlock;
- Since v0.1.1, **Uninstaller** and **Unlock** have been split out of their original zones, each becoming an independent navigation category and standalone page — more comfortable to use;
- The **High-Risk Plugin Zone** is the most special: these features (disabling Defender, removing Edge, and the like) are high-risk, so the author made them all **external plugins** — the main program itself has not a single line of high-risk code. If you don't use the plugins, the program simply doesn't contain these features at all.

## The Safety Baseline All Zones Follow

- All modification, deletion and cleanup operations **require manual confirmation by the user**; there is no auto-execution logic whatsoever;
- Leftover and locked items are **unchecked by default** — you must check them yourself to clean them;
- Built-in blacklist: core system directories such as `C:\Windows`, `System32` and `WinSxS`, as well as core system processes, are forbidden from being force-terminated;
- The program is not packed or obfuscated; the underlying layer only calls Microsoft's native Win32 APIs (RestartManager, MoveFileEx, Registry, etc.); all code is open source and inspectable.

## Next Steps

- [Beginner Zone and Advanced Zone](/en/docs/beginner-and-advanced.html): system tuning features
- [Uninstaller](/en/docs/uninstaller.html): batch uninstall and leftover cleanup
- [Unlock](/en/docs/unlock.html): the savior when files are locked and can't be deleted
- [High-Risk Plugin Zone](/en/docs/high-risk-zone.html): disable Defender / Firewall, remove Edge
- [Settings and About](/en/docs/settings.html): appearance, presets, logs, etc.
