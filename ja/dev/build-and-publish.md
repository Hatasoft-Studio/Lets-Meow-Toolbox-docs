---
title: ビルドとリリース
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

# ビルドとリリース

このページではソースコードから実行可能な `LetsMeowToolbox.exe` を作る方法を説明します：環境に何を入れるか、デバッグの動かし方、2 種類の単一ファイルリリースモードの作り方。

## 環境準備

| 必要なもの | 説明 |
| --- | --- |
| Visual Studio 2022 Community | インストール時に「.NET デスクトップ開発」ワークロードにチェック |
| .NET 8 SDK | ターゲットフレームワークは `net8.0-windows` |
| NuGet パッケージ | 初回ビルド時に自動復元。主な依存は HandyControl 3.5.1 |

リポジトリルートディレクトリの `Directory.Build.props` で `EnableWindowsTargeting=true` が設定されているため、この Windows ターゲットプロジェクトの **Linux 上でのクロスコンパイルも可能**です（`dotnet` CLI で可、VS は必須ではありません）。

## コードを取得して動かす（デバッグ）

```bash
git clone https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox.git
```

その後 VS で `LetsMeowToolbox.sln` を開き、F5 で `LetsMeowToolbox.App` を実行するだけです。

1 つのディテール：ビルド時に**高リスクプラグインは自動的に**メインプログラム出力ディレクトリの `plugins` フォルダに**コピーされる**ため、デバッグ状態では高リスクプラグインエリアが直接使え、DLL を手動で移動する必要はありません。同様に、リポジトリルートの `lang/**/*.meowlang` も出力ディレクトリの `lang/` に自動コピーされ、デバッグ時に言語管理ウィンドウで公式言語パックを直接確認できます。

## 単一ファイルリリース：2 種類のモード

プログラムが外部にリリースするのは**単一ファイル**の `LetsMeowToolbox.exe` + `plugins/` + `lang/` ディレクトリで、2 種類のモードがあります。リポジトリの `build/` ディレクトリにはそれぞれ PowerShell スクリプトがあり、フローはどちらも 3 ステップです：

1. 古い成果物をクリーン。
2. `dotnet publish` でメインプログラムをリリース（単一ファイル。`lang/` 言語パックは csproj が成果物に自動コピー）。
3. 高リスクプラグインをビルドし、`LetsMeowToolbox.Plugins.HighRisk.dll` を成果物ディレクトリの `plugins/` にコピー。

### モード一：ランタイム依存（小）

ターゲットマシンは .NET 8 デスクトップランタイムの事前インストールが必要で、成果物は約 10~20 MB：

```powershell
./build/publish-framework-dependent.ps1
# 产物：dist/framework-dependent/LetsMeowToolbox.exe + plugins/ + lang/
```

スクリプト内部で実際に実行されるコマンド：

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained false -o dist/framework-dependent
```

### モード二：自包含（大）

ランタイムをすべてパッケージに含み、ターゲットマシンは何もインストール不要で、成果物は約 90~110 MB：

```powershell
./build/publish-self-contained.ps1
# 产物：dist/self-contained/LetsMeowToolbox.exe + plugins/ + lang/
```

スクリプト内部で実際に実行されるコマンド：

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o dist/self-contained
```

スクリプトを使いたくない場合は、上記 2 つの `dotnet publish` を手動で実行し、自分で `src/LetsMeowToolbox.Plugins.HighRisk/bin/Release/net8.0-windows/LetsMeowToolbox.Plugins.HighRisk.dll` を成果物ディレクトリの `plugins/` にコピーしても、効果は同じです。

## 成果物対照表

| モード | 成果物ディレクトリ | ターゲットマシンの要件 | サイズの目安 |
| --- | --- | --- | --- |
| ランタイム依存 | `dist/framework-dependent/` | .NET 8 デスクトップランタイムのインストールが必要 | 約 10~20 MB |
| 自包含 | `dist/self-contained/` | .NET のインストール不要 | 約 90~110 MB |

## はまりやすいポイント

<VTDocTip>
- **メインプログラム名は固定**：`LetsMeowToolbox.exe`。csproj 内の `AssemblyName=LetsMeowToolbox` で決まっており、別の名前には変更できません。
- **RID のフォールバック**：単一ファイルリリース時にコマンドラインで RID が指定されていない場合、csproj が `win-x64` をフォールバックで指定します。
- **自包含モード**では `IncludeNativeLibrariesForSelfExtract` も同時に有効になり、ネイティブライブラリも単一ファイルにまとめられます。
- **バージョン番号**は `LetsMeowToolbox.App.csproj` の `Version` プロパティで管理（現在 0.2.0）。新バージョンのリリース時には `Services/AppInfo.cs` 内の `Version` と `Changelog` の同期更新を忘れないでください。
</VTDocTip>
