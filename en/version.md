---
title: Changelog
editLink: false
lastUpdated: false
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Changelog

The versioning scheme has been in effect since v0.1.1: **MAJOR.MINOR.PATCH**

- MAJOR: incremented by 1 for major architectural adjustments / breaking changes (during the 0.x stage, this means an overall rewrite)
- MINOR: incremented by 1 when new features are added
- PATCH: incremented by 1 for bug fixes / optimizations

Entries below are in reverse chronological order, newest first. For complete code changes, see the **Full Changelog** link of each version.

## v0.1.2 · 2026-10-24

- [New] All pages got a web-style right scrollbar: it appears automatically when content overflows the window; you can drag the thumb up and down or click the track to page; the thumb turns pink on hover/drag; rounded Win11 style.
- [Fixed] On the unlock page, the issue where the locking process list collapsed in height in small windows and the scroll wheel was swallowed by the inner list — it now scrolls normally with the whole page.

**Full Changelog**: <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/compare/v.0.1.1...v0.1.2>

<VTDocNote>
This version does not yet provide an installer-version package. The installer is the installer of the self-contained version — please stay tuned.
</VTDocNote>

## v0.1.1 · 2026-10-24

- [Fixed] Logging system: logs are now recorded globally, covering all of the user's setting operations, execution results and timestamps (INFO/WARN/ERROR); log files are no longer empty.
- [New] The settings page adds "One-Click Initialize Everything": restores all feature settings to their default state, resets appearance settings, and clears configuration presets.
- [New] Versioning scheme: from this version on it is v0.1.1; the About page shows the current version; a new "View Changelog" button (in this window) is added.
- [New] Special thanks: each open source project gets a "Visit" button that opens the project's homepage/GitHub repository with one click; added the EZ-Mirror entry; fixed blurry fonts (larger size, darker color).
- [New] Interface reorganization: "Uninstaller" and "Unlock" are split out of the beginner/advanced zones, each becoming an independent navigation category with its own standalone page.
- [New] The About page adds GitHub repository information and a one-click "Go to GitHub Repository" button.
- [Fixed] Optimized the colors and text readability of switches and buttons in anime mode.

**Full Changelog**: <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/commits/v.0.1.1>

---

Thank you for supporting this project! If you encounter any issue or bug, please head to the project's official GitHub repository and open an Issue!

Official GitHub repository: <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
