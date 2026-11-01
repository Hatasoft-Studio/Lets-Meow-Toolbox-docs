---
title: Settings and About
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Settings and About

The settings page handles the program's own "household affairs": appearance, configuration, logs and version info. This page explains every entry clearly.

## Appearance

The program ships with multiple theme brushes, including a light theme and **anime mode** (yes, this is a toolbox with an anime-style modern UI — the wallpaper and color scheme are part of the package).

- On non-Win11 systems, the window background may automatically fall back to a solid color; this is expected behavior and does not affect usage;
- v0.1.1 improved the colors and text readability of switches and buttons in anime mode — if the text looked faint on an older version, upgrading is recommended.

## Import / Export Configuration Presets

The feature settings you make in the program can be exported as a preset file and saved; after switching PCs or reinstalling the system, import it back — no need to check everything one by one again.

## Log Directory

The program has built-in global logging (changed to global recording since v0.1.1): all your setting operations, execution results and timestamps are recorded at INFO / WARN / ERROR levels — no more empty files.

- Log location: `%LocalAppData%\LetsMeowToolbox\logs\meow-DATE.log`
- Paste `%LocalAppData%\LetsMeowToolbox\logs` into the Explorer address bar and press Enter to open it.

## One-Click Initialize Everything

The "master undo switch" added in v0.1.1 — three things done with one click:

1. Restore all feature settings to their default state;
2. Reset appearance settings;
3. Clear configuration presets.

If you want to bring the program back to its "just installed" state, this is it.

## About and Changelog

The About page shows:

- **Current version number** (the versioning scheme was introduced in v0.1.1: MAJOR.MINOR.PATCH);
- **"View Changelog" button**: view the update content of each version directly inside the program window;
- **GitHub repository info and "Go to GitHub Repository" button**: open the official repository <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox> with one click.

## Special Thanks

The program also has a standalone "💖 Special Thanks" page, listing the open source projects this project references and integrates (HandyControl, Open-Shell, Bulk Crap Uninstaller, Win11Debloat, Sophia Script) as well as EZ-Mirror, which provides download acceleration; each entry has a "Visit" button. For the corresponding page on the website, see [Special Thanks](/en/Contributor.html).
