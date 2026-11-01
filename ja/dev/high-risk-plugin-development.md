---
title: 高リスクプラグイン開発
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

# 高リスクプラグイン開発

このページでは Let's Meow Toolbox 用の高リスクプラグインの書き方を説明します。まずプロジェクトの鉄則を再確認：**全高リスク機能は外部 DLL プラグインの形でのみ存在を許可され**、メインプログラム本体（`LetsMeowToolbox.exe`）には高リスクコードは一切含まれず、`LetsMeowToolbox.PluginAbstractions` が定義するインターフェースを通じてプラグインを動的に読み込み呼び出すだけです。

公式の参考実装は `src/LetsMeowToolbox.Plugins.HighRisk/` で、3 つの操作が含まれます：`DefenderAction`（Defender の無効化）、`FirewallAction`（ファイアウォールの無効化）、`EdgeAction`（Edge・WebView2 の削除）。契約が理解できないときは、その構造を真似すれば大丈夫です。

## 契約一：IHighRiskPlugin（プラグイン本体）

各プラグインアセンブリは 1 つの `IHighRiskPlugin` を実装します：

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

いくつかのフィールドの意図：

- `Description` は「わかりやすい言葉」で書くことが求められます。これは一般ユーザーに直接表示されるためです。
- `Credit` はプログラム内の「特别鸣谢」ページに書き込まれるため、作者とプロジェクトホームページを正確に記入してください。

## 契約二：IHighRiskAction（単一操作）

プラグイン内の各高リスク操作は 1 つの `IHighRiskAction` を実装します。**インターフェースのコメントには必ず守るべき一文があります：「何をするか」のみを記述し、実行を許可するかどうかはユーザーが画面で手動確認後にトリガーされ、プラグイン内にはあらゆる「自動実行、自動確認、無提示」ロジックを禁止。**

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

メソッド設計の意図：

- `IsAvailable()` が `false` を返すと、画面はその操作を非表示にします。「現在のシステムバージョンに適用しない」ケースの処理に使用。
- `IsApplied()` は状態表示と復元ボタンに使用。
- `Apply()` / `Restore()` は実際の結果を返し、メインプログラムがログに記録してユーザーに表示します。

## メタデータ：結果とアセンブリマーク

`PluginMetadata.cs` にはさらに 2 つの補助タイプがあります：

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

## 開発手順

<VTDocSteps>
  <VTDocStep title="クラスライブラリの新規作成">
    `net8.0-windows` のクラスライブラリプロジェクトを新規作成し、`LetsMeowToolbox.PluginAbstractions` を参照します。
  </VTDocStep>
  <VTDocStep title="IHighRiskPlugin の実装">
    Id、PluginName、Description、Credit を記入し、Actions で操作リストを返します。
  </VTDocStep>
  <VTDocStep title="各操作に IHighRiskAction を実装">
    Description と Warning を明確に記述（これはユーザー向けのリスク提示です、手を抜かないこと）。必要に応じて RequiresAdmin、IsAvailable、IsApplied、Apply、Restore を実装。
  </VTDocStep>
  <VTDocStep title="アセンブリのマーク">
    `[assembly: HighRiskPlugin("プラグイン名", "バージョン")]` を追加し、メインプログラムの識別と表示を容易にします。
  </VTDocStep>
  <VTDocStep title="plugins ディレクトリに配置">
    DLL をコンパイル後、メインプログラムと同じ階層の `plugins/` ディレクトリ（LetsMeowToolbox.exe と同階層）に配置します。メインプログラムの起動時に動的に読み込まれます。DLL を削除すればプラグインの除去になります。
  </VTDocStep>
</VTDocSteps>

## 強制ルール（違反したら PR 不要）

1. 高リスク機能は一律外部 DLL とし、**高リスクコードのメインプログラムへのマージを禁止**。
2. プラグイン内の「自動実行、自動確認、無提示」ロジックを**禁止**——実行前にユーザーが画面で `Warning` を確認し、再確認することが必須。
3. `Apply` / `Restore` は実際の実行結果を返し、メインプログラムのログ記録と表示に供すること。
4. システムコアディレクトリとシステムコアプロセスはメインプログラムの内蔵ブラックリストで保護されており、プラグインもこの種のセキュリティ境界を回避すべきではありません。

<VTDocWarning>
サードパーティの高リスクプラグインは開発者が自ら責任を負います。メインプログラムは読み込みと確認のフレームワークを提供するのみで、プラグインの行為を保証しません。
</VTDocWarning>
