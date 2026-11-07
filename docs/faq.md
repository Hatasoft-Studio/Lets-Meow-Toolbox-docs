---
title: 常见问题
---

# 常见问题

这里收集了最常遇到的问题。先说一句定心丸：程序内置了**全局异常捕获与日志**，如果启动或运行出错，会弹出错误对话框并写入日志，不会“静默打不开”让你摸不着头脑。

## 程序打不开 / 没反应

<VTDocAccordionGroup>
  <VTDocAccordion title="双击没反应（最常见）">
    十有八九是你用的是“免安装精简版”（framework-dependent），但电脑里没装运行库。两个办法任选：

    1. 安装 [.NET 8 桌面运行时](https://dotnet.microsoft.com/download/dotnet/8.0)，注意选 “.NET Desktop Runtime 8.x”；
    2. 直接换“免安装完整版”（self-contained），它自带运行库，双击即用。
  </VTDocAccordion>
  <VTDocAccordion title="弹出错误对话框">
    这是程序的兜底机制在工作：出错会弹窗并写日志。记下弹窗信息，然后去日志目录看当天的日志文件，提 Issue 时把日志内容带上，作者排查会快很多。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 日志相关

<VTDocAccordionGroup>
  <VTDocAccordion title="日志在哪里">
    `%LocalAppData%\LetsMeowToolbox\logs\meow-日期.log`。资源管理器地址栏粘贴 `%LocalAppData%\LetsMeowToolbox\logs` 回车即可打开目录。
  </VTDocAccordion>
  <VTDocAccordion title="日志里记了什么">
    自 v0.1.1 起日志为全局记录：你的全部设置操作、执行结果与时间，按 INFO / WARN / ERROR 三个级别记录，不再是空文件。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 界面相关

<VTDocAccordionGroup>
  <VTDocAccordion title="背景变成纯色了">
    非 Win11 系统可能会自动回退为纯色背景，这是预期行为，不影响任何功能。
  </VTDocAccordion>
  <VTDocAccordion title="高危插件区是空的">
    主程序本身不含任何高危代码。要用高危功能，需要把高危插件 DLL 放进程序同级的 `plugins` 目录，详见[高危插件区](/docs/high-risk-zone.html)。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 语言与更新（v0.2.0 起）

<VTDocAccordionGroup>
  <VTDocAccordion title="找不到「选择语言」按钮">
    语言卡片在「设置」页最上面。如果 `lang` 目录里一个外置语言包都没有，程序仍然默认使用内嵌的简体中文；把官方语言包（或第三方 `.meowlang`）放进程序同级的 `lang` 目录后重启程序，列表里就会出现。
  </VTDocAccordion>
  <VTDocAccordion title="切换语言后程序自己重启了">
    这是正常设计。点「加载所选语言」并确认后，程序会重启一次，让所有界面文本按新语言重新翻译；重启失败时才会提示错误并写日志。
  </VTDocAccordion>
  <VTDocAccordion title="语言包装不上，提示版本不适用">
    语言包里的 `appVersion` 只允许用在指定版本上，例如 `0.2.0 | 0.2.1` 或 `>=0.2.0`。请换成适配当前版本的语言包，或者升级主程序。具体规则见[设置与关于](/docs/settings.html)。
  </VTDocAccordion>
  <VTDocAccordion title="提示同名语言包作者不一致，无法安装">
    程序发现 `lang` 目录里已有同 ID 的语言包，但作者或作者网站不同，为了防止覆盖，安装会被拒绝。到 `lang` 目录手动删除旧的 `.meowlang` 文件，再重新安装即可。
  </VTDocAccordion>
  <VTDocAccordion title="官方语言包怎么分辨">
    语言包详情里，官方语言包的制作者旁边会显示**绿色盾牌标识**；程序判定官方需要同时满足制作者为 `Hatasoft-Studio`、作者网站为官方站点。第三方语言包安装时还会额外弹一次确认。
  </VTDocAccordion>
  <VTDocAccordion title="点「检查更新」显示检查失败">
    检查更新需要访问官方更新接口，网络不通、被防火墙拦截或接口临时异常都会失败。可以稍后重试；失败不影响程序其他功能。若一直失败，请到 GitHub 仓库提 Issue。
  </VTDocAccordion>
  <VTDocAccordion title="启动时弹出「此版本已停止支持」">
    说明官方已经把当前版本列入停止支持列表，更新前无法继续使用。点「前往官网获取新版本」下载最新版；点「退出程序」则直接退出。更新后即可正常使用。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 下载相关

<VTDocAccordionGroup>
  <VTDocAccordion title="下载速度非常慢">
    GitHub 的服务器在海外，直连慢是正常的。到下载页把“下载线路”切换为 EZ-Mirror 镜像即可加速（Pre Release 版本除外，镜像站不同步预发布版本）。
  </VTDocAccordion>
  <VTDocAccordion title="找不到安装版（.exe 安装包）">
    不是每个版本都提供安装版。例如 v0.1.1 有 installer-version 安装包，v0.1.2 和 v0.2.0 就暂时没有。以下载页列出的实际资源为准；没有安装版时，用“免安装完整版”解压即用，体验是一样的。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 还是没解决？

如果出现了任何问题或 bug，请前往官方 GitHub 仓库提 Issue：

- 官方仓库：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- 全部历史版本与更新说明：[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- 提 Issue 前建议先看看[更新日志](/version.html)，确认你用的是最新版本——有些问题新版已经修掉了。
