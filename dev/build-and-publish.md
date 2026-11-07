---
title: 构建与发布
---

# 构建与发布

这一页讲怎么把源码变成能跑的 `LetsMeowToolbox.exe`：环境要装什么、调试怎么跑、两种单文件发布模式怎么打。

## 环境准备

| 要装的东西 | 说明 |
| --- | --- |
| Visual Studio 2022 Community | 安装时勾选“.NET 桌面开发”工作负载 |
| .NET 8 SDK | 目标框架是 `net8.0-windows` |
| NuGet 包 | 首次构建自动还原，主要依赖是 HandyControl 3.5.1 |

仓库根目录的 `Directory.Build.props` 里设置了 `EnableWindowsTargeting=true`，所以也**允许在 Linux 上交叉编译**这个 Windows 目标项目（用 `dotnet` CLI 即可，不强制 VS）。

## 拿到代码并跑起来（调试）

```bash
git clone https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox.git
```

然后在 VS 里打开 `LetsMeowToolbox.sln`，F5 运行 `LetsMeowToolbox.App` 就行。

有一个细节：构建时**高危插件会自动复制**到主程序输出目录的 `plugins` 文件夹，所以调试状态下高危插件区是直接可用的，不需要你手动搬 DLL。同理，仓库根目录 `lang/**/*.meowlang` 也会自动复制到输出目录的 `lang/`，调试时语言管理窗口里能直接看到官方语言包。

## 单文件发布：两种模式

程序对外发布的是**单文件** `LetsMeowToolbox.exe` + `plugins/` + `lang/` 目录，分两种模式。仓库 `build/` 目录下各有一个 PowerShell 脚本，流程都是三步：

1. 清理旧产物；
2. `dotnet publish` 发布主程序（单文件，`lang/` 语言包由 csproj 自动复制进产物）；
3. 构建高危插件，并把 `LetsMeowToolbox.Plugins.HighRisk.dll` 复制到产物目录的 `plugins/`。

### 模式一：依赖运行时（小）

目标机需要先装好 .NET 8 桌面运行时，产物约 10~20 MB：

```powershell
./build/publish-framework-dependent.ps1
# 产物：dist/framework-dependent/LetsMeowToolbox.exe + plugins/ + lang/
```

脚本内部实际执行的命令：

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained false -o dist/framework-dependent
```

### 模式二：自包含（大）

运行库全部打包进去，目标机什么都不用装，产物约 90~110 MB：

```powershell
./build/publish-self-contained.ps1
# 产物：dist/self-contained/LetsMeowToolbox.exe + plugins/ + lang/
```

脚本内部实际执行的命令：

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o dist/self-contained
```

不想用脚本的话，手动执行上面两条 `dotnet publish`，再自己把 `src/LetsMeowToolbox.Plugins.HighRisk/bin/Release/net8.0-windows/LetsMeowToolbox.Plugins.HighRisk.dll` 复制到产物目录的 `plugins/` 里，效果一样。

## 产物对照表

| 模式 | 产物目录 | 目标机要求 | 体积参考 |
| --- | --- | --- | --- |
| 依赖运行时 | `dist/framework-dependent/` | 需安装 .NET 8 桌面运行时 | 约 10~20 MB |
| 自包含 | `dist/self-contained/` | 无需安装 .NET | 约 90~110 MB |

## 几个容易踩的点

<VTDocTip>
- **主程序名是固定的**：`LetsMeowToolbox.exe`，由 csproj 里的 `AssemblyName=LetsMeowToolbox` 决定，别指望改出别的名；
- **RID 兜底**：单文件发布时如果命令行没给 RID，csproj 会兜底指定 `win-x64`；
- **自包含模式**会同时开启 `IncludeNativeLibrariesForSelfExtract`，原生库一并打进单文件；
- **版本号**在 `LetsMeowToolbox.App.csproj` 的 `Version` 属性里维护（当前 0.2.0），发布新版本时别忘了同步更新 `Services/AppInfo.cs` 里的 `Version` 与 `Changelog`。
</VTDocTip>
