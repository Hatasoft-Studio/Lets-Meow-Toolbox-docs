---
title: 高危插件开发
---

# 高危插件开发

这一页讲怎么给 Let's Meow Toolbox 写一个高危插件。先重申项目的铁律：**所有高危功能只允许以外置 DLL 插件的形式出现**，主程序本体（`LetsMeowToolbox.exe`）不包含任何高危代码，仅通过 `LetsMeowToolbox.PluginAbstractions` 定义的接口动态加载并调用插件。

官方参考实现是 `src/LetsMeowToolbox.Plugins.HighRisk/`，里面有三个操作：`DefenderAction`（关闭 Defender）、`FirewallAction`（关闭防火墙）、`EdgeAction`（移除 Edge·WebView2）。看不懂契约的时候，照着它抄结构就行。

## 契约一：IHighRiskPlugin（插件本体）

每个插件程序集实现一个 `IHighRiskPlugin`：

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

几个字段的用意：

- `Description` 要求写“人话”，因为它是直接展示给普通用户看的；
- `Credit` 会被写进程序内的「特别鸣谢」页面，请如实填写作者与项目主页。

## 契约二：IHighRiskAction（单个操作）

插件里的每个高危操作实现一个 `IHighRiskAction`。**接口注释里有一句必须遵守的话：仅描述“做什么”，是否允许执行由用户在界面手动确认后触发，插件内禁止有任何“自动执行、自动确认、无提示”逻辑。**

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

方法设计的用意：

- `IsAvailable()` 返回 `false` 时界面会隐藏该操作，用来处理“当前系统版本不适用”的情况；
- `IsApplied()` 用于状态显示和还原按钮；
- `Apply()` / `Restore()` 返回真实结果，主程序会记录日志并展示给用户。

## 元数据：结果与程序集标记

`PluginMetadata.cs` 里还有两个辅助类型：

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

## 开发步骤

<VTDocSteps>
  <VTDocStep title="新建类库">
    新建一个 `net8.0-windows` 类库工程，引用 `LetsMeowToolbox.PluginAbstractions`。
  </VTDocStep>
  <VTDocStep title="实现 IHighRiskPlugin">
    填好 Id、PluginName、Description、Credit，并在 Actions 里返回你的操作列表。
  </VTDocStep>
  <VTDocStep title="为每个操作实现 IHighRiskAction">
    写清楚 Description 与 Warning（这是给用户看的风险提示，别敷衍）；按需实现 RequiresAdmin、IsAvailable、IsApplied、Apply、Restore。
  </VTDocStep>
  <VTDocStep title="标记程序集">
    添加 `[assembly: HighRiskPlugin("插件名", "版本")]`，便于主程序识别与展示。
  </VTDocStep>
  <VTDocStep title="放进 plugins 目录">
    编译出 DLL 后，放到主程序同级的 `plugins/` 目录（与 LetsMeowToolbox.exe 平级）。主程序启动时会动态加载；把 DLL 删掉就等于移除插件。
  </VTDocStep>
</VTDocSteps>

## 强制规则（违反就别提 PR）

1. 高危功能一律外置 DLL，**禁止把高危代码合入主程序**；
2. 插件内**禁止**“自动执行、自动确认、无提示”逻辑——执行前必须由用户在界面看到 `Warning` 并二次确认；
3. `Apply` / `Restore` 必须返回真实执行结果，供主程序记录日志与展示；
4. 系统核心目录与系统核心进程受主程序内置黑名单保护，插件也不应绕过这类安全边界。

<VTDocWarning>
第三方高危插件由开发者自行负责。主程序只提供加载与确认框架，不为插件的行为背书。
</VTDocWarning>
