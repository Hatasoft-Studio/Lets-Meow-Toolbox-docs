---
title: Developer Guide
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

<VTDocWarning>
**If you are not a developer, please do not read any content of this section (the developer docs).**

These docs are written for people with development experience; you most likely won't understand them anyway. If you insist on following the docs and acting on them, **any problem caused by your operational mistakes has nothing to do with the author**.
</VTDocWarning>

# Developer Guide

Welcome to the developer docs. Before getting your hands dirty, let's make a few important things clear.

## Who This Section Is Written For

- People who want to compile their own copy of Let's Meow Toolbox;
- People who want to write high-risk plugins for the program;
- People who want to read the source code and submit improvements.

If you just want to use the tool, head over to the [User Guide](/en/docs/getting-started.html) — that's your home turf.

## Project Basics

| Item | Content |
| --- | --- |
| Project name | Let's Meow Toolbox |
| Official repository | <https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox> |
| Author | Hatasoft-Studio (Bilibili: [Hatasoft工作室](https://space.bilibili.com/1198166444)) |
| Tech stack | WPF · .NET 8 (LTS) · C# · HandyControl 3.5.1 (MIT) |
| License | **GPL-3.0** |
| Main program | `LetsMeowToolbox.exe` |

<VTDocNote>
**Mind what GPL-3.0 means**: you are free to use, study, modify and distribute this project, but if you modify its code and redistribute it, your derivative work must also be open sourced under GPL-3.0. Before touching the code, make sure you understand and accept this.
</VTDocNote>

## Words from the Author (Verbatim)

This is a **Vibe-Coding work**. The author's own words: if you mind using a Vibe-Coding work, please leave on your own — don't open Issues just to curse. Every release of the program is personally tested by the author, so basically no major problems occur.

The author's original intention in making this tool was to quickly configure a fresh system reinstall conveniently — after all, there are too many anti-human designs in today's Win11 (especially the context menu). Later it occurred to the author that there must be many fellow "lazy people", so it was polished up and published. **The author will keep maintaining this project.**

Also, the author considers themselves no genius — if any expert passing by wants to "rescue" this project, that would be just great.

## Docs Table of Contents

Read on in order:

1. [Build and Publish](/en/dev/build-and-publish.html): what environment to install, how to run it, how to package it as a single file;
2. [Project Structure in Detail](/en/dev/project-structure.html): what each of the three projects in the solution does, and how the main program is layered internally;
3. [Modules and Services at a Glance](/en/dev/modules-and-services.html): feature modules, services and utility classes named one by one;
4. [High-Risk Plugin Development](/en/dev/high-risk-plugin-development.html): the plugin contract interfaces and development steps.

## One Last Reminder

Operations in the developer docs (compiling, modifying registry logic, debugging high-risk plugins, etc.) can all affect your system. **Think it through before following along; if something goes wrong, you are responsible — it has nothing to do with the author.**
