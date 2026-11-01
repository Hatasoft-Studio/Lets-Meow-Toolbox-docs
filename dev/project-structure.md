---
title: 项目结构
description: Let's Meow! Toolbox 的解决方案结构、主程序内部分层与关键工程配置，内容整理自项目官方 GitHub 仓库。
---

# 项目结构

## 解决方案总览

```
LetsMeowToolbox/
├── LetsMeowToolbox.sln
├── LICENSE                    # GPL-3.0
├── Directory.Build.props      # 全局工程属性（产品/作者/版权/EnableWindowsTargeting）
├── build/
│   ├── publish-framework-dependent.ps1   # 单文件·依赖运行时
│   └── publish-self-contained.ps1        # 单文件·自包含
├── src/
│   ├── LetsMeowToolbox.App/               # 主程序 (LetsMeowToolbox.exe)
│   ├── LetsMeowToolbox.PluginAbstractions/# 插件契约接口
│   └── LetsMeowToolbox.Plugins.HighRisk/  # 🔴 高危插件（外置 DLL）
```

三个工程的职责：

| 工程 | 职责 |
| --- | --- |
| `LetsMeowToolbox.App` | 主程序（WPF），产物为 `LetsMeowToolbox.exe` |
| `LetsMeowToolbox.PluginAbstractions` | 高危插件对外契约（接口与元数据），主程序与插件共同引用 |
| `LetsMeowToolbox.Plugins.HighRisk` | 官方高危插件（关闭 Defender / 防火墙、移除 Edge·WebView2），编译为外置 DLL |

## 主程序内部分层

`src/LetsMeowToolbox.App/` 内部按职责组织：

### Modules（功能模块）

| 目录 | 模块 |
| --- | --- |
| `Modules/Beginner/` | `OptimizeModule`（优化）、`PrivacyAdsModule`（隐私/广告）、`RightClickMenuModule`（右键菜单）、`TaskbarExplorerModule`（任务栏/资源管理器）、`UwpCleanModule`（UWP 清理） |
| `Modules/Advanced/` | `WindowsUpdateModule`（Windows 更新） |
| `Modules/Uninstaller/` | `UninstallerService`（卸载服务）、`ResidueScanner`（残留扫描）、`ReportWriter`（报告导出） |
| `Modules/Unlock/` | `UnlockService`（解除占用） |

### Services（服务）

`AdminService`（管理员权限）、`AppInfo`（版本与更新日志）、`BackupService`（备份）、`ConfigService`（配置）、`FeatureHost`（功能宿主）、`FluentToast`（通知）、`LogService`（日志）、`OsVersionService`（系统版本检测）、`PluginLoader`（插件加载）、`SettingsService`（设置）、`ThemeService`（主题）、`Ui`（界面交互）。

### Utils（工具）

`CmdRunner`、`PowerShellRunner`（命令执行）、`NativeMethods`、`RestartManager`、`PendingFileOps`（Win32 原生能力与重启后文件操作）、`ProcessUtil`、`RegistryUtil`（进程/注册表）、`UwpWhitelist`（UWP 白名单）、`WindowBackdrop`（窗口背景）。

### Views 与 Themes

- `Views/`：`BeginnerView`、`AdvancedView`、`UninstallerView/Panel`、`UnlockView/Panel`、`HighRiskView`、`SettingsView`、`CreditsView`（特别鸣谢）、`ChangelogDialog`（更新日志）、`LicenseDialog`（协议）、`FluentDialog` 等。
- `Themes/`：`Brushes.Light.xaml`、`Brushes.Anime.xaml`（二次元模式）、`FluentStyles.xaml`。

## 关键工程配置

`LetsMeowToolbox.App.csproj` 要点：

- 目标框架 `net8.0-windows`，`UseWPF=true`，`OutputType=WinExe`
- `AssemblyName` 固定为 `LetsMeowToolbox`（主程序名 `LetsMeowToolbox.exe`）
- 版本号在 csproj 的 `Version` 中维护（v0.1.1 起，更新日志见 `Services/AppInfo.cs`）
- NuGet 依赖：`HandyControl 3.5.1`
- 嵌入资源：`logo_banner.png`、`app_icon.png`、`app.ico`（打包进单文件）与 `gpl-3.0.txt`（首次启动协议弹窗 / 关于页使用）
- `wallpaper.png`（二次元化壁纸）随程序输出为松文件，运行时从磁盘加载
- 引用 `LetsMeowToolbox.PluginAbstractions` 工程

`Directory.Build.props` 要点：产品名 `Let's Meow Toolbox`、作者 `Hatasoft-Studio`、`EnableWindowsTargeting=true`（允许 Linux 交叉编译）。

## 版本号规则

版本号体系自 v0.1.1 起执行（定义于 `Services/AppInfo.cs`）：**主版本号.次版本.修订号**

- 主版本号：重大架构调整 / 破坏性变更时 +1（0.x 阶段指整体重构）
- 次版本号：新增功能时 +1
- 修订号：修复缺陷 / 优化时 +1

每次发布时需在 `AppInfo` 同步更新 `Version` 与 `Changelog`。
