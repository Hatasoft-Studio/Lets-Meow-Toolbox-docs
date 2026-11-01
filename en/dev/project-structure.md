---
title: Project Structure in Detail
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Project Structure in Detail

This page dissects the repository from outside in: which projects are in the solution, how the main program is layered internally, and what key configurations exist in the project files.

## Repository Top Level

```
LetsMeowToolbox/
├── LetsMeowToolbox.sln
├── LICENSE                    # GPL-3.0
├── Directory.Build.props      # 全局工程属性
├── build/
│   ├── publish-framework-dependent.ps1   # 单文件·依赖运行时
│   └── publish-self-contained.ps1        # 单文件·自包含
├── src/
│   ├── LetsMeowToolbox.App/               # 主程序 (LetsMeowToolbox.exe)
│   ├── LetsMeowToolbox.PluginAbstractions/# 插件契约接口
│   └── LetsMeowToolbox.Plugins.HighRisk/  # 🔴 高危插件（外置 DLL）
```

## What Each of the Three Projects Does

| Project | Type | Responsibility |
| --- | --- | --- |
| `LetsMeowToolbox.App` | WPF app (WinExe) | Main program; artifact `LetsMeowToolbox.exe`; references PluginAbstractions |
| `LetsMeowToolbox.PluginAbstractions` | Class library | The external contract for high-risk plugins: interfaces and metadata. Both the main program and plugins recognize only this contract |
| `LetsMeowToolbox.Plugins.HighRisk` | Class library (external DLL) | Official high-risk plugin: Disable Defender / Disable Firewall / Remove Edge·WebView2 |

This split is the core of the whole project's security design: **the high-risk code is physically absent from the main program** — it exists only in the external plugin project, compiled into a DLL and dynamically loaded by the main program.

## Internal Layers of the Main Program

The internal directories and responsibilities of `src/LetsMeowToolbox.App/`:

| Directory | What's Inside |
| --- | --- |
| `Modules/` | Feature modules, organized by zone: `Beginner/` (5 modules in the Beginner Zone), `Advanced/` (Advanced Zone), `Uninstaller/` (uninstall), `Unlock/` (unlock) |
| `Services/` | Global services: permissions, logging, configuration, settings, themes, plugin loading, etc. (named one by one on the next page) |
| `Utils/` | Low-level utilities: command execution, registry, processes, Win32 native capability wrappers |
| `Views/` | UI: pages for each zone, dialogs (changelog, license, Fluent dialog) |
| `Themes/` | Theme resource dictionaries: `Brushes.Light.xaml`, `Brushes.Anime.xaml`, `FluentStyles.xaml` |
| `Models/` | View models and data models (`ObservableObject`, ViewModels for each page) |
| `Assets/` | Icons, logo, wallpaper, full GPL-3.0 license text |

Each feature zone is basically a combination of "one Module (logic) + one View (UI)"; for example, uninstall is `Modules/Uninstaller/` + `Views/UninstallerView.xaml`.

## Key Points of the csproj, Item by Item

Noteworthy configurations in `LetsMeowToolbox.App.csproj`:

| Config | Value | Notes |
| --- | --- | --- |
| `TargetFramework` | `net8.0-windows` | .NET 8, Windows desktop |
| `UseWPF` | `true` | WPF app |
| `AssemblyName` | `LetsMeowToolbox` | The main program name is fixed to `LetsMeowToolbox.exe` |
| `Version` | `0.1.2` | Versioning scheme enabled since v0.1.1; the changelog lives in `Services/AppInfo.cs` |
| `ApplicationManifest` | `app.manifest` | Application manifest |
| `AllowUnsafeBlocks` | `true` | Unsafe code blocks allowed |
| `PackageReference` | `HandyControl 3.5.1` | The only NuGet dependency, a UI control library |

The resource packaging is also worth noting:

- **Embedded resources** (packed into the single file, no need to output alongside the exe): `logo_banner.png`, `app_icon.png`, `app.ico`;
- **Embedded resource**: `gpl-3.0.txt` (used by the first-launch license dialog and the About page);
- **Loose file** (output alongside the program to the exe's directory, loaded from disk at runtime): `wallpaper.png` (the anime-mode wallpaper);
- **Optional directory**: when an `assets/` directory exists, the whole directory is copied with the output.

Single-file publishing related: when no RID is explicitly specified and `PublishSingleFile` is enabled, the csproj falls back to `win-x64`; when self-contained (`SelfContained=true`), `IncludeNativeLibrariesForSelfExtract` is enabled.

## What Directory.Build.props Says

The `Directory.Build.props` at the repository root applies to all projects:

- Product name `Let's Meow Toolbox`, company/author `Hatasoft-Studio`, copyright `Copyright (c) 2026 Hatasoft-Studio`;
- `EnableWindowsTargeting=true`: allows cross-compiling Windows-target projects on Linux.

## Versioning Rules (Must Read)

The versioning scheme has been in effect since v0.1.1 and is defined in `Services/AppInfo.cs`: **MAJOR.MINOR.PATCH**

- **MAJOR**: incremented by 1 for major architectural adjustments / breaking changes (during the 0.x stage, this means an overall rewrite);
- **MINOR**: incremented by 1 when new features are added;
- **PATCH**: incremented by 1 for bug fixes / optimizations.

The rule: **at every release, `Version` and `Changelog` must be updated together in `AppInfo`**. The in-program "View Changelog" dialog reads exactly this data — forget to update it and users won't see the new content.
