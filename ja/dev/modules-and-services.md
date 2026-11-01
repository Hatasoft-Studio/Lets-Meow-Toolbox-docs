---
title: モジュールとサービスの概要
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

# モジュールとサービスの概要

このページではメインプログラム内の機能モジュール（Modules）、サービス（Services）、ユーティリティクラス（Utils）、テーマ（Themes）を一つずつ紹介し、ソースコードを読む際に「このファイルは何をするものか」を素早く特定できるようにします。

## 機能モジュール（Modules/）

モジュールは機能エリア別に構成され、1 つのモジュールが一組の機能ロジックに対応します：

### Modules/Beginner/ —— 初心者エリア

| ファイル | 担当 |
| --- | --- |
| `OptimizeModule.cs` | 電源 / インデックス / 自動再生 / サムネイルなどの最適化項目 |
| `PrivacyAdsModule.cs` | 広告 / テレメトリ / 通知のおすすめの無効化 |
| `RightClickMenuModule.cs` | Win11 クラシック右クリックメニューの切り替え |
| `TaskbarExplorerModule.cs` | タスクバー / エクスプローラーの微調整 |
| `UwpCleanModule.cs` | 安全な UWP アンインストール（ホワイトリスト） |

### Modules/Advanced/ —— 上級エリア

| ファイル | 担当 |
| --- | --- |
| `WindowsUpdateModule.cs` | Windows Update 一時停止期限 / 無効化 |

### Modules/Uninstaller/ —— プログラムのアンインストール

| ファイル | 担当 |
| --- | --- |
| `UninstallerService.cs` | Win32 ソフトウェアアンインストールのメインロジック |
| `ResidueScanner.cs` | アンインストール後の残留スキャン |
| `ReportWriter.cs` | クリーンアップレポートのエクスポート |

### Modules/Unlock/ —— 占用解除

| ファイル | 担当 |
| --- | --- |
| `UnlockService.cs` | 占用プロセスの検索、終了による解放、起動時遅延削除 |

## サービス（Services/）

サービスはグローバルに通じるシングルトン機能で、ファイル名から責務が対応できます：

| ファイル | 一言での責務 |
| --- | --- |
| `AdminService.cs` | 管理者権限関連の処理 |
| `AppInfo.cs` | バージョン番号、リポジトリアドレス、内蔵更新履歴（`Changelog`）。リリース時に必ず変更 |
| `BackupService.cs` | バックアップ機能 |
| `ConfigService.cs` | 構成の読み書き |
| `FeatureHost.cs` | 機能ホスト：各機能項目の実行エントリーポイントを保持 |
| `FluentToast.cs` | Fluent スタイルの通知トースト |
| `LogService.cs` | グローバルログ（INFO / WARN / ERROR）、`%LocalAppData%\LetsMeowToolbox\logs` に書き込み |
| `OsVersionService.cs` | システムバージョン検出（Win10 / Win11 の差異処理で使用） |
| `PluginLoader.cs` | 高リスクプラグインローダー：`plugins/` ディレクトリ内のプラグイン DLL をスキャンして動的に読み込み |
| `SettingsService.cs` | 設定項目の管理 |
| `ThemeService.cs` | テーマ切り替え（ライト / 二次元モードなど） |
| `Ui.cs` | 画面操作のラップ（ダイアログ、エラー表示など） |

## ユーティリティクラス（Utils/）

低レベル機能のラップで、基本的に「地道で骨の折れる仕事」の集約地です：

| ファイル | 一言での責務 |
| --- | --- |
| `CmdRunner.cs` | cmd コマンドの実行 |
| `PowerShellRunner.cs` | PowerShell コマンドの実行 |
| `NativeMethods.cs` | Win32 ネイティブ API の P/Invoke 宣言 |
| `RestartManager.cs` | RestartManager API のラップ（「誰がファイルを占用しているか」の調査に使用） |
| `PendingFileOps.cs` | 再起動後の遅延ファイル操作（起動時遅延削除の内部実装、MoveFileEx メカニズムに基づく） |
| `ProcessUtil.cs` | プロセス関連操作 |
| `RegistryUtil.cs` | レジストリ読み書きのラップ |
| `UwpWhitelist.cs` | UWP アンインストールホワイトリスト（システムコンポーネントの誤削除を防止） |
| `WindowBackdrop.cs` | ウィンドウ背景マテリアル（Win11 マテリアル / 単色フォールバック） |

## テーマ（Themes/）

| ファイル | 説明 |
| --- | --- |
| `Brushes.Light.xaml` | ライトテーマブラシ |
| `Brushes.Anime.xaml` | 二次元モードブラシ（v0.1.1 で可読性を最適化） |
| `FluentStyles.xaml` | Fluent スタイル |

## 画面（Views/）クイックリファレンス

ページとエリアは基本的に一対一で対応：`BeginnerView`（初心者エリア）、`AdvancedView`（上級エリア）、`UninstallerView` + `UninstallerPanel`（プログラムのアンインストール）、`UnlockView` + `UnlockPanel`（占用解除）、`HighRiskView`（高リスクプラグインエリア）、`SettingsView`（設定）、`CreditsView`（スペシャルサンクス）。ダイアログ系：`ChangelogDialog`（更新履歴）、`LicenseDialog`（初回起動時のライセンス契約）、`FluentDialog`。

<VTDocTip>
ソースコードを読むのにおすすめのルート：まず `Views/` で画面のエントリーを見つける → 対応する `Modules/` に飛んでロジックを確認 → 低レベル操作に出会ったら `Utils/` を確認。サービス層（`Services/`）はどこでも出てくるので、通読する必要はありません。
</VTDocTip>
