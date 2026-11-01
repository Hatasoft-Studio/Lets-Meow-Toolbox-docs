---
title: 高危外掛開發
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

# 高危外掛開發

這一頁講怎麼給 Let's Meow Toolbox 寫一個高危外掛。先重申項目的鐵律：**所有高危功能只允許以外置 DLL 外掛的形式出現**，主程式本體（`LetsMeowToolbox.exe`）不包含任何高危代碼，僅透過 `LetsMeowToolbox.PluginAbstractions` 定義的介面動態載入並調用外掛。

官方參考實作是 `src/LetsMeowToolbox.Plugins.HighRisk/`，裡面有三個操作：`DefenderAction`（關閉 Defender）、`FirewallAction`（關閉防火牆）、`EdgeAction`（移除 Edge·WebView2）。看不懂契約的時候，照著它抄結構就行。

## 契約一：IHighRiskPlugin（外掛本體）

每個外掛組件實作一個 `IHighRiskPlugin`：

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

幾個欄位的用意：

- `Description` 要求寫「白話」，因為它是直接展示給普通使用者看的；
- `Credit` 會被寫進程式內的「特別鳴謝」頁面，請如實填寫作者與項目主頁。

## 契約二：IHighRiskAction（單個操作）

外掛裡的每個高危操作實作一個 `IHighRiskAction`。**介面註解裡有一句必須遵守的話：僅描述「做什麼」，是否允許執行由使用者在介面手動確認後觸發，外掛內禁止有任何「自動執行、自動確認、無提示」邏輯。**

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

方法設計的用意：

- `IsAvailable()` 返回 `false` 時介面會隱藏該操作，用來處理「當前系統版本不適用」的情況；
- `IsApplied()` 用於狀態顯示和還原按鈕；
- `Apply()` / `Restore()` 返回真實結果，主程式會寫入記錄並展示給使用者。

## 元數據：結果與組件標記

`PluginMetadata.cs` 裡還有兩個輔助類型：

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

## 開發步驟

<VTDocSteps>
  <VTDocStep title="新建類別庫">
    新建一個 `net8.0-windows` 類別庫專案，引用 `LetsMeowToolbox.PluginAbstractions`。
  </VTDocStep>
  <VTDocStep title="實作 IHighRiskPlugin">
    填好 Id、PluginName、Description、Credit，並在 Actions 裡返回你的操作列表。
  </VTDocStep>
  <VTDocStep title="為每個操作實作 IHighRiskAction">
    寫清楚 Description 與 Warning（這是給使用者看的風險提示，別敷衍）；按需實作 RequiresAdmin、IsAvailable、IsApplied、Apply、Restore。
  </VTDocStep>
  <VTDocStep title="標記組件">
    添加 `[assembly: HighRiskPlugin("插件名", "版本")]`，便於主程式識別與展示。
  </VTDocStep>
  <VTDocStep title="放進 plugins 目錄">
    編譯出 DLL 後，放到主程式同級的 `plugins/` 目錄（與 LetsMeowToolbox.exe 平級）。主程式啟動時會動態載入；把 DLL 刪掉就等於移除外掛。
  </VTDocStep>
</VTDocSteps>

## 強制規則（違反就別提 PR）

1. 高危功能一律外置 DLL，**禁止把高危代碼合入主程式**；
2. 外掛內**禁止**「自動執行、自動確認、無提示」邏輯——執行前必須由使用者在介面看到 `Warning` 並二次確認；
3. `Apply` / `Restore` 必須返回真實執行結果，供主程式寫入記錄與展示；
4. 系統核心目錄與系統核心程序受主程式內建黑名單保護，外掛也不應繞過這類安全邊界。

<VTDocWarning>
第三方高危外掛由開發者自行負責。主程式只提供載入與確認框架，不為外掛的行為背書。
</VTDocWarning>
