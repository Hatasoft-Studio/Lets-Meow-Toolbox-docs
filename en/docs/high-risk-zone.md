---
title: High-Risk Plugin Zone
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# High-Risk Plugin Zone

This is the place in the entire program where you most need to "look before you leap". The conclusion first: **the main program itself contains no high-risk code at all** — all high-risk features are external plugins; if you don't put plugins in, this zone is empty.

## Why High-Risk Features Are Made into Plugins

The author's design principle is clear: high-risk operations (disabling antivirus, dismantling system components, and the like) must never be mixed into the main program. So they are all split into **external DLL plugins**, placed in the `plugins` directory alongside the program, and dynamically loaded by the main program.

Benefits of doing this:

- The main program (`LetsMeowToolbox.exe`) can be freely audited — there isn't a single line of high-risk code inside;
- If you don't want the high-risk features, just don't put the plugins in — no interference either way;
- Delete a plugin and it's removed, clean and simple.

## What Operations the Official High-Risk Plugin Provides

The official high-risk plugin shipped with the repository (`LetsMeowToolbox.Plugins.HighRisk`) contains three operations:

| Operation | Description |
| --- | --- |
| Disable Defender | Turns off Windows Defender protection |
| Disable Firewall | Turns off Windows Firewall |
| Remove Edge · WebView2 | Removes the Edge browser and the WebView2 component |

## How to Enable

The release package ships with a `plugins` directory. The DLL of the official high-risk plugin (`LetsMeowToolbox.Plugins.HighRisk.dll`) is copied into that directory during the official release process; if the `plugins` directory of the version you have is empty, put the high-risk plugin DLL in there and reopen the program to have it loaded.

## Things You Must Know Before Use

<VTDocWarning>
High-risk operations are called high-risk because they really can affect system security and stability:

- Disabling Defender / Firewall leaves your PC unprotected;
- Removing Edge / WebView2 may affect programs that depend on WebView2.

Before each operation is enabled, the **risk warning text is shown to you and a second confirmation is required** — please actually read it before clicking confirm. The plugin contract explicitly forbids any "auto-execute, auto-confirm, no-prompt" logic, so you will never execute any high-risk operation without knowing it.
</VTDocWarning>

- All high-risk operations require **manual confirmation** before execution;
- Operations that need administrator rights will additionally ask for administrator rights;
- Every operation provides a **restore** capability; if something feels off after enabling, you can restore it;
- Operation results are written to the log, convenient for tracing.

## Want to Write Your Own High-Risk Plugin?

The program opens up the plugin contract and allows third parties to develop high-risk plugins (at their own risk). See [High-Risk Plugin Development](/en/dev/high-risk-plugin-development.html) for the development docs.
