---
title: High-Risk Plugin Development
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# High-Risk Plugin Development

This page explains how to write a high-risk plugin for Let's Meow Toolbox. Let's restate the project's iron rule first: **all high-risk features are only allowed to appear as external DLL plugins** — the main program itself (`LetsMeowToolbox.exe`) contains no high-risk code, and only dynamically loads and invokes plugins through the interfaces defined by `LetsMeowToolbox.PluginAbstractions`.

The official reference implementation is `src/LetsMeowToolbox.Plugins.HighRisk/`, containing three operations: `DefenderAction` (Disable Defender), `FirewallAction` (Disable Firewall), `EdgeAction` (Remove Edge·WebView2). When you don't understand the contract, just copy its structure.

## Contract 1: IHighRiskPlugin (The Plugin Itself)

Each plugin assembly implements one `IHighRiskPlugin`:

```csharp
public interface IHighRiskPlugin
{
    /// 插件唯一标识（建议使用反向域名风格）。
    string Id { get; }

    /// 插件显示名称。
    string PluginName { get; }

    /// 插件简介（人话说明）。
    string Description { get; }

    /// 版权信息（作者 / 项目主页，写入“特别鸣谢”）。
    string Credit { get; }

    /// 该插件提供的全部高危操作。
    IReadOnlyList<IHighRiskAction> Actions { get; }
}
```

The purpose of several fields:

- `Description` is required to be written in "plain language" because it is shown directly to ordinary users;
- `Credit` is written into the in-program "Special Thanks" page — please fill in the author and project homepage truthfully.

## Contract 2: IHighRiskAction (A Single Operation)

Each high-risk operation inside a plugin implements one `IHighRiskAction`. **There is one sentence in the interface comments that must be obeyed: only describe "what to do"; whether execution is allowed is triggered by the user manually confirming in the UI; any "auto-execute, auto-confirm, no-prompt" logic inside the plugin is forbidden.**

```csharp
public interface IHighRiskAction
{
    string Id { get; }              // 操作唯一标识
    string Title { get; }           // 操作名称
    string Description { get; }     // 人话说明：做什么、会有什么影响
    string Warning { get; }         // 高危风险提示文案（启用前必须向用户展示并二次确认）
    string RegistryNote { get; }    // 底层注册表 / API 路径（可选，供“显示底层路径”使用）
    bool RequiresAdmin { get; }     // 是否需要管理员权限

    // 检测该操作在当前系统是否可用（例如版本不匹配时返回 false，界面隐藏）
    bool IsAvailable();

    // 检测该操作当前是否处于“已启用”状态（用于还原按钮 / 状态显示）
    bool IsApplied();

    // 执行该高危操作。返回是否成功
    bool Apply();

    // 还原该操作。返回是否成功
    bool Restore();
}
```

The purpose of the method design:

- When `IsAvailable()` returns `false`, the UI hides that operation — handling the "not applicable to the current system version" case;
- `IsApplied()` is used for status display and the restore button;
- `Apply()` / `Restore()` return the real result; the main program records it in the log and shows it to the user.

## Metadata: Result and Assembly Attribute

`PluginMetadata.cs` also contains two helper types:

```csharp
/// 插件操作执行结果。返回给主程序用于记录日志与展示。
public sealed record HighRiskActionResult(bool Success, string Message);

/// 标记高危插件程序集的特性，便于主程序识别与展示。
[AttributeUsage(AttributeTargets.Assembly)]
public sealed class HighRiskPluginAttribute : Attribute
{
    public string Name { get; }
    public string Version { get; }

    public HighRiskPluginAttribute(string name, string version) { ... }
}
```

## Development Steps

<VTDocSteps>
  <VTDocStep title="Create a class library">
    Create a new `net8.0-windows` class library project referencing `LetsMeowToolbox.PluginAbstractions`.
  </VTDocStep>
  <VTDocStep title="Implement IHighRiskPlugin">
    Fill in Id, PluginName, Description and Credit, and return your list of operations in Actions.
  </VTDocStep>
  <VTDocStep title="Implement IHighRiskAction for each operation">
    Write Description and Warning clearly (this is the risk warning shown to users — don't be sloppy); implement RequiresAdmin, IsAvailable, IsApplied, Apply and Restore as needed.
  </VTDocStep>
  <VTDocStep title="Mark the assembly">
    Add `[assembly: HighRiskPlugin("插件名", "版本")]` so the main program can recognize and display it.
  </VTDocStep>
  <VTDocStep title="Put it into the plugins directory">
    After compiling the DLL, place it into the `plugins/` directory alongside the main program (same level as LetsMeowToolbox.exe). The main program dynamically loads it at startup; deleting the DLL equals removing the plugin.
  </VTDocStep>
</VTDocSteps>

## Mandatory Rules (Don't Even Think About a PR If You Violate Them)

1. High-risk features must all be external DLLs — **merging high-risk code into the main program is forbidden**;
2. "Auto-execute, auto-confirm, no-prompt" logic is **forbidden** inside plugins — before execution, the user must see the `Warning` in the UI and confirm a second time;
3. `Apply` / `Restore` must return the real execution result, for the main program to log and display;
4. Core system directories and core system processes are protected by the main program's built-in blacklist; plugins must not bypass such security boundaries either.

<VTDocWarning>
Third-party high-risk plugins are the sole responsibility of their developers. The main program only provides the loading and confirmation framework and does not endorse plugin behavior.
</VTDocWarning>
