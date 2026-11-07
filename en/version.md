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

## v0.2.0 · 2026-11-06

- [New] Multilingual support: added an external language pack mechanism (`.meowlang`, whose content is JSON text); the `lang` folder under the program directory is scanned automatically at startup.
- [New] Simplified Chinese, as the source language, is embedded directly in the program itself and is usable without installing any language pack.
- [New] Official language packs: Traditional Chinese, Japanese and English, released with the program in the `lang` folder.
- [New] The settings page adds a "Select Language" button: a separate window lists all language packs in the `lang` directory, where you can view details and load the selected language (it restarts automatically to take effect).
- [New] The settings page adds an "Install Language Pack" button: after selecting a `.meowlang` file it shows the pack name, author (official language packs carry a green shield badge), applicable version, install time, language type, language code, file size, description and author website.
- [New] Installation flow: an installation window with a progress bar; on success it shows "Language pack installed successfully!", on failure it shows the reason and the log path; third-party language packs require a second confirmation.
- [New] Update/downgrade of a language pack with the same name: version numbers are compared automatically with a second confirmation; if the author or author website differ, overwriting is refused and the old language pack must be deleted manually.
- [New] Language pack applicable versions support separating multiple version numbers with `|` (e.g. `0.2.0 | 0.2.1 | 0.2.2`).
- [New] The settings page adds "Check for updates": requests the latest version number from the official update endpoint and compares it automatically with the current version; when a new version exists, it shows the version number, update content and a "Go to the official website for the new version" button.
- [New] Unsupported version detection: when the unsupported versions list returned by the update endpoint includes the current version, a forced update prompt pops up at startup, and the program cannot be used until you update.
- [Fixed] In the Language Manager window, language pack names in list items were not displayed, and selected items had no highlight effect.

**Full Changelog**: <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/compare/v0.1.2...v0.2.0>

<VTDocNote>
The official language packs (Traditional Chinese, Japanese, English) are also released as a standalone version `v1.1.0-lang`, so users who only want to update the language packs can download the `.meowlang` file separately. For usage docs, see [Settings and About](/en/docs/settings.html); for the language pack format, see [Language Pack Development](/en/dev/language-pack-development.html).
</VTDocNote>

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
