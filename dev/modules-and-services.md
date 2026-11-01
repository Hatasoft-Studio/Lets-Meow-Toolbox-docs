---
title: 模块与服务速览
---

# 模块与服务速览

这一页把主程序里的功能模块（Modules）、服务（Services）、工具类（Utils）和主题（Themes）逐个点名，帮你在读源码时快速定位“这个文件是干什么的”。

## 功能模块（Modules/）

模块按功能分区组织，一个模块对应一组功能逻辑：

### Modules/Beginner/ —— 新手区

| 文件 | 负责 |
| --- | --- |
| `OptimizeModule.cs` | 电源 / 索引 / 自动播放 / 缩略图等优化项 |
| `PrivacyAdsModule.cs` | 关闭广告 / 遥测 / 通知推荐 |
| `RightClickMenuModule.cs` | Win11 经典右键菜单切换 |
| `TaskbarExplorerModule.cs` | 任务栏 / 资源管理器微调 |
| `UwpCleanModule.cs` | 安全 UWP 卸载（白名单） |

### Modules/Advanced/ —— 高级区

| 文件 | 负责 |
| --- | --- |
| `WindowsUpdateModule.cs` | Windows 更新暂停期限 / 禁用 |

### Modules/Uninstaller/ —— 卸载程序

| 文件 | 负责 |
| --- | --- |
| `UninstallerService.cs` | Win32 软件卸载主逻辑 |
| `ResidueScanner.cs` | 卸载后的残留扫描 |
| `ReportWriter.cs` | 清理报告导出 |

### Modules/Unlock/ —— 解除占用

| 文件 | 负责 |
| --- | --- |
| `UnlockService.cs` | 查找占用进程、关闭释放、开机延迟删除 |

## 服务（Services/）

服务是贯穿全局的单例能力，按文件名就能对上职责：

| 文件 | 一句话职责 |
| --- | --- |
| `AdminService.cs` | 管理员权限相关处理 |
| `AppInfo.cs` | 版本号、仓库地址与内置更新日志（`Changelog`），发版时必改 |
| `BackupService.cs` | 备份能力 |
| `ConfigService.cs` | 配置读写 |
| `FeatureHost.cs` | 功能宿主：承载各功能项的执行入口 |
| `FluentToast.cs` | Fluent 风格的通知提示 |
| `LogService.cs` | 全局日志（INFO / WARN / ERROR），写到 `%LocalAppData%\LetsMeowToolbox\logs` |
| `OsVersionService.cs` | 系统版本检测（Win10 / Win11 差异处理会用到） |
| `PluginLoader.cs` | 高危插件加载器：扫描并动态加载 `plugins/` 目录下的插件 DLL |
| `SettingsService.cs` | 设置项管理 |
| `ThemeService.cs` | 主题切换（浅色 / 二次元模式等） |
| `Ui.cs` | 界面交互封装（弹窗、错误提示等） |

## 工具类（Utils/）

底层能力封装，基本都是“脏活累活”的集中地：

| 文件 | 一句话职责 |
| --- | --- |
| `CmdRunner.cs` | 执行 cmd 命令 |
| `PowerShellRunner.cs` | 执行 PowerShell 命令 |
| `NativeMethods.cs` | Win32 原生 API 的 P/Invoke 声明 |
| `RestartManager.cs` | RestartManager API 封装（查“谁在占用文件”用的就是它） |
| `PendingFileOps.cs` | 重启后延迟文件操作（开机延迟删除的底层，基于 MoveFileEx 机制） |
| `ProcessUtil.cs` | 进程相关操作 |
| `RegistryUtil.cs` | 注册表读写封装 |
| `UwpWhitelist.cs` | UWP 卸载白名单（防止误删系统组件） |
| `WindowBackdrop.cs` | 窗口背景材质（Win11 材质 / 纯色回退） |

## 主题（Themes/）

| 文件 | 说明 |
| --- | --- |
| `Brushes.Light.xaml` | 浅色主题画笔 |
| `Brushes.Anime.xaml` | 二次元模式画笔（v0.1.1 优化过可读性） |
| `FluentStyles.xaml` | Fluent 风格样式 |

## 界面（Views/）速查

页面与分区基本一一对应：`BeginnerView`（新手区）、`AdvancedView`（高级区）、`UninstallerView` + `UninstallerPanel`（卸载程序）、`UnlockView` + `UnlockPanel`（解除占用）、`HighRiskView`（高危插件区）、`SettingsView`（设置）、`CreditsView`（特别鸣谢）。对话框类：`ChangelogDialog`（更新日志）、`LicenseDialog`（首次启动协议）、`FluentDialog`。

<VTDocTip>
读源码的推荐路线：先看 `Views/` 找到界面入口 → 跳到对应 `Modules/` 看逻辑 → 遇到底层操作再看 `Utils/`。服务层（`Services/`）在哪里都会被碰到，不用专门通读。
</VTDocTip>
