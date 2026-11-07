---
title: Settings and About
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Settings and About

The settings page handles the program's own "household affairs": language, software updates, appearance, configuration, logs and version info. Starting with v0.2.0, two new cards — **Language** and **Software Updates** — sit at the top of the Settings page; this page walks through them one card at a time, in card order.

## Language

Starting with v0.2.0, the program supports **external language packs**. The rules are simple:

- **Simplified Chinese is the source language** and is embedded directly in the program itself, so even with no language pack installed, the interface will never turn foreign;
- Other languages (Traditional Chinese, Japanese, English, etc.) are stored as `.meowlang` files in the `lang` folder under the program directory, and are scanned automatically at startup;
- The official language packs (Traditional Chinese, Japanese, English) ship with the program — after extraction they are already in the `lang` directory, no separate download required.

The Language card shows "Current language: xxx" and has two buttons below.

### Select Language

Clicking "Select Language" opens a separate "Language Manager" window:

- The top of the window shows the full path of the language pack directory;
- The list shows all language packs in the `lang` directory, in the order: embedded Simplified Chinese → official language packs → third-party language packs, then sorted by name;
- After selecting an item you can view its details (pack name, author, version, applicable version, description, author website, etc.);
- After clicking "Load Selected Language", the program first checks whether this language pack applies to the current version; once it passes, a details confirmation pops up, and confirming the load will **automatically restart the program** to take effect — the restart is so that all interface text gets re-translated; this is normal.

<VTDocTip>
When a language pack fails to load, the program tells you why (e.g. "This language pack applies to 0.1.2, while the current software version is v0.2.0") and writes it to the log — it never fails silently.
</VTDocTip>

### Install Language Pack

Clicking "Install Language Pack" opens a file picker; after you select a `.meowlang` file, the flow is as follows:

1. **Read and validate**: check that the required fields `id`, `name`, `author`, `version` and `strings` are all present; a malformed format errors out directly and is written to the log;
2. **Version compatibility check**: the applicable version declared by the language pack must match the current program version, otherwise installation is refused;
3. **Details confirmation**: a dialog shows the pack name, author, applicable version, install time, language type, language code, file size, description and author website; official language packs carry a **green shield badge** next to the author;
4. **Third-party confirmation**: if the author/author website are not official (`Hatasoft-Studio` + the official site), another prompt appears: "This language pack is provided by a third-party individual author/community. Continue installing?";
5. **Progress window**: copies the language pack into the `lang` directory with a progress bar;
6. **Result prompt**: on success it shows "Language pack installed successfully!"; on failure it shows the reason and the log file path.

After installation, you can switch to the newly installed language in "Select Language".

### Updating / Downgrading a Language Pack with the Same Name

If a language pack with the same name already exists in the `lang` directory, installation will:

- Compare the version numbers first and tell you whether this is an **update**, a **downgrade** or a **reinstall**, with a second confirmation;
- If the **author or author website** of the new and old packs differ, the program refuses to overwrite directly and asks you to manually delete the old language pack and reinstall — this prevents someone from using another pack's ID to push an overwrite.

### How to Write the Applicable Range

The `appVersion` field of a language pack determines which versions it can be used on:

| Value | Meaning |
| --- | --- |
| `*` or left blank | Applies to all versions |
| `>=0.2.0` | v0.2.0 and later |
| `0.2.0 \| 0.2.1 \| 0.2.2` | Applies only to these versions (separating multiple version numbers with `\|` is supported since v0.2.0) |
| `<0.3.0` | Versions before v0.3.0 |

`>=`, `<=`, `>`, `<`, `=` and `*` are also supported, and multiple conditions can be combined with spaces or commas (all must be satisfied). It doesn't matter if you don't understand them — when an install fails, the program spells out the reason.

## Software Updates

v0.2.0 added a "Software Updates" card containing a single "Check for updates" button.

After clicking it, the program requests the latest version number, download address, update notes and the "list of unsupported versions" from the official update endpoint (`https://api.lets-meow-toolbox.hatasoft365.top/`), then:

- **New version available**: a dialog shows the current version, latest version, version number and update content, plus a "Go to the official website for the new version" button; if you don't want to update right away, click "Later";
- **Already up to date**: a message appears right next to the button — "You are already on the latest version (v0.2.0)";
- **Network failure or endpoint error**: it shows "Check for updates failed: reason"; this does not affect continued use of the program — just try again later.

<VTDocWarning>
**Unsupported version detection:** if the "unsupported versions" list returned by the endpoint includes the version you are using, the program shows a forced-update prompt **at startup**, titled "This version is no longer supported", where the only options are "Go to the official website for the new version" or "Exit the program" — you cannot continue using it until you update. This is to retire old versions completely and avoid known issues being used further.
</VTDocWarning>

## Appearance

The program ships with multiple theme brushes, including a light theme and **anime mode** (yes, this is a toolbox with an anime-style modern UI — the wallpaper and color scheme are part of the package).

- On non-Win11 systems, the window background may automatically fall back to a solid color; this is expected behavior and does not affect usage;
- v0.1.1 improved the colors and text readability of switches and buttons in anime mode — if the text looked faint on an older version, upgrading is recommended.

## Import / Export Configuration Presets

The feature settings you make in the program can be exported as a `.meowpreset` preset file and saved; after switching PCs or reinstalling the system, import it back — no need to check everything one by one again.

## Log Directory

The program has built-in global logging (changed to global recording since v0.1.1): all your setting operations, execution results and timestamps are recorded at INFO / WARN / ERROR levels — no more empty files.

- Log location: `%LocalAppData%\LetsMeowToolbox\logs\meow-DATE.log`
- Paste `%LocalAppData%\LetsMeowToolbox\logs` into the Explorer address bar and press Enter to open it.
- Language pack installation failures and update check failures are also written to this log.

## One-Click Initialize Everything

The "master undo switch" added in v0.1.1 — three things done with one click:

1. Restore all feature settings to their default state;
2. Reset appearance settings;
3. Clear configuration presets.

If you want to bring the program back to its "just installed" state, this is it.

<VTDocNote>
One-click initialization does **not** delete the language packs you installed — language packs live only in the `lang` directory. To completely remove a language, simply delete the corresponding `.meowlang` file in the `lang` directory.
</VTDocNote>

## About and Changelog

The About page shows:

- **Current version number** (the versioning scheme was introduced in v0.1.1: MAJOR.MINOR.PATCH; the current version is v0.2.0);
- **"View Changelog" button**: view the update content of each version directly inside the program window;
- **GitHub repository info and "Go to GitHub Repository" button**: open the official repository <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox> with one click.

## Special Thanks

The program also has a standalone "💖 Special Thanks" page, listing the open source projects this project references and integrates (HandyControl, Open-Shell, Bulk Crap Uninstaller, Win11Debloat, Sophia Script) as well as EZ-Mirror, which provides download acceleration; each entry has a "Visit" button. For the corresponding page on the website, see [Special Thanks](/en/Contributor.html).
