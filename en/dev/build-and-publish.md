---
title: Build and Publish
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Build and Publish

This page explains how to turn the source code into a runnable `LetsMeowToolbox.exe`: what environment to install, how to run debugging, and how to package the two single-file publishing modes.

## Environment Preparation

| What to Install | Notes |
| --- | --- |
| Visual Studio 2022 Community | Check the ".NET desktop development" workload during installation |
| .NET 8 SDK | The target framework is `net8.0-windows` |
| NuGet packages | Restored automatically on first build; the main dependency is HandyControl 3.5.1 |

The `Directory.Build.props` at the repository root sets `EnableWindowsTargeting=true`, so **cross-compiling this Windows-target project on Linux is also allowed** (the `dotnet` CLI is enough; VS is not mandatory).

## Get the Code and Run It (Debug)

```bash
git clone https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox.git
```

Then open `LetsMeowToolbox.sln` in VS and press F5 to run `LetsMeowToolbox.App`.

One detail: during build, **the high-risk plugin is automatically copied** into the `plugins` folder of the main program's output directory, so the high-risk plugin zone is directly usable in debug mode — no need to move DLLs manually.

## Single-File Publishing: Two Modes

What the program publishes externally is a **single file** `LetsMeowToolbox.exe` + `plugins/` directory, in two modes. The repository's `build/` directory contains one PowerShell script for each; both flows have three steps:

1. Clean old artifacts;
2. `dotnet publish` to publish the main program (single file);
3. Build the high-risk plugin and copy `LetsMeowToolbox.Plugins.HighRisk.dll` into the artifact directory's `plugins/`.

### Mode 1: Framework-Dependent (Small)

The target machine needs the .NET 8 Desktop Runtime installed first; artifacts are about 10~20 MB:

```powershell
./build/publish-framework-dependent.ps1
# 产物：dist/framework-dependent/LetsMeowToolbox.exe + plugins/
```

The command actually executed inside the script:

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained false -o dist/framework-dependent
```

### Mode 2: Self-Contained (Large)

The entire runtime is packaged in; the target machine needs nothing installed; artifacts are about 90~110 MB:

```powershell
./build/publish-self-contained.ps1
# 产物：dist/self-contained/LetsMeowToolbox.exe + plugins/
```

The command actually executed inside the script:

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o dist/self-contained
```

If you don't want to use the scripts, manually execute the two `dotnet publish` commands above, then copy `src/LetsMeowToolbox.Plugins.HighRisk/bin/Release/net8.0-windows/LetsMeowToolbox.Plugins.HighRisk.dll` into the artifact directory's `plugins/` yourself — same effect.

## Artifact Comparison Table

| Mode | Artifact Directory | Target Machine Requirement | Size Reference |
| --- | --- | --- | --- |
| Framework-dependent | `dist/framework-dependent/` | .NET 8 Desktop Runtime required | About 10~20 MB |
| Self-contained | `dist/self-contained/` | No .NET installation needed | About 90~110 MB |

## A Few Easy Pitfalls

<VTDocTip>
- **The main program name is fixed**: `LetsMeowToolbox.exe`, determined by `AssemblyName=LetsMeowToolbox` in the csproj — don't expect to change it to anything else;
- **RID fallback**: if no RID is given on the command line during single-file publishing, the csproj falls back to `win-x64`;
- **Self-contained mode** also enables `IncludeNativeLibrariesForSelfExtract`, packing native libraries into the single file as well;
- **The version number** is maintained in the `Version` property of `LetsMeowToolbox.App.csproj` (currently 0.1.2); when releasing a new version, don't forget to also update `Version` and `Changelog` in `Services/AppInfo.cs` in sync.
</VTDocTip>
