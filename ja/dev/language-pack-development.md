---
title: 言語パック開発
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

# 言語パック開発

このページでは v0.2.0 で導入された外部言語パックの仕組みを説明します：`.meowlang` ファイルの構造、プログラムによる検証とインストール、自分で言語パックを作る方法、そして設定ページの「更新を確認」の背後にあるインターフェースです。

## 言語体系の構成

メインプログラムの多言語は 2 層で構成されます：

| 層 | 場所 | 説明 |
| --- | --- | --- |
| 組み込みソース言語 | `src/LetsMeowToolbox.App/Localization/zh-Hans.meowlang` | `EmbeddedResource` としてメインプログラムに組み込まれ、簡体字中国語は常に使用可能。外部ファイルに依存しない |
| 外部言語パック | プログラムディレクトリの `lang/*.meowlang` | リポジトリルートの `lang/` にある公式言語パック（`zh-Hant`、`ja`、`en`）。ビルド時に csproj が出力ディレクトリにコピーし、起動時に自動スキャン |

関連実装は 3 つのファイルに集中しています:

- `Services/LocalizationService.cs`：言語パックモデル `LanguagePack`、`lang` ディレクトリのスキャン、原文に基づく翻訳、ビジュアルツリーを走査して画面テキストを置換；
- `Services/LanguagePackInstaller.cs`：言語パックの読み込み検証、適用バージョン判定、バージョン比較、コピーインストール、プログラムの再起動；
- `Views/LanguageManagerDialog.xaml(.cs)`、`LanguagePackDetailsDialog`、`LanguageInstallProgressDialog`：言語選択、詳細確認、インストール進捗の 3 ウィンドウ。

簡体字中国語は**ソース言語**であり、他の言語パックの `strings` はすべて「簡体字中国語の原文 → 目標言語の訳文」のマッピングなので、新しい言語を追加するのに C# コードを変更する必要はありません。

## .meowlang ファイル形式

言語パックは本質的に UTF-8 でエンコードされた JSON テキストファイルです。最小の例：

```json
{
  "id": "xx",
  "name": "示例语言",
  "author": "YourName",
  "authorWebsite": "https://example.com",
  "version": "1.0.0",
  "source": "zh-Hans",
  "languageType": "示例语言",
  "appVersion": ">=0.2.0",
  "description": "这是一个示例语言包。",
  "strings": {
    "设置": "Settings",
    "检查更新": "Check for updates"
  }
}
```

フィールドの説明：

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `id` | ✅ | 言語パックの一意な識別子。インストール後のファイル名（`<id>.meowlang`）も決まります。`zh-Hans` は使用不可（組み込みソース言語です） |
| `name` | ✅ | 表示名。例：`繁體中文`、`日本語` |
| `author` | ✅ | 制作者。公式パックは `Hatasoft-Studio` に固定 |
| `authorWebsite` | — | 作者の公式サイト。`author` と共に公式言語パックかどうかを判定 |
| `version` | ✅ | 言語パック自身のバージョン番号。同名言語パックの更新/ダウングレード比較に使用 |
| `source` | — | ソース言語。デフォルトは `zh-Hans` |
| `languageType` | — | 言語タイプの文言。例：「英語」「繁体字中国語」 |
| `appVersion` | — | 適用するメインプログラムのバージョン範囲。デフォルトは `*` |
| `description` | — | 概要。詳細ウィンドウに表示 |
| `strings` | ✅ | 原文 → 訳文の辞書。空にはできない |

<VTDocTip>
`strings` のキーは画面の簡体字中国語原文と**完全に一致**している必要があります（句読点とスペースを含む）。プログラムは原文で厳密に照合し、訳文が見つからない場合は簡体字中国語をそのまま表示し、エラーにはなりません。複数行テキストは行ごとに辞書を引きます：空行はスキップされ、中国語文字を含まない行（ブランド名、数字、英字のみ）はそのまま保持されます。
</VTDocTip>

## 適用バージョン（appVersion）のルール

判定ロジックは `LanguagePackInstaller.CheckCompatible` にあり、最終的に `MatchesRange` に委譲されます：

- 空欄または `*`：どのバージョンにも適用；
- `|` で複数の区間を区切れ、いずれか 1 つが一致すれば通過。例：`0.2.0 | 0.2.1 | 0.2.2`；
- 単一区間では `>=`、`<=`、`>`、`<`、`=`、`==` の接頭辞に対応し、バージョン番号を直接書くこともできます（`==` と同等）；
- 同じ区間内ではスペースまたはカンマで複数条件を書け、**すべて満たす**必要があります；
- 解析できない条件は無視され、誤判定を避けます。

バージョン比較は `LanguagePackInstaller.CompareVersion` が行います：バージョン番号を解析する際に先頭の `v`/`V` を除去し、`.` で区切って整数を取得し、非数字部分は切り捨てます（そのため `v1.1.0-lang` は `1.1.0` として比較されます）。

## 公式言語パックの判定方法

`LanguagePackRules.IsOfficial` は**作者と作者サイトの両方の一致**を要求します：

- `author` が `Hatasoft-Studio` と等しい（大文字小文字を区別しない、前後の空白を除去）；
- `authorWebsite` が `https://hatasoft365.top` または `https://lets-meow-toolbox.hatasoft365.top` と等しい（同様に大文字小文字を無視、末尾のスラッシュは除去）。

両方を満たす場合のみ、詳細ウィンドウに緑色の盾が表示され、サードパーティ確認がスキップされます。

## インストールフロー（コードレベル）

設定ページの「言語パックをインストール」は最終的に `LanguageManagerDialog.InstallInteractive` を呼び出し、順序は以下の通りです：

1. `LanguagePackInstaller.ReadFile` がファイルを読み込み、必須フィールド（`id`、`name`、`author`、`version`、`strings`）を検証；
2. `id == zh-Hans` を拒否（簡体字中国語は組み込み済み）；
3. `CheckCompatible` がバージョン範囲を検証し、通過しない場合はエラーを表示して WARN ログを書き込む；
4. `lang` ディレクトリに同じ `id` のパックが既に存在する場合：
   - `SameIdentity` で `author` と `authorWebsite` を比較（大文字小文字を無視、末尾の `/` を無視）。一致しない場合は上書きを拒否し、古いパックを手動で削除するよう案内；
   - `CompareVersion` で今回が「更新」「ダウングレード」「再インストール」のどれかを判定し、再確認；
5. `LanguagePackDetailsDialog` が詳細を表示（インストール日時は現在時刻、ファイルサイズはソースファイルの長さ）；
6. 非公式言語パックは追加でサードパーティ確認を 1 回表示；
7. `LanguageInstallProgressDialog` がインストールを実行：`LanguagePackInstaller.Install` がまず `.tmp` にコピーし、その後対象ファイルを置換し、ファイルの更新日時を現在時刻に設定（詳細の「インストール日時」はこれを読み取ります）；
8. 成功後は `LocalizationService.Refresh()` でディレクトリを再スキャンし、「言語パックのインストールに成功しました！」と表示；失敗時は理由と `LogService.Instance.LogFilePath` を表示。

<VTDocWarning>
インストールは単にファイルを `lang` ディレクトリにコピーするだけの処理で、**言語パック内のコードは一切実行されません**。ただし言語パックは画面文言を置き換えるため、サードパーティの言語パックはインストール前に JSON の内容を確認することを推奨します。
</VTDocWarning>

## 言語の切り替えと再起動

「選択した言語を読み込む」の実行順序：

1. `CheckCompatible` で再度検証；
2. 既に現在の言語である場合は、再読み込みが不要であることを直接通知；
3. 詳細ウィンドウを表示して確認；
4. `LocalizationService.SetLanguage(id)` が `SettingsService.Language` に書き込み、`LanguageChanged` イベントを発生させる；
5. `LanguagePackInstaller.RestartApp` が新しいプロセスを起動し、`Application.Current.Shutdown()`。

プログラム起動時に `LocalizationService.Initialize()` が組み込みの簡体字中国語を読み込み、`lang` ディレクトリをスキャンし、設定に保存された言語 ID に従って前回の選択を復元します。指定されたパックが存在しない場合は簡体字中国語にフォールバックし、設定も元に戻します。

## 画面翻訳の実装方法

`LocalizationService` は各コントロールにリソースをバインドするのではなく、**ビジュアルツリーを走査して静的テキストを置換**します：

- `LocalizeElement` は `TextBlock.Text`（`Run` を含む）、`ContentControl.Content`、`HeaderedContentControl.Header`、`Window.Title`、`FrameworkElement.ToolTip` を処理；
- データバインディングのあるプロパティは無視（`BindingOperations.GetBindingExpressionBase` が空でない場合はスキップ）し、MVVM バインディングの破壊を防止；
- `ConditionalWeakTable` で各コントロールの未翻訳原文を記録し、言語切り替え時は原文に基づいて再翻訳するため、繰り返し切り替えても「訳文の上に訳文」が重なることはありません；
- `ApplyToDeferred` は `DispatcherPriority.Loaded` 時に翻訳し、テンプレートとリスト項目のインスタンス化完了を待ちます；ウィンドウレベルの `Loaded` イベントは `EventManager.RegisterClassHandler` で一括フックし、子ページ/ダイアログは能動的に呼び出す必要があります。

これが言語切り替えで必ず再起動が必要な理由でもあります：実行中に追加されたコントロールや動的生成されたテキストは即時更新されないことがあり、再起動が最も確実です。

## ビルド時に言語パックを成果物へ含める方法

`LetsMeowToolbox.App.csproj` には 2 つの重要な設定があります：

```xml
<!-- 内嵌语言：简体中文（源语言）随程序打包，无需外置语言包 -->
<ItemGroup>
  <EmbeddedResource Include="Localization\zh-Hans.meowlang" />
</ItemGroup>

<!-- 外置语言包：随程序输出到 lang 目录，启动时自动扫描 -->
<ItemGroup>
  <None Include="..\..\lang\**\*.meowlang"
        Link="lang\%(RecursiveDir)%(Filename)%(Extension)"
        CopyToOutputDirectory="PreserveNewest"
        CopyToPublishDirectory="PreserveNewest" />
</ItemGroup>
```

したがってデバッグ（F5）でも `dotnet publish` 後でも、成果物ディレクトリには自動的に `lang/` が現れ、手動でコピーする必要はありません。

## 自分で言語パックを作る

1. 公式の `lang/en.meowlang`（または `ja.meowlang`）をテンプレートとしてコピー；
2. `id`、`name`、`author`、`authorWebsite`、`version`、`languageType`、`description` を変更；
3. `appVersion` を現在のメインプログラムバージョンに合わせて記入。例：`>=0.2.0` または `0.2.0 | 0.2.1`；
4. `strings` に訳文を 1 つずつ記入し、キーは簡体字中国語原文のまま維持；
5. UTF-8 JSON として保存し、ファイル名は `id` と一致させることを推奨；
6. プログラムの「設定」→「言語パックをインストール」でこのファイルを選択し、詳細確認後にインストール、その後「言語を選択」で読み込む。

<VTDocTip>
デバッグ時は `.meowlang` をプログラムディレクトリの `lang` フォルダに直接置いてプログラムを再起動するだけでも、言語管理ウィンドウに表示されます——インストールボタンはこの手順をより正式にするだけです（検証、確認、インストール日時の記録）。
</VTDocTip>

## 設定ページ「更新を確認」インターフェース

`Services/UpdateService.cs` は固定アドレスに要求します：

```text
https://api.lets-meow-toolbox.hatasoft365.top/
```

リクエストヘッダーには `User-Agent: LetsMeowToolbox/<現在のバージョン>` と `Accept: application/json` が付き、タイムアウトは 10 秒です。返された JSON は `UpdateInfo` にマッピングされます：

| フィールド | 説明 |
| --- | --- |
| `latestVersion` | 最新バージョン番号。必須。空の場合はインターフェースデータを無効とみなす |
| `downloadUrl` | 公式サイトのダウンロードアドレス。空の場合は `https://lets-meow-toolbox.hatasoft365.top` にフォールバック |
| `unsupportedVersions` | サポート終了バージョン番号の配列。現在のバージョンを含む場合は起動時に強制更新 |
| `changelog` | 更新説明テキスト。更新ダイアログに表示 |

判定ロジック：

- `HasUpdate`：`CompareVersion(latestVersion, AppInfo.Version) > 0`；
- `Unsupported`：`unsupportedVersions` 内のいずれかと現在のバージョンの比較結果が等しい。

`Views/UpdateDialog` には 2 つのモードがあります：

- **通常モード**：現在のバージョン、最新バージョン、ダウンロードアドレス、更新内容を表示し、ボタンは「公式サイトで新バージョンを入手」/「後で」；
- **強制モード**（`Unsupported`）：タイトルが「このバージョンはサポートを終了しました」になり、ボタンは「公式サイトで新バージョンを入手」/「プログラムを終了」。ウィンドウを閉じるとプログラムが終了します。

<VTDocNote>
更新インターフェースのアドレスは `UpdateService.Endpoint` 定数に固定されており、`SettingsView` と起動時検出の両方が同じサービスを使用します。インターフェースアドレスを変更する際は、この 2 つの呼び出し箇所も忘れずに確認してください。
</VTDocNote>
