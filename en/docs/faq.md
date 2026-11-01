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

## Download Related

<VTDocAccordionGroup>
  <VTDocAccordion title="Download speed is very slow">
    GitHub's servers are overseas, so slow direct connections are normal. Go to the download page and switch the "Download Line" to the EZ-Mirror mirror for acceleration (except for Pre Release versions — the mirror site does not sync pre-release versions).
  </VTDocAccordion>
  <VTDocAccordion title="Can't find the installer version (.exe installer)">
    Not every version offers an installer. For example, v0.1.1 has an installer-version package, while v0.1.2 doesn't have one for now. What the download page actually lists is authoritative; when there's no installer, use the "Portable Full" — extract and use, and the experience is the same.
  </VTDocAccordion>
</VTDocAccordionGroup>

## Still Not Solved?

If you encounter any issue or bug, please open an Issue on the official GitHub repository:

- Official repository: <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- All historical versions and release notes: [GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- Before opening an Issue, it's recommended to check the [Changelog](/en/version.html) first to confirm you're on the latest version — some issues have already been fixed in newer versions.
