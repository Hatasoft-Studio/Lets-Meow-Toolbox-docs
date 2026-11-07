---
title: プロジェクト構造の詳細
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

# プロジェクト構造の詳細

このページではリポジトリを外から内まで一通り分解します：ソリューション内のプロジェクト、メインプログラム内部の階層構造、プロジェクトファイル内の重要な設定。

## リポジトリのトップレベル

```
LetsMeowToolbox/
├── LetsMeowToolbox.sln
├── LICENSE                    # GPL-3.0
├── Directory.Build.props      # 全局工程属性
├── build/
│   ├── publish-framework-dependent.ps1   # 单文件·依赖运行时
│   └── publish-self-contained.ps1        # 单文件·自包含
├── lang/                                  # 外置语言包（官方：zh-Hant / ja / en）
├── src/
│   ├── LetsMeowToolbox.App/               # 主程序 (LetsMeowToolbox.exe)
│   ├── LetsMeowToolbox.PluginAbstractions/# 插件契约接口
│   └── LetsMeowToolbox.Plugins.HighRisk/  # 🔴 高危插件（外置 DLL）
```

## 3 つのプロジェクトの役割

| プロジェクト | タイプ | 責務 |
| --- | --- | --- |
| `LetsMeowToolbox.App` | WPF アプリ（WinExe） | メインプログラム。成果物 `LetsMeowToolbox.exe`、PluginAbstractions を参照 |
| `LetsMeowToolbox.PluginAbstractions` | クラスライブラリ | 高リスクプラグインの外部向け契約：インターフェースとメタデータ。メインプログラムとプラグインはこの契約のみを認めます |
| `LetsMeowToolbox.Plugins.HighRisk` | クラスライブラリ（外部 DLL） | 公式高リスクプラグイン：Defender の無効化 / ファイアウォールの無効化 / Edge・WebView2 の削除 |

この分割がプロジェクト全体のセキュリティ設計の核心です：**高リスクコードは物理的にメインプログラム内に存在せず**、外部プラグインプロジェクトにのみ存在し、DLL にコンパイルされた後メインプログラムが動的に読み込みます。

## メインプログラム内部の階層構造

`src/LetsMeowToolbox.App/` 内部のディレクトリと責務：

| ディレクトリ | 格納内容 |
| --- | --- |
| `Modules/` | 機能モジュール。エリア別に構成：`Beginner/`（初心者エリア 5 モジュール）、`Advanced/`（上級エリア）、`Uninstaller/`（アンインストール）、`Unlock/`（占用解除） |
| `Services/` | グローバルサービス：権限、ログ、構成、設定、テーマ、プラグイン読み込み、多言語（`LocalizationService` / `LanguagePackInstaller`）、更新確認（`UpdateService`）など（次ページで一つずつ紹介） |
| `Localization/` | 組み込みソース言語ファイル `zh-Hans.meowlang`（簡体字中国語、`EmbeddedResource` としてパッケージ） |
| `Utils/` | 低レベルユーティリティ：コマンド実行、レジストリ、プロセス、Win32 ネイティブ機能のラップ |
| `Views/` | 画面：各エリアのページ、ダイアログ（更新履歴、ライセンス契約、Fluent ダイアログ、更新プロンプト、言語管理と言語パックインストール） |
| `Themes/` | テーマリソースディクショナリ：`Brushes.Light.xaml`、`Brushes.Anime.xaml`、`FluentStyles.xaml` |
| `Models/` | ビューモデルとデータモデル（`ObservableObject`、各ページの ViewModel） |
| `Assets/` | アイコン、ロゴ、壁紙、GPL-3.0 ライセンス全文 |

各機能エリアは基本的に「1 つの Module（ロジック）+ 1 つの View（画面）」の組み合わせです。例えばアンインストールは `Modules/Uninstaller/` + `Views/UninstallerView.xaml`。

## csproj の重要ポイントを一つずつ説明

`LetsMeowToolbox.App.csproj` 内で注目すべき設定：

| 設定 | 値 | 説明 |
| --- | --- | --- |
| `TargetFramework` | `net8.0-windows` | .NET 8、Windows デスクトップ |
| `UseWPF` | `true` | WPF アプリ |
| `AssemblyName` | `LetsMeowToolbox` | メインプログラム名は `LetsMeowToolbox.exe` に固定 |
| `Version` | `0.2.0` | v0.1.1 からバージョン番号体系を有効化。更新履歴は `Services/AppInfo.cs` を参照 |
| `ApplicationManifest` | `app.manifest` | アプリケーションマニフェスト |
| `AllowUnsafeBlocks` | `true` | unsafe コードブロックを許可 |
| `PackageReference` | `HandyControl 3.5.1` | 唯一の NuGet 依存。UI コントロールライブラリ |

リソースのパッケージ方法も注目すべき点です：

- **埋め込みリソース**（単一ファイルにパッケージされ、exe と一緒に出力する必要なし）：`logo_banner.png`、`app_icon.png`、`app.ico`。
- **埋め込みリソース**：`gpl-3.0.txt`（初回起動時のライセンス契約ダイアログとバージョン情報ページで使用）。
- **組み込みソース言語**：`Localization/zh-Hans.meowlang`（簡体字中国語、`EmbeddedResource`。外部言語パックが一つもない場合でも正常に表示）。
- **ルーズファイル**（プログラムと共に exe と同じディレクトリに出力され、実行時にディスクから読み込み）：`wallpaper.png`（二次元化壁紙）。
- **外部言語パック**：リポジトリルートの `lang/**/*.meowlang` を `None Include` 方式で出力ディレクトリの `lang/` にコピーし、`dotnet publish` 時にも同様に保持（`CopyToPublishDirectory=PreserveNewest`）。
- **任意ディレクトリ**：`assets/` ディレクトリが存在する場合、ディレクトリ全体が出力と一緒にコピーされます。

単一ファイルリリース関連：RID が明示的に指定されておらず `PublishSingleFile` が有効な場合、csproj は `win-x64` をフォールバック。自包含（`SelfContained=true`）時は `IncludeNativeLibrariesForSelfExtract` を有効化。

## Directory.Build.props の内容

リポジトリルートディレクトリの `Directory.Build.props` は全プロジェクトに有効：

- 製品名 `Let's Meow Toolbox`、会社/作者 `Hatasoft-Studio`、著作権 `Copyright (c) 2026 Hatasoft-Studio`。
- `EnableWindowsTargeting=true`：Linux 上での Windows ターゲットプロジェクトのクロスコンパイルを許可。

## バージョン番号ルール（必読）

バージョン番号体系は v0.1.1 から施行、`Services/AppInfo.cs` で定義：**メジャー番号.マイナー番号.リビジョン番号**

- **メジャー番号**：大規模なアーキテクチャ調整 / 破壊的変更時に +1（0.x 段階では全体のリファクタリングを指す）。
- **マイナー番号**：機能追加時に +1。
- **リビジョン番号**：不具合修正 / 最適化時に +1。

ルール：**各リリース時に `AppInfo` の `Version` と `Changelog` を必ず同期更新すること**。プログラム内の「更新履歴を表示」ダイアログはこのデータを読み取るため、更新を忘れるとユーザーには新しい内容が見えません。
