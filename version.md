---
title: 更新日志
description: Let's Meow! Toolbox 全部版本的更新记录，内容来自 GitHub Releases 与程序内置更新日志（Services/AppInfo.cs）。
editLink: false
lastUpdated: false
---

# 更新日志

版本号体系自 v0.1.1 起执行：**主版本号.次版本号.修订号**

- 主版本号：重大架构调整 / 破坏性变更时 +1（0.x 阶段指整体重构）
- 次版本号：新增功能时 +1
- 修订号：修复缺陷 / 优化时 +1

以下记录按版本倒序，最新在上。完整代码变更见各版本的 **Full Changelog** 链接。

## v0.1.2 · 2026-10-24

- 【新增】所有页面加入网页风格的右侧滚动条：内容超出窗口时自动出现，可上下拖动滑块、点击轨道翻页，滑块悬停/拖动时变粉色，圆角 Win11 样式。
- 【修复】解除占用页占用进程列表在小窗口下高度塌陷、滚轮被内部列表吞掉的问题，现在可随整页正常滚动。

**Full Changelog**：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/compare/v.0.1.1...v0.1.2>

<VTDocNote>
该版本尚未提供安装包（installer-version）版，安装包即自包含（self-contained）版本的安装包，请耐心等待。
</VTDocNote>

## v0.1.1 · 2026-10-24

- 【修复】日志系统：日志改为全局记录，记录用户全部设置操作、执行结果与时间（INFO/WARN/ERROR），不再为空文件。
- 【新增】设置页新增「一键初始化全部内容」：还原全部功能设置到默认状态、复位外观设置、清空配置预设。
- 【新增】版本号体系：自此版起为 v0.1.1，关于页显示当前版本；新增「查看更新日志」按钮（本窗口）。
- 【新增】特别鸣谢：每个开源项目新增「访问」按钮，一键打开该项目主页/GitHub 仓库；新增 EZ-Mirror 条目；修复字体模糊（加大字号、加深颜色）。
- 【新增】界面重组：「卸载程序」与「解除占用」从新手区/高级区拆出，各自独立为一个导航分类与独立页面。
- 【新增】关于页新增 GitHub 仓库信息与「前往 GitHub 仓库」一键按钮。
- 【修复】二次元模式下开关与按钮的颜色、文字可读性优化。

**Full Changelog**：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/commits/v.0.1.1>

---

感谢您对本项目的支持！如果出现了任何问题或 Bug，请前往本项目的官方 GitHub 仓库提 Issue！

官方 GitHub 仓库：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
