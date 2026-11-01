---
title: 高危插件开发
description: 基于 LetsMeowToolbox.PluginAbstractions 契约开发高危插件：接口定义、强制规则与部署方式，内容整理自项目官方 GitHub 仓库源码。
---

# 高危插件开发

所有 🔴 高危功能**只允许以外置 DLL 插件的形式出现**：主程序本体（`LetsMeowToolbox.exe`）不包含任何高危代码，仅通过 `LetsMeowToolbox.PluginAbstractions` 定义的接口动态加载并调用插件。

官方参考实现为 `src/LetsMeowToolbox.Plugins.HighRisk/`（包含 `DefenderAction`、`EdgeAction`、`FirewallAction` 三个操作）。

## 契约一：IHighRiskPlugin

插件对外契约，每个插件程序集实现一个：

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

## 契约二：IHighRiskAction

单个高危操作。**仅描述“做什么”，是否允许执行由用户在界面手动确认后触发，插件内禁止有任何“自动执行、自动确认、无提示”逻辑。**

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

## 元数据

`PluginMetadata.cs` 中还定义了两个辅助类型：

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
  <VTDocStep title="引用契约工程">
    新建类库（net8.0-windows），引用 LetsMeowToolbox.PluginAbstractions。
  </VTDocStep>
  <VTDocStep title="实现接口">
    实现 IHighRiskPlugin 与若干 IHighRiskAction；为每个操作写清楚 Description 与 Warning，并按需实现 RequiresAdmin、IsAvailable、IsApplied、Apply、Restore。
  </VTDocStep>
  <VTDocStep title="标记程序集">
    在 AssemblyInfo 中添加 [assembly: HighRiskPlugin("插件名", "版本")]，便于主程序识别与展示。
  </VTDocStep>
  <VTDocStep title="部署到 plugins 目录">
    编译得到 DLL 后，放入主程序同级的 plugins 目录（与 LetsMeowToolbox.exe 平级），主程序会动态加载；删除 DLL 即可移除该插件。
  </VTDocStep>
</VTDocSteps>

<VTDocNote>
插件的 `Credit` 字段（作者 / 项目主页）会写入程序内「特别鸣谢」页面，请如实填写。
</VTDocNote>

## 强制规则

- 高危功能一律外置 DLL，禁止把高危代码合入主程序。
- 插件内禁止“自动执行、自动确认、无提示”逻辑；执行前必须由用户在界面二次确认（`Warning` 文案会被展示）。
- `Apply` / `Restore` 应返回真实执行结果，供主程序记录日志与展示。
