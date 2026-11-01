---
title: 快速上手
description: 下载、安装与运行 Let's Meow! Toolbox 的完整指引，内容整理自项目官方 GitHub 仓库。
---

# 快速上手

Let's Meow! Toolbox 是一个**二次元现代化 UI、新手友好的 Windows 10 / 11 一体化调优工具箱**，主程序为单文件 `LetsMeowToolbox.exe`，体积小、功能基本够用、页面简洁、说明直白。

## 系统要求

- **操作系统**：Windows 10 / 11
- **架构**：x64（官方发布均为 `win-x64`）
- **技术栈**：WPF · .NET 8（LTS）· C# · HandyControl（MIT）

## 获取安装包

前往[下载页](/download.html)，页面会自动从 GitHub 拉取全部版本并生成下载链接：

- **GitHub 直连**：官方发布渠道（[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)）。
- **EZ-Mirror 镜像加速**：因 GitHub.com 服务器在海外，若下载非常慢，可切换由 [EZ-Mirror](https://mirror.hatasoft365.top/) 提供的加速线路。

<VTDocNote>
Pre Release（预发布）版本仅支持 GitHub 下载，EZ-Mirror 镜像暂未同步预发布版本。
</VTDocNote>

## 选择版本类型

程序提供两种单文件发布模式：

| 发布模式 | 是否需要 .NET 8 桌面运行时 | 体积参考 | 适用场景 |
| --- | --- | --- | --- |
| 依赖运行时（framework-dependent） | 需要 | 约 10~20 MB | 机器上已安装 .NET 8 桌面运行时 |
| 自包含（self-contained） | 不需要 | 约 90~110 MB | 全新系统，不想再装运行库 |

两种模式都是单文件 `LetsMeowToolbox.exe`，并附带 `plugins/` 目录，解压即用。

<VTDocTip>
若框架依赖版打不开：请先安装 [.NET 8 桌面运行时](https://dotnet.microsoft.com/download/dotnet/8.0)（选择 “.NET Desktop Runtime 8.x”）。若不想装运行库，请直接使用**自包含（self-contained）**版本，它自带运行库、双击即用。
</VTDocTip>

部分版本还提供**安装包（installer-version）**，它就是自包含版本的安装包（例如 v0.1.1）；并非每个版本都会附带安装包，以下载页列出的实际资源为准。

## 运行

<VTDocSteps>
  <VTDocStep title="解压">
    将下载的 zip 解压，得到 LetsMeowToolbox.exe 与 plugins 目录。
  </VTDocStep>
  <VTDocStep title="按需安装运行时">
    依赖运行时版本需先安装 .NET 8 桌面运行时；自包含版本可跳过。
  </VTDocStep>
  <VTDocStep title="双击运行">
    直接运行 LetsMeowToolbox.exe。主程序不含任何高危代码，高危功能仅来自 plugins 目录中的外置插件 DLL。
  </VTDocStep>
  <VTDocStep title="按提示确认操作">
    所有修改、删除与清理都需要手动确认，残留与占用项默认不勾选。
  </VTDocStep>
</VTDocSteps>

## 日志位置

程序内置全局异常捕获与日志：若启动或运行出错，会弹出错误对话框并写入日志，不会“静默打不开”。

- 日志路径：`%LocalAppData%\LetsMeowToolbox\logs\meow-日期.log`
- 在资源管理器地址栏粘贴 `%LocalAppData%\LetsMeowToolbox\logs` 回车即可打开日志目录。

## 下一步

- 了解各[功能分区](/docs/features.html)的用途与边界
- 遇到问题先查[常见问题](/docs/faq.html)
- 查看[更新日志](/version.html)了解版本变化
