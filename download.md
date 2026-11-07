---
title: 下载 Let's Meow! Toolbox
description: 一个二次元现代化 UI、新手友好的 Windows 10 / 11 一体化调优工具箱。下方会自动从 GitHub 拉取 Release 与 Pre Release 两个通道的全部版本，可选择任意版本下载；Release 支持 EZ-Mirror 镜像加速。
outline: deep
editLink: false
lastUpdated: false
---

<ReleaseDownloader />

## 更新通道

| 通道 | 内容 | 下载线路 | 说明 |
| --- | --- | --- | --- |
| Release | 正式发布版本 | GitHub / EZ-Mirror 镜像 | 默认通道，镜像站会同步这些版本 |
| Pre Release | 预发布版本 | 仅 GitHub | 镜像站暂未同步，只能从 GitHub 下载 |

页面顶部的“版本”下拉会列出当前通道下的全部历史版本，默认选中最新版，也可以自由选择更早的版本号下载。对应版本的 GitHub 与 EZ-Mirror 链接都会自动生成；如果某个版本没有提供安装版，页面会自动隐藏安装版按钮，只保留免安装包。

## 版本类型与体积

程序提供两种单文件发布模式，下载列表中的“免安装精简版”与“免安装完整版”分别对应它们：

| 发布模式 | 是否需要 .NET 8 桌面运行时 | 体积参考 | 适用场景 |
| --- | --- | --- | --- |
| 依赖运行时（framework-dependent） | 需要 | 约 10~20 MB | 机器上已安装 .NET 8 桌面运行时 |
| 自包含（self-contained） | 不需要 | 约 90~110 MB | 全新系统，不想再装运行库 |

两种模式都是单文件 `LetsMeowToolbox.exe`，并附带 `plugins/`（高危插件）与 `lang/`（语言包）目录，解压即用。页面中显示的文件大小以 GitHub Release 的实际产物为准。

## 安装与首次运行

<VTDocSteps>
  <VTDocStep title="下载并解压">
    从上方列表下载对应版本的 zip，解压后得到 LetsMeowToolbox.exe、plugins 与 lang 目录。
  </VTDocStep>
  <VTDocStep title="按需安装运行时">
    选择“免安装精简版”时，请先安装 .NET 8 桌面运行时（.NET Desktop Runtime 8.x）；“免安装完整版”自带运行库，可跳过这一步。
  </VTDocStep>
  <VTDocStep title="双击运行">
    直接运行 LetsMeowToolbox.exe。主程序不含任何高危代码，高危功能仅来自 plugins 目录中的外置插件 DLL。
  </VTDocStep>
  <VTDocStep title="按提示确认操作">
    所有修改、删除与清理都需要手动确认，残留与占用项默认不勾选。
  </VTDocStep>
</VTDocSteps>

<VTDocTip>
  程序内置全局异常捕获与日志。若启动出错，可打开 <code>%LocalAppData%\LetsMeowToolbox\logs</code> 查看对应日期的日志文件。
</VTDocTip>

## 系统要求与安全设计

<VTDocCardGroup cols="2">
  <VTDocCard title="系统与架构" icon="gear">
    仅支持 Windows 10 / 11（x64）。技术栈为 WPF · .NET 8（LTS）· C# · HandyControl。
  </VTDocCard>
  <VTDocCard title="安全设计" icon="shield-halved">
    不加壳、不混淆、无自解压逻辑；底层只调用微软原生 Win32 API（RestartManager、MoveFileEx、Registry 等）。
  </VTDocCard>
  <VTDocCard title="内置黑名单" icon="list-check">
    C:\Windows、System32、WinSxS 等系统核心目录与系统核心进程禁止强制结束。
  </VTDocCard>
  <VTDocCard title="开源许可" icon="browser">
    项目以 GPL-3.0 许可开源，主程序代码与高危插件分离，可自行审阅与构建。
  </VTDocCard>
</VTDocCardGroup>

## 常见问题

<VTDocAccordionGroup>
  <VTDocAccordion title="框架依赖版双击没反应 / 打不开">
    请先安装 .NET 8 桌面运行时（选择 “.NET Desktop Runtime 8.x”）。如果不想安装运行库，请直接下载自包含（self-contained）版本，它自带运行库、双击即用。
  </VTDocAccordion>
  <VTDocAccordion title="日志在哪里">
    日志位于 %LocalAppData%\LetsMeowToolbox\logs\meow-日期.log。在资源管理器地址栏粘贴 %LocalAppData%\LetsMeowToolbox\logs 回车即可打开目录。
  </VTDocAccordion>
  <VTDocAccordion title="界面背景变成纯色">
    非 Win11 系统可能会自动回退为纯色背景，这是预期行为，不影响功能使用。
  </VTDocAccordion>
  <VTDocAccordion title="高危插件区没有内容">
    主程序本体不含任何高危代码，需要将高危插件 DLL 放入程序同级的 plugins 目录后才会加载。
  </VTDocAccordion>
  <VTDocAccordion title="想换繁体中文 / 日语 / 英语界面">
    官方语言包已随 v0.2.0 的压缩包放在 lang 目录里。打开「设置」→「语言 / Language」→「选择语言」，选好语言后点「加载所选语言」，程序会自动重启生效。详见[设置与关于](/docs/settings.html)。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 其他获取方式

<VTDocCardGroup cols="2">
  <VTDocCard title="GitHub Releases" icon="list-check" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases">
    查看全部历史版本与更新说明，也可手动挑选任意安装包。
  </VTDocCard>
  <VTDocCard title="EZ-Mirror 镜像站" icon="upload" href="https://mirror.hatasoft365.top">
    由 EZ-Mirror 提供的加速下载线路，可在上方“下载线路”切换；镜像仅同步已发布到该站的版本。
  </VTDocCard>
  <VTDocCard title="源码仓库" icon="browser" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox">
    克隆仓库后使用 build 目录下的发布脚本自行构建单文件版本。
  </VTDocCard>
  <VTDocCard title=".NET 8 桌面运行时" icon="rocket" href="https://dotnet.microsoft.com/download/dotnet/8.0">
    使用依赖运行时版本前，请在此下载并安装 .NET Desktop Runtime 8.x。
  </VTDocCard>
  <VTDocCard title="官方语言包（External Language Pack）" icon="list-check" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases/tag/v1.1.0-lang">
    繁体中文、日语、英语语言包单独发布页，下载 .meowlang 后在程序内「安装语言包」即可；随主程序压缩包发布时则已放在 lang 目录。
  </VTDocCard>
</VTDocCardGroup>

<VTDocNote>
  这是一个 Vibe-Coding 作品，每次发布都会经过作者亲测。作者：Hatasoft-Studio；项目主页与问题反馈见 GitHub 仓库。
</VTDocNote>
