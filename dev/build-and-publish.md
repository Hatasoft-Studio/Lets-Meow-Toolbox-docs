---
title: 构建与发布
description: Let's Meow! Toolbox 的构建环境、调试运行与两种单文件发布模式，内容整理自项目官方 GitHub 仓库。
---

# 构建与发布

## 环境

- Visual Studio 2022 Community（含“.NET 桌面开发”工作负载）
- .NET 8 SDK
- NuGet 还原 HandyControl 3.5.1

仓库根目录的 `Directory.Build.props` 中设置了 `EnableWindowsTargeting=true`，允许在 Linux 上交叉编译 Windows 目标项目。

## 直接运行（调试）

在 VS 中打开 `LetsMeowToolbox.sln`，F5 运行 `LetsMeowToolbox.App`。构建时高危插件会自动复制到主程序输出目录的 `plugins` 文件夹。

## 单文件发布（两种模式）

仓库 `build/` 目录下提供两个 PowerShell 发布脚本，流程均为三步：清理旧产物 → 发布主程序 → 构建高危插件并复制到 `plugins/` 目录。

**模式一：单文件 · 依赖运行时（小，约 10~20MB，目标机需装有 .NET 8 桌面运行时）**

```powershell
./build/publish-framework-dependent.ps1
# 产物：dist/framework-dependent/LetsMeowToolbox.exe + plugins/
```

**模式二：单文件 · 自包含（大，约 90~110MB，目标机无需装 .NET）**

```powershell
./build/publish-self-contained.ps1
# 产物：dist/self-contained/LetsMeowToolbox.exe + plugins/
```

脚本内部实际执行的发布命令：

```powershell
# 依赖运行时
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained false -o dist/framework-dependent

# 自包含
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o dist/self-contained
```

也可以手动执行等价命令：

```bash
dotnet publish src/LetsMeowToolbox.App -c Release -r win-x64 \
  -p:PublishSingleFile=true --self-contained false -o dist/framework-dependent
dotnet publish src/LetsMeowToolbox.App -c Release -r win-x64 \
  -p:PublishSingleFile=true --self-contained true  -o dist/self-contained
```

发布后把 `LetsMeowToolbox.Plugins.HighRisk.dll` 复制到 `dist/…/plugins/` 即可启用高危插件区（发布脚本会自动完成这一步，插件 DLL 来自 `src/LetsMeowToolbox.Plugins.HighRisk/bin/Release/net8.0-windows/`）。

## 发布产物对照

| 模式 | 产物目录 | 目标机要求 |
| --- | --- | --- |
| 依赖运行时 | `dist/framework-dependent/LetsMeowToolbox.exe` + `plugins/` | 需安装 .NET 8 桌面运行时 |
| 自包含 | `dist/self-contained/LetsMeowToolbox.exe` + `plugins/` | 无需安装 .NET |

<VTDocTip>
主程序名固定为 `LetsMeowToolbox.exe`（在 `LetsMeowToolbox.App.csproj` 中通过 `AssemblyName` 指定）。单文件发布未显式指定 RID 时，csproj 会兜底使用 `win-x64`。
</VTDocTip>
