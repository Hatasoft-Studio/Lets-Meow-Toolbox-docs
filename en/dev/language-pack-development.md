---
title: Language Pack Development
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Language Pack Development

This page covers the external language pack mechanism introduced in v0.2.0: what a `.meowlang` file looks like, how the program validates and installs it, how to make your own language pack, and the endpoint behind "Check for updates" on the Settings page.

## How the Language System Is Organized

The main program's multilingual support consists of two layers:

| Layer | Location | Notes |
| --- | --- | --- |
| Embedded source language | `src/LetsMeowToolbox.App/Localization/zh-Hans.meowlang` | Packed into the main program as an `EmbeddedResource`; Simplified Chinese is always available and does not depend on any external file |
| External language packs | `lang/*.meowlang` under the program directory | The official language packs (`zh-Hant`, `ja`, `en`) in the repository root's `lang/`, copied to the output directory by the csproj at build time and scanned automatically at startup |

The implementation is concentrated in three files:

- `Services/LocalizationService.cs`: the language pack model `LanguagePack`, scanning the `lang` directory, translating by source text, walking the visual tree to replace interface text;
- `Services/LanguagePackInstaller.cs`: language pack reading and validation, applicable version checking, version comparison, copy installation, restarting the program;
- `Views/LanguageManagerDialog.xaml(.cs)`, `LanguagePackDetailsDialog`, `LanguageInstallProgressDialog`: the three windows for selecting a language, viewing details and installation progress.

Simplified Chinese is the **source language**, and the `strings` in every other language pack are a mapping of "Simplified Chinese source text → target-language translation", so adding a language requires no changes to any C# code.

## The .meowlang File Format

A language pack is essentially a UTF-8 encoded JSON text file. A minimal example:

```json
{
  "id": "xx",
  "name": "示例语言",
  "author": "YourName",
  "authorWebsite": "https://example.com",
  "version": "1.0.0",
  "source": "zh-Hans",
  "languageType": "示例语言",
  "appVersion": ">=0.2.0",
  "description": "这是一个示例语言包。",
  "strings": {
    "设置": "Settings",
    "检查更新": "Check for updates"
  }
}
```

Field reference:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | ✅ | Unique identifier of the language pack; also determines the installed file name (`<id>.meowlang`). Must not be `zh-Hans`, which is the embedded source language |
| `name` | ✅ | Display name, e.g. `繁體中文`, `日本語` |
| `author` | ✅ | Author; fixed to `Hatasoft-Studio` for official packs |
| `authorWebsite` | — | Author's official website; together with `author` it determines whether the pack is an official language pack |
| `version` | ✅ | The language pack's own version number, used to compare updates/downgrades of same-name packs |
| `source` | — | Source language, `zh-Hans` by default |
| `languageType` | — | Language type label, e.g. "English" "Traditional Chinese" |
| `appVersion` | — | Applicable main program version range, `*` by default |
| `description` | — | Description, shown in the details window |
| `strings` | ✅ | Source text → translation dictionary; must not be empty |

<VTDocTip>
`strings` keys must **exactly match** the Simplified Chinese source text in the interface (including punctuation and spaces). The program matches by exact source text; when no translation is found it displays the Simplified Chinese as-is, without erroring. Multi-line text is looked up line by line: empty lines are skipped, and lines that contain no Chinese characters (brand names, numbers, pure English) are kept as-is.
</VTDocTip>

## Applicable Version (appVersion) Rules

The logic lives in `LanguagePackInstaller.CheckCompatible`, which ultimately delegates to `MatchesRange`:

- Blank or `*`: applies to any version;
- Multiple segments can be separated with `|`; any matching segment passes, e.g. `0.2.0 | 0.2.1 | 0.2.2`;
- A single segment supports the prefixes `>=`, `<=`, `>`, `<`, `=`, `==`, and can also be a bare version number (equivalent to `==`);
- Multiple conditions can be written with spaces or commas within the same segment; **all of them must be satisfied**;
- Unparseable conditions are ignored, to avoid rejecting valid packs by mistake.

Version comparison is done by `LanguagePackInstaller.CompareVersion`: when parsing a version number it strips a leading `v`/`V`, splits by `.` and takes the integer parts, truncating anything non-numeric (so `v1.1.0-lang` is compared as `1.1.0`).

## How Official Language Packs Are Determined

`LanguagePackRules.IsOfficial` requires **both the author and the author website to match**:

- `author` equals `Hatasoft-Studio` (case-insensitive, leading/trailing whitespace trimmed);
- `authorWebsite` equals `https://hatasoft365.top` or `https://lets-meow-toolbox.hatasoft365.top` (likewise case-insensitive, trailing slash stripped).

Only when both match does the details window show the green shield and skip the third-party confirmation.

## Installation Flow (at the Code Level)

The Settings page's "Install Language Pack" ultimately calls `LanguageManagerDialog.InstallInteractive`, in this order:

1. `LanguagePackInstaller.ReadFile` reads the file and validates the required fields (`id`, `name`, `author`, `version`, `strings`);
2. Reject `id == zh-Hans` (Simplified Chinese is already embedded);
3. `CheckCompatible` validates the version range; if it fails, show an error and write a WARN log;
4. If a pack with the same `id` already exists in the `lang` directory:
   - use `SameIdentity` to compare `author` and `authorWebsite` (case-insensitive, trailing `/` ignored); if they differ, refuse to overwrite and prompt the user to delete the old pack manually;
   - use `CompareVersion` to determine whether this is an "update", a "downgrade" or a "reinstall", with a second confirmation;
5. `LanguagePackDetailsDialog` shows the details (install time is the current time, file size is the source file length);
6. Non-official language packs get an extra third-party confirmation;
7. `LanguageInstallProgressDialog` performs the installation: `LanguagePackInstaller.Install` first copies to `.tmp`, then replaces the target file and sets the file modification time to now (the "install time" in the details is read from this);
8. On success, call `LocalizationService.Refresh()` to rescan the directory and show "Language pack installed successfully!"; on failure, show the reason and `LogService.Instance.LogFilePath`.

<VTDocWarning>
Installation is nothing more than copying a file into the `lang` directory — **no code inside the language pack is ever executed**. However, a language pack does replace interface text, so it is still advisable to inspect the JSON content of third-party language packs before installing.
</VTDocWarning>

## Switching Languages and Restarting

Execution order of "Load Selected Language":

1. `CheckCompatible` validates again;
2. If it is already the current language, directly prompt that no reload is needed;
3. A details window pops up for confirmation;
4. `LocalizationService.SetLanguage(id)` writes to `SettingsService.Language` and triggers the `LanguageChanged` event;
5. `LanguagePackInstaller.RestartApp` starts a new process and calls `Application.Current.Shutdown()`.

At startup, `LocalizationService.Initialize()` loads the embedded Simplified Chinese, scans the `lang` directory, and then restores the previous selection from the language ID saved in settings; if the specified pack does not exist, it falls back to Simplified Chinese and writes the setting back.

## How Interface Translation Is Implemented

`LocalizationService` does not bind resources to every control; instead it **walks the visual tree and replaces static text**:

- `LocalizeElement` handles `TextBlock.Text` (including `Run`), `ContentControl.Content`, `HeaderedContentControl.Header`, `Window.Title`, `FrameworkElement.ToolTip`;
- Attributes with data bindings are ignored (skip when `BindingOperations.GetBindingExpressionBase` is non-null) to avoid breaking MVVM bindings;
- A `ConditionalWeakTable` records each control's original text before translation, and switching languages re-translates from the original, so repeated switching never produces a "translation of a translation";
- `ApplyToDeferred` translates at `DispatcherPriority.Loaded`, after templates and list items are instantiated; window-level `Loaded` events are hooked uniformly via `EventManager.RegisterClassHandler`, while child pages/dialogs need to call it themselves.

This is also why switching languages must restart: controls added at runtime and dynamically generated text may not refresh immediately, so a restart is the safest.

## How Language Packs Get Into the Artifacts at Build Time

`LetsMeowToolbox.App.csproj` has two key blocks:

```xml
<!-- 内嵌语言：简体中文（源语言）随程序打包，无需外置语言包 -->
<ItemGroup>
  <EmbeddedResource Include="Localization\zh-Hans.meowlang" />
</ItemGroup>

<!-- 外置语言包：随程序输出到 lang 目录，启动时自动扫描 -->
<ItemGroup>
  <None Include="..\..\lang\**\*.meowlang"
        Link="lang\%(RecursiveDir)%(Filename)%(Extension)"
        CopyToOutputDirectory="PreserveNewest"
        CopyToPublishDirectory="PreserveNewest" />
</ItemGroup>
```

So after debugging (F5) and `dotnet publish`, the `lang/` directory automatically appears in the artifact directory — no manual copying needed.

## Making Your Own Language Pack

1. Copy the official `lang/en.meowlang` (or `ja.meowlang`) as a template;
2. Change `id`, `name`, `author`, `authorWebsite`, `version`, `languageType` and `description`;
3. Fill in `appVersion` according to the current main program version, e.g. `>=0.2.0` or `0.2.0 | 0.2.1`;
4. In `strings`, fill in the translations one by one, keeping the keys as the unchanged Simplified Chinese source text;
5. Save as UTF-8 JSON; the file name is best kept consistent with `id`;
6. Open the program's Settings → "Install Language Pack", select this file, confirm the details and install, then load it in "Select Language".

<VTDocTip>
While debugging you can also drop the `.meowlang` directly into the program directory's `lang` folder and restart the program — it will then appear in the Language Manager window. The install button merely does this step more formally (validation, confirmation, recording the install time).
</VTDocTip>

## The Settings Page "Check for updates" Endpoint

`Services/UpdateService.cs` requests a fixed address:

```text
https://api.lets-meow-toolbox.hatasoft365.top/
```

Request headers include `User-Agent: LetsMeowToolbox/<current version>` and `Accept: application/json`, with a 10-second timeout. The returned JSON maps to `UpdateInfo`:

| Field | Notes |
| --- | --- |
| `latestVersion` | Latest version number, required; empty is treated as invalid endpoint data |
| `downloadUrl` | Official website download address; falls back to `https://lets-meow-toolbox.hatasoft365.top` when empty |
| `unsupportedVersions` | Array of version numbers no longer supported; if it contains the current version, a forced update occurs at startup |
| `changelog` | Release notes text, shown in the update dialog |

Determination logic:

- `HasUpdate`: `CompareVersion(latestVersion, AppInfo.Version) > 0`;
- `Unsupported`: any item in `unsupportedVersions` compares equal to the current version.

`Views/UpdateDialog` has two modes:

- **Normal mode**: shows the current version, latest version, download address and update content; the buttons are "Go to the official website for the new version" / "Later";
- **Forced mode** (`Unsupported`): the title becomes "This version is no longer supported", the buttons are "Go to the official website for the new version" / "Exit the program", and closing the window exits the program.

<VTDocNote>
The update endpoint address is hardcoded in the `UpdateService.Endpoint` constant; both `SettingsView` and the startup check use the same service. When changing the endpoint address, remember to check both call sites.
</VTDocNote>
