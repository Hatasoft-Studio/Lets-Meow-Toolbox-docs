---
title: Modules and Services at a Glance
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Modules and Services at a Glance

This page names one by one the feature modules (Modules), services (Services), utility classes (Utils) and themes (Themes) in the main program, helping you quickly locate "what this file is for" when reading the source code.

## Feature Modules (Modules/)

Modules are organized by feature zone; one module corresponds to a set of feature logic:

### Modules/Beginner/ — Beginner Zone

| File | Responsible For |
| --- | --- |
| `OptimizeModule.cs` | Power / indexing / autoplay / thumbnail and other optimization items |
| `PrivacyAdsModule.cs` | Disabling ads / telemetry / notification suggestions |
| `RightClickMenuModule.cs` | Win11 classic context menu switching |
| `TaskbarExplorerModule.cs` | Taskbar / Explorer tweaks |
| `UwpCleanModule.cs` | Safe UWP uninstall (whitelist) |

### Modules/Advanced/ — Advanced Zone

| File | Responsible For |
| --- | --- |
| `WindowsUpdateModule.cs` | Windows Update pause limit / disabling |

### Modules/Uninstaller/ — Uninstaller

| File | Responsible For |
| --- | --- |
| `UninstallerService.cs` | Main logic of Win32 software uninstall |
| `ResidueScanner.cs` | Leftover scan after uninstall |
| `ReportWriter.cs` | Cleanup report export |

### Modules/Unlock/ — Unlock

| File | Responsible For |
| --- | --- |
| `UnlockService.cs` | Find locking processes, close to release, delayed delete on boot |

## Services (Services/)

Services are singleton capabilities spanning the whole program; file names map directly to responsibilities:

| File | One-Line Responsibility |
| --- | --- |
| `AdminService.cs` | Administrator permission related handling |
| `AppInfo.cs` | Version number, repository address and built-in changelog (`Changelog`); must be changed at release |
| `BackupService.cs` | Backup capability |
| `ConfigService.cs` | Configuration reading and writing |
| `FeatureHost.cs` | Feature host: carries the execution entry points of each feature item |
| `FluentToast.cs` | Fluent-style toast notifications |
| `LogService.cs` | Global logging (INFO / WARN / ERROR), written to `%LocalAppData%\LetsMeowToolbox\logs` |
| `OsVersionService.cs` | OS version detection (used for handling Win10 / Win11 differences) |
| `PluginLoader.cs` | High-risk plugin loader: scans and dynamically loads plugin DLLs under the `plugins/` directory |
| `SettingsService.cs` | Settings item management |
| `ThemeService.cs` | Theme switching (light / anime mode, etc.) |
| `Ui.cs` | UI interaction wrappers (dialogs, error prompts, etc.) |

## Utility Classes (Utils/)

Low-level capability wrappers — basically where all the "dirty work" is concentrated:

| File | One-Line Responsibility |
| --- | --- |
| `CmdRunner.cs` | Execute cmd commands |
| `PowerShellRunner.cs` | Execute PowerShell commands |
| `NativeMethods.cs` | P/Invoke declarations of Win32 native APIs |
| `RestartManager.cs` | RestartManager API wrapper (used to find out "who is locking a file") |
| `PendingFileOps.cs` | Delayed file operations after reboot (the foundation of delayed delete on boot, based on the MoveFileEx mechanism) |
| `ProcessUtil.cs` | Process related operations |
| `RegistryUtil.cs` | Registry reading and writing wrappers |
| `UwpWhitelist.cs` | UWP uninstall whitelist (prevents accidental deletion of system components) |
| `WindowBackdrop.cs` | Window background material (Win11 material / solid color fallback) |

## Themes (Themes/)

| File | Description |
| --- | --- |
| `Brushes.Light.xaml` | Light theme brushes |
| `Brushes.Anime.xaml` | Anime mode brushes (readability improved in v0.1.1) |
| `FluentStyles.xaml` | Fluent-style styles |

## Views (Views/) Quick Reference

Pages correspond one-to-one with zones: `BeginnerView` (Beginner Zone), `AdvancedView` (Advanced Zone), `UninstallerView` + `UninstallerPanel` (Uninstaller), `UnlockView` + `UnlockPanel` (Unlock), `HighRiskView` (High-Risk Plugin Zone), `SettingsView` (Settings), `CreditsView` (Special Thanks). Dialog types: `ChangelogDialog` (changelog), `LicenseDialog` (first-launch license), `FluentDialog`.

<VTDocTip>
Recommended route for reading the source code: first look at `Views/` to find the UI entry → jump to the corresponding `Modules/` to see the logic → look at `Utils/` when you hit low-level operations. The service layer (`Services/`) shows up everywhere, so there's no need to read it through deliberately.
</VTDocTip>
