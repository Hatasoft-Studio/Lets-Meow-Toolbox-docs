---
title: 项目结构详解
---

# 项目结构详解

这一页把仓库从外到内拆一遍：解决方案里有哪几个工程、主程序内部怎么分层、工程文件里有哪些关键配置。

## 仓库顶层

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

## 三个工程各干什么

| 工程 | 类型 | 职责 |
| --- | --- | --- |
| `LetsMeowToolbox.App` | WPF 应用（WinExe） | 主程序，产物 `LetsMeowToolbox.exe`，引用 PluginAbstractions |
| `LetsMeowToolbox.PluginAbstractions` | 类库 | 高危插件的对外契约：接口与元数据。主程序和插件都只认这套契约 |
| `LetsMeowToolbox.Plugins.HighRisk` | 类库（外置 DLL） | 官方高危插件：关闭 Defender / 关闭防火墙 / 移除 Edge·WebView2 |

这个拆法是整个项目安全设计的核心：**高危代码物理上不在主程序里**，只存在于外置插件工程中，编译成 DLL 后由主程序动态加载。

## 主程序内部分层

`src/LetsMeowToolbox.App/` 内部目录与职责：

| 目录 | 放什么 |
| --- | --- |
| `Modules/` | 功能模块，按分区组织：`Beginner/`（新手区 5 个模块）、`Advanced/`（高级区）、`Uninstaller/`（卸载）、`Unlock/`（解除占用） |
| `Services/` | 全局服务：权限、日志、配置、设置、主题、插件加载等（下一页逐个点名） |
| `Utils/` | 底层工具：命令执行、注册表、进程、Win32 原生能力封装 |
| `Views/` | 界面：各分区页面、对话框（更新日志、协议、Fluent 对话框） |
| `Themes/` | 主题资源字典：`Brushes.Light.xaml`、`Brushes.Anime.xaml`、`FluentStyles.xaml` |
| `Models/` | 视图模型与数据模型（`ObservableObject`、各页面的 ViewModel） |
| `Assets/` | 图标、logo、壁纸、GPL-3.0 协议全文 |

每个功能分区基本都是“一个 Module（逻辑）+ 一个 View（界面）”的组合，比如卸载是 `Modules/Uninstaller/` + `Views/UninstallerView.xaml`。

## csproj 关键点逐条说

`LetsMeowToolbox.App.csproj` 里值得注意的配置：

| 配置 | 值 | 说明 |
| --- | --- | --- |
| `TargetFramework` | `net8.0-windows` | .NET 8，Windows 桌面 |
| `UseWPF` | `true` | WPF 应用 |
| `AssemblyName` | `LetsMeowToolbox` | 主程序名固定为 `LetsMeowToolbox.exe` |
| `Version` | `0.1.2` | v0.1.1 起启用版本号体系，更新日志见 `Services/AppInfo.cs` |
| `ApplicationManifest` | `app.manifest` | 应用清单 |
| `AllowUnsafeBlocks` | `true` | 允许 unsafe 代码块 |
| `PackageReference` | `HandyControl 3.5.1` | 唯一的 NuGet 依赖，UI 控件库 |

资源打包方式也值得留意：

- **嵌入资源**（打包进单文件，不需要随 exe 输出）：`logo_banner.png`、`app_icon.png`、`app.ico`；
- **嵌入资源**：`gpl-3.0.txt`（首次启动协议弹窗与关于页使用）；
- **松文件**（随程序输出到 exe 同目录，运行时从磁盘加载）：`wallpaper.png`（二次元化壁纸）；
- **可选目录**：存在 `assets/` 目录时，整个目录随输出复制。

单文件发布相关：未显式指定 RID 且开启了 `PublishSingleFile` 时，csproj 兜底 `win-x64`；自包含（`SelfContained=true`）时开启 `IncludeNativeLibrariesForSelfExtract`。

## Directory.Build.props 说了什么

仓库根目录的 `Directory.Build.props` 对全部工程生效：

- 产品名 `Let's Meow Toolbox`、公司/作者 `Hatasoft-Studio`、版权 `Copyright (c) 2026 Hatasoft-Studio`；
- `EnableWindowsTargeting=true`：允许在 Linux 上交叉编译 Windows 目标项目。

## 版本号规则（必读）

版本号体系自 v0.1.1 起执行，定义在 `Services/AppInfo.cs`：**主版本号.次版本号.修订号**

- **主版本号**：重大架构调整 / 破坏性变更时 +1（0.x 阶段指整体重构）；
- **次版本号**：新增功能时 +1；
- **修订号**：修复缺陷 / 优化时 +1。

规矩：**每次发布时必须在 `AppInfo` 同步更新 `Version` 与 `Changelog`**。程序内的“查看更新日志”弹窗读的就是这份数据，忘了更新用户就看不到新内容。
