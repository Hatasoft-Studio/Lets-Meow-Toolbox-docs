---
title: 常见问题
description: Let's Meow! Toolbox 常见问题排查：程序打不开、日志位置、主题回退等，内容整理自项目官方 GitHub 仓库。
---

# 常见问题

本程序已内置**全局异常捕获与日志**：若启动或运行出错，会弹出错误对话框并写入日志，不会“静默打不开”。

<VTDocAccordionGroup>
  <VTDocAccordion title="框架依赖版双击没反应 / 打不开">
    请先安装 [.NET 8 桌面运行时](https://dotnet.microsoft.com/download/dotnet/8.0)（选择 “.NET Desktop Runtime 8.x”）。如果不想安装运行库，请直接下载**自包含（self-contained）**版本，它自带运行库、双击即用。
  </VTDocAccordion>
  <VTDocAccordion title="日志在哪里">
    日志位于 `%LocalAppData%\LetsMeowToolbox\logs\meow-日期.log`。在资源管理器地址栏粘贴 `%LocalAppData%\LetsMeowToolbox\logs` 回车即可打开目录。自 v0.1.1 起，日志改为全局记录，会记录用户全部设置操作、执行结果与时间（INFO / WARN / ERROR），不再为空文件。
  </VTDocAccordion>
  <VTDocAccordion title="界面背景变成纯色">
    非 Win11 系统可能会自动回退为纯色背景，这是预期行为，不影响功能使用。
  </VTDocAccordion>
  <VTDocAccordion title="高危插件区没有内容">
    主程序本体不含任何高危代码，需要将高危插件 DLL 放入程序同级的 `plugins` 目录后才会加载。
  </VTDocAccordion>
  <VTDocAccordion title="下载非常慢">
    因 GitHub.com 的服务器在海外，若下载非常慢，可前往下载页切换由 [EZ-Mirror](https://mirror.hatasoft365.top/) 提供的镜像加速线路。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 仍然无法解决？

如果出现了任何问题或 Bug，请前往本项目的官方 GitHub 仓库提 Issue：

- 官方仓库：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- 全部历史版本与更新说明：[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
