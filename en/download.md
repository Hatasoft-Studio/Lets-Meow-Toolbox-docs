---
title: Download Let's Meow! Toolbox
description: An anime-style modern UI, beginner-friendly all-in-one tuning toolbox for Windows 10 / 11. Below, all versions from both the Release and Pre Release channels are automatically fetched from GitHub, and you can pick any version to download; Release versions are accelerated by the EZ-Mirror mirror.
outline: deep
editLink: false
lastUpdated: false
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

<ReleaseDownloader />

## Update Channels

| Channel | Content | Download Line | Notes |
| --- | --- | --- | --- |
| Release | Official release versions | GitHub / EZ-Mirror mirror | Default channel; the mirror site syncs these versions |
| Pre Release | Pre-release versions | GitHub only | Not yet synced by the mirror site; can only be downloaded from GitHub |

The "Version" dropdown at the top of the page lists all historical versions under the current channel, with the latest selected by default; you can also freely pick an earlier version number to download. The GitHub and EZ-Mirror links for the corresponding version are generated automatically; if a certain version does not offer an installer version, the page automatically hides the installer button and keeps only the portable package.

## Version Types and Sizes

The program offers two single-file publishing modes; the "Portable Lite" and "Portable Full" entries in the download list correspond to them respectively:

| Publishing Mode | Requires the .NET 8 Desktop Runtime | Size Reference | Suitable Scenario |
| --- | --- | --- | --- |
| Framework-dependent | Yes | About 10~20 MB | The machine already has the .NET 8 Desktop Runtime installed |
| Self-contained | No | About 90~110 MB | A brand-new system; you don't want to install any runtime |

Both modes are a single file `LetsMeowToolbox.exe` accompanied by a `plugins/` directory — extract and use. The file sizes shown on the page are subject to the actual artifacts of the GitHub Release.

## Installation and First Run

<VTDocSteps>
  <VTDocStep title="Download and Extract">
    Download the zip of the corresponding version from the list above; after extracting you get LetsMeowToolbox.exe and the plugins directory.
  </VTDocStep>
  <VTDocStep title="Install the Runtime If Needed">
    If you choose the "Portable Lite", please install the .NET 8 Desktop Runtime (.NET Desktop Runtime 8.x) first; the "Portable Full" ships with the runtime and can skip this step.
  </VTDocStep>
  <VTDocStep title="Double-Click to Run">
    Run LetsMeowToolbox.exe directly. The main program contains no high-risk code at all; high-risk features come only from the external plugin DLLs in the plugins directory.
  </VTDocStep>
  <VTDocStep title="Confirm Operations as Prompted">
    All modifications, deletions and cleanups require manual confirmation; leftover and locked items are unchecked by default.
  </VTDocStep>
</VTDocSteps>

<VTDocTip>
  The program has built-in global exception catching and logging. If startup fails, open <code>%LocalAppData%\LetsMeowToolbox\logs</code> to check the log file for the corresponding date.
</VTDocTip>

## System Requirements and Security Design

<VTDocCardGroup cols="2">
  <VTDocCard title="System and Architecture" icon="gear">
    Only Windows 10 / 11 (x64) is supported. Tech stack: WPF · .NET 8 (LTS) · C# · HandyControl.
  </VTDocCard>
  <VTDocCard title="Security Design" icon="shield-halved">
    No packing, no obfuscation, no self-extraction logic; the underlying layer only calls Microsoft's native Win32 APIs (RestartManager, MoveFileEx, Registry, etc.).
  </VTDocCard>
  <VTDocCard title="Built-in Blacklist" icon="list-check">
    Core system directories such as C:\Windows, System32 and WinSxS, as well as core system processes, are forbidden from being force-terminated.
  </VTDocCard>
  <VTDocCard title="Open Source License" icon="browser">
    The project is open sourced under the GPL-3.0 license; the main program code is separated from the high-risk plugins, and you can review and build it yourself.
  </VTDocCard>
</VTDocCardGroup>

## FAQ

<VTDocAccordionGroup>
  <VTDocAccordion title="Double-clicking the framework-dependent version does nothing / it won't open">
    Please install the .NET 8 Desktop Runtime first (choose ".NET Desktop Runtime 8.x"). If you don't want to install the runtime, download the self-contained version directly — it ships with the runtime and works with a double-click.
  </VTDocAccordion>
  <VTDocAccordion title="Where are the logs">
    Logs are located at %LocalAppData%\LetsMeowToolbox\logs\meow-DATE.log. Paste %LocalAppData%\LetsMeowToolbox\logs into the Explorer address bar and press Enter to open the directory.
  </VTDocAccordion>
  <VTDocAccordion title="The interface background became a solid color">
    On non-Win11 systems the background may automatically fall back to a solid color. This is expected behavior and does not affect functionality.
  </VTDocAccordion>
  <VTDocAccordion title="The high-risk plugin zone is empty">
    The main program itself contains no high-risk code; high-risk plugins are only loaded after you place their DLLs into the plugins directory alongside the program.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Other Ways to Get It

<VTDocCardGroup cols="2">
  <VTDocCard title="GitHub Releases" icon="list-check" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases">
    View all historical versions and release notes, and manually pick any package.
  </VTDocCard>
  <VTDocCard title="EZ-Mirror Mirror Site" icon="upload" href="https://mirror.hatasoft365.top">
    An accelerated download line provided by EZ-Mirror; switch it in the "Download Line" above. The mirror only syncs versions already published to that site.
  </VTDocCard>
  <VTDocCard title="Source Repository" icon="browser" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox">
    Clone the repository and use the publish scripts under the build directory to build the single-file version yourself.
  </VTDocCard>
  <VTDocCard title=".NET 8 Desktop Runtime" icon="rocket" href="https://dotnet.microsoft.com/download/dotnet/8.0">
    Before using the framework-dependent version, download and install .NET Desktop Runtime 8.x here.
  </VTDocCard>
</VTDocCardGroup>

<VTDocNote>
  This is a Vibe-Coding work, and every release is personally tested by the author. Author: Hatasoft-Studio; the project homepage and issue tracker are on the GitHub repository.
</VTDocNote>
