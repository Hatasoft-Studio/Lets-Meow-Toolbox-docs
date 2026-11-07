---
title: FAQ
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# FAQ

This page collects the most frequently encountered issues. A reassuring word first: the program has built-in **global exception catching and logging** — if a startup or runtime error occurs, an error dialog pops up and the log is written; it never "silently fails to open" leaving you clueless.

## The Program Won't Open / No Response

<VTDocAccordionGroup>
  <VTDocAccordion title="Double-click does nothing (most common)">
    Nine times out of ten you're using the "Portable Lite" (framework-dependent) but your PC has no runtime installed. Pick either fix:

    1. Install the [.NET 8 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/8.0), making sure to choose ".NET Desktop Runtime 8.x";
    2. Or switch directly to the "Portable Full" (self-contained) — it ships with the runtime and works with a double-click.
  </VTDocAccordion>
  <VTDocAccordion title="An error dialog pops up">
    This is the program's fallback mechanism at work: errors pop up a dialog and get written to the log. Note down the dialog message, then check the day's log file in the log directory; when opening an Issue, include the log content — the author's investigation will be much faster.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Log Related

<VTDocAccordionGroup>
  <VTDocAccordion title="Where are the logs">
    `%LocalAppData%\LetsMeowToolbox\logs\meow-DATE.log`. Paste `%LocalAppData%\LetsMeowToolbox\logs` into the Explorer address bar and press Enter to open the directory.
  </VTDocAccordion>
  <VTDocAccordion title="What's recorded in the logs">
    Since v0.1.1 the logs are recorded globally: all your setting operations, execution results and timestamps, recorded at three levels INFO / WARN / ERROR — no more empty files.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Interface Related

<VTDocAccordionGroup>
  <VTDocAccordion title="The background became a solid color">
    On non-Win11 systems the background may automatically fall back to a solid color; this is expected behavior and does not affect any feature.
  </VTDocAccordion>
  <VTDocAccordion title="The high-risk plugin zone is empty">
    The main program itself contains no high-risk code. To use high-risk features, put the high-risk plugin DLLs into the `plugins` directory alongside the program. See [High-Risk Plugin Zone](/en/docs/high-risk-zone.html) for details.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Language and Updates (Since v0.2.0)

<VTDocAccordionGroup>
  <VTDocAccordion title="Can't find the “Select Language” button">
    The Language card is at the very top of the Settings page. If there isn't a single external language pack in the `lang` directory, the program still uses the embedded Simplified Chinese by default; put the official language packs (or a third-party `.meowlang`) into the `lang` directory alongside the program and restart the program, and they will appear in the list.
  </VTDocAccordion>
  <VTDocAccordion title="The program restarted by itself after switching languages">
    This is by design. After you click "Load Selected Language" and confirm, the program restarts once so that all interface text is re-translated into the new language; only if the restart fails does it show an error and write to the log.
  </VTDocAccordion>
  <VTDocAccordion title="The language pack won't install and reports that the version doesn't apply">
    The `appVersion` inside a language pack only allows it to be used on the specified versions, e.g. `0.2.0 | 0.2.1` or `>=0.2.0`. Please switch to a language pack that fits the current version, or upgrade the main program. See [Settings and About](/en/docs/settings.html) for the exact rules.
  </VTDocAccordion>
  <VTDocAccordion title="It says a language pack with the same name has a different author and can't be installed">
    The program found a language pack with the same ID already in the `lang` directory, but the author or author website differs; to prevent overwriting, the installation is refused. Manually delete the old `.meowlang` file in the `lang` directory and install again.
  </VTDocAccordion>
  <VTDocAccordion title="How do I tell which language packs are official">
    In the language pack details, official language packs show a **green shield badge** next to the author; the program only treats a pack as official when the author is `Hatasoft-Studio` **and** the author website is the official site. Installing a third-party language pack also triggers an extra confirmation.
  </VTDocAccordion>
  <VTDocAccordion title="Clicking “Check for updates” reports a check failure">
    Checking for updates requires access to the official update endpoint; a blocked network, firewall interception or a temporary endpoint error will all cause failures. Try again later; a failure does not affect other features of the program. If it keeps failing, please open an Issue on the GitHub repository.
  </VTDocAccordion>
  <VTDocAccordion title="At startup it pops up “This version is no longer supported”">
    This means the official team has put the current version on the unsupported list, and you cannot keep using it until you update. Click "Go to the official website for the new version" to download the latest version; clicking "Exit the program" simply exits. Once updated, everything works normally.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Download Related

<VTDocAccordionGroup>
  <VTDocAccordion title="Download speed is very slow">
    GitHub's servers are overseas, so slow direct connections are normal. Go to the download page and switch the "Download Line" to the EZ-Mirror mirror for acceleration (except for Pre Release versions — the mirror site does not sync pre-release versions).
  </VTDocAccordion>
  <VTDocAccordion title="Can't find the installer version (.exe installer)">
    Not every version offers an installer. For example, v0.1.1 has an installer-version package, while v0.1.2 and v0.2.0 don't have one for now. What the download page actually lists is authoritative; when there's no installer, use the "Portable Full" — extract and use, and the experience is the same.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Still Not Solved?

If you encounter any issue or bug, please open an Issue on the official GitHub repository:

- Official repository: <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- All historical versions and release notes: [GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- Before opening an Issue, it's recommended to check the [Changelog](/en/version.html) first to confirm you're on the latest version — some issues have already been fixed in newer versions.
