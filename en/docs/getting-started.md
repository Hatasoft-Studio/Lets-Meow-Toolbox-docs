---
title: Getting Started
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Getting Started

This page walks you, from scratch, through downloading Let's Meow! Toolbox and getting it running. No expertise is needed at any point — just follow along and click.

## First, Check Whether Your PC Meets the Requirements

- **System**: Windows 10 or Windows 11 (only these two are supported; Win7/8 won't work)
- **Architecture**: 64-bit (x64)
- That's it. Whether you need to install a runtime beforehand depends on which version you download — explained below.

## Step 1: Grab the Package from the Download Page

Open [Download](/en/download.html) at the top of the website. This page **queries all versions from GitHub by itself** — no need to hunt for links manually:

- There are two "update channels": **Release** (official versions) and **Pre Release** (pre-release versions); for daily use, just pick Release;
- The "Version" dropdown lists all versions under that channel, with the latest at the top; you can also pick an earlier version;
- Based on your PC, the page puts the most suitable package into a big button at the most prominent position;
- If a certain version does not offer an installer version, the installer button is hidden automatically — this is normal.

There are two download lines:

1. **GitHub**: the official channel. Since GitHub's servers are overseas, downloads can sometimes be very slow;
2. **EZ-Mirror mirror**: switch to this line if the download is slow; acceleration is provided by [EZ-Mirror](https://mirror.hatasoft365.top/).

<VTDocNote>
Pre Release versions **can only be downloaded from GitHub**; the mirror site does not sync pre-release versions, so no line switching is shown when the Pre Release channel is selected.
</VTDocNote>

## Step 2: Understand the Difference Between the Two "Portable Versions"

Each version usually comes with two zips. The file names are long, but the difference is actually simple:

| Keyword in the File Name | Called on the Page | Size | Need to Install .NET First | One-Line Explanation |
| --- | --- | --- | --- | --- |
| `framework-dependent` | Portable Lite | Small, about 10~20 MB | Yes | The program itself is small, but the .NET 8 Desktop Runtime must be installed on your PC first |
| `self-contained` | Portable Full | Large, about 90~110 MB | No | The runtime is bundled in; nothing needs to be installed |

Not sure which to pick? **If you want the least hassle, pick the big one (Portable Full)** — double-click and go.

Some versions also include an extra `.exe` installer (file name contains `installer-version`); it is essentially the installer of the "Portable Full" version — those who prefer an installation wizard can pick it. Note that **not every version has an installer**; what the download page actually lists is authoritative.

## Step 3: Run It

**Portable version (zip)**:

1. Extract the zip to any directory (e.g. `D:\Tools\LetsMeowToolbox`);
2. Double-click `LetsMeowToolbox.exe` inside — done.

**Installer (exe)**: double-click and follow the wizard, clicking Next all the way.

<VTDocTip>
After extracting, you'll see a `plugins` folder and a `lang` folder: `plugins` holds high-risk plugins, and `lang` holds language packs. The main program itself contains no high-risk code; all high-risk features come from the external plugins in `plugins`. See [High-Risk Plugin Zone](/en/docs/high-risk-zone.html) for details.
</VTDocTip>

## Step 4: Switch Languages as Needed (Since v0.2.0)

The program defaults to Simplified Chinese. Three official language packs — Traditional Chinese, Japanese and English — ship with the package and are already in the `lang` directory:

1. Open the **Language** card on the Settings page;
2. Click "Select Language" to open the Language Manager window;
3. Select the language you want and click "Load Selected Language"; the program confirms and restarts automatically — one restart and it takes effect.

To install a language pack made by someone else, click "Install Language Pack" and pick the `.meowlang` file. See [Settings and About](/en/docs/settings.html) for the detailed flow.

## What If Double-Clicking Does Nothing

Nine times out of ten, you downloaded the "Portable Lite" but your PC has no runtime installed. Pick either fix:

1. Install the [.NET 8 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/8.0) (choose ".NET Desktop Runtime 8.x"), then open the program again;
2. Or simply switch to the "Portable Full", which ships with the runtime.

For more cases, see the [FAQ](/en/docs/faq.html).

## One More Thing

All modification, deletion and cleanup operations in the program **always ask you first before executing** — nothing runs automatically behind your back; leftover and locked items are unchecked by default, so feel free to click around.
