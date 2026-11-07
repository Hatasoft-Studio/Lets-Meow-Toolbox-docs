---
title: Let's Meow! Toolbox をダウンロード
description: 二次元モダン UI、初心者にもやさしい Windows 10 / 11 一体型チューニングツールボックス。以下では GitHub から Release と Pre Release の 2 チャンネルの全バージョンを自動取得し、任意のバージョンを選択してダウンロードできます。Release は EZ-Mirror ミラーによる高速化に対応しています。
outline: deep
editLink: false
lastUpdated: false
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

<ReleaseDownloader />

## 更新チャンネル

| チャンネル | 内容 | ダウンロード回線 | 説明 |
| --- | --- | --- | --- |
| Release | 正式リリースバージョン | GitHub / EZ-Mirror ミラー | デフォルトチャンネル。ミラーサイトがこれらのバージョンを同期します |
| Pre Release | プレリリースバージョン | GitHub のみ | ミラーサイトは未同期のため、GitHub からしかダウンロードできません |

ページ上部の「バージョン」ドロップダウンは現在のチャンネルの全過去バージョンを一覧表示し、デフォルトで最新版が選択されますが、より古いバージョン番号を自由に選択してダウンロードすることもできます。対応バージョンの GitHub と EZ-Mirror のリンクはすべて自動生成されます。あるバージョンにインストール版が提供されていない場合、ページはインストール版ボタンを自動的に非表示にし、ポータブルパッケージのみを残します。

## バージョンタイプとサイズ

プログラムは 2 種類の単一ファイルリリースモードを提供し、ダウンロード一覧の「ポータブル軽量版」と「ポータブル完全版」がそれぞれに対応します：

| リリースモード | .NET 8 デスクトップランタイムの要否 | サイズの目安 | 適用シーン |
| --- | --- | --- | --- |
| ランタイム依存（framework-dependent） | 必要 | 約 10~20 MB | マシンに .NET 8 デスクトップランタイムがインストール済み |
| 自包含（self-contained） | 不要 | 約 90~110 MB | まっさらなシステムで、ランタイムを追加インストールしたくない場合 |

どちらのモードも単一ファイルの `LetsMeowToolbox.exe` で、`plugins/`（高リスクプラグイン）と `lang/`（言語パック）ディレクトリが付属し、解凍してすぐ使えます。ページに表示されるファイルサイズは GitHub Release の実際の成果物が基準です。

## インストールと初回起動

<VTDocSteps>
  <VTDocStep title="ダウンロードして解凍">
    上のリストから対応バージョンの zip をダウンロードし、解凍して LetsMeowToolbox.exe、plugins、lang ディレクトリを取得します。
  </VTDocStep>
  <VTDocStep title="必要に応じてランタイムをインストール">
    「ポータブル軽量版」を選ぶ場合は、まず .NET 8 デスクトップランタイム（.NET Desktop Runtime 8.x）をインストールしてください。「ポータブル完全版」はランタイムを内蔵しており、このステップはスキップできます。
  </VTDocStep>
  <VTDocStep title="ダブルクリックで実行">
    LetsMeowToolbox.exe を直接実行します。メインプログラムには高リスクコードは一切含まれておらず、高リスク機能は plugins ディレクトリ内の外部プラグイン DLL によるものです。
  </VTDocStep>
  <VTDocStep title="指示に従って操作を確認">
    全変更・削除・クリーンアップは手動確認が必要で、残留項目と占用項目はデフォルトではチェックされていません。
  </VTDocStep>
</VTDocSteps>

<VTDocTip>
  プログラムはグローバル例外キャッチとログを内蔵しています。起動時にエラーが発生した場合は、<code>%LocalAppData%\LetsMeowToolbox\logs</code> を開いて対応する日付のログファイルを確認できます。
</VTDocTip>

## システム要件とセキュリティ設計

<VTDocCardGroup cols="2">
  <VTDocCard title="システムとアーキテクチャ" icon="gear">
    Windows 10 / 11（x64）のみ対応。技術スタックは WPF · .NET 8（LTS）· C# · HandyControl。
  </VTDocCard>
  <VTDocCard title="セキュリティ設計" icon="shield-halved">
    パッキングなし、難読化なし、自己解凍ロジックなし。内部では Microsoft 純正の Win32 API（RestartManager、MoveFileEx、Registry など）のみを呼び出します。
  </VTDocCard>
  <VTDocCard title="内蔵ブラックリスト" icon="list-check">
    C:\Windows、System32、WinSxS などのシステムコアディレクトリとシステムコアプロセスの強制終了を禁止。
  </VTDocCard>
  <VTDocCard title="オープンソースライセンス" icon="browser">
    プロジェクトは GPL-3.0 ライセンスでオープンソース化。メインプログラムコードと高リスクプラグインは分離されており、自分で審査・ビルド可能です。
  </VTDocCard>
</VTDocCardGroup>

## よくある質問

<VTDocAccordionGroup>
  <VTDocAccordion title="フレームワーク依存版をダブルクリックしても反応がない / 開かない">
    まず .NET 8 デスクトップランタイム（".NET Desktop Runtime 8.x" を選択）をインストールしてください。ランタイムをインストールしたくない場合は、直接自包含（self-contained）バージョンをダウンロードしてください。ランタイムを内蔵しており、ダブルクリックですぐに使えます。
  </VTDocAccordion>
  <VTDocAccordion title="ログはどこにありますか">
    ログは %LocalAppData%\LetsMeowToolbox\logs\meow-日付.log にあります。エクスプローラーのアドレスバーに %LocalAppData%\LetsMeowToolbox\logs を貼り付けて Enter するとディレクトリを開けます。
  </VTDocAccordion>
  <VTDocAccordion title="画面背景が単色になった">
    非 Win11 システムでは自動的に単色背景にフォールバックすることがあります。これは想定された動作で、機能の使用には影響しません。
  </VTDocAccordion>
  <VTDocAccordion title="高リスクプラグインエリアに内容がない">
    メインプログラム本体には高リスクコードは一切含まれておらず、高リスクプラグインの DLL をプログラムと同じ階層の plugins ディレクトリに入れて初めて読み込まれます。
  </VTDocAccordion>
  <VTDocAccordion title="繁体字中国語 / 日本語 / 英語の画面に切り替えたい">
    公式言語パックは v0.2.0 の圧縮パッケージに同梱され、lang ディレクトリに置かれています。「設定」→「言語 / Language」→「言語を選択」を開き、言語を選んで「選択した言語を読み込む」をクリックすると、プログラムが自動的に再起動して反映されます。詳しくは[設定とバージョン情報](/ja/docs/settings.html)をご覧ください。
  </VTDocAccordion>
</VTDocAccordionGroup>

## その他の入手方法

<VTDocCardGroup cols="2">
  <VTDocCard title="GitHub Releases" icon="list-check" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases">
    過去の全バージョンと更新説明を確認でき、任意のインストーラーを手動で選択することもできます。
  </VTDocCard>
  <VTDocCard title="EZ-Mirror ミラーサイト" icon="upload" href="https://mirror.hatasoft365.top">
    EZ-Mirror が提供するダウンロード高速化回線。上の「ダウンロード回線」で切り替え可能。ミラーは当該サイトにリリースされたバージョンのみ同期します。
  </VTDocCard>
  <VTDocCard title="ソースコードリポジトリ" icon="browser" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox">
    リポジトリをクローン後、build ディレクトリ内のリリーススクリプトを使って単一ファイルバージョンを自分でビルドできます。
  </VTDocCard>
  <VTDocCard title=".NET 8 デスクトップランタイム" icon="rocket" href="https://dotnet.microsoft.com/download/dotnet/8.0">
    ランタイム依存バージョンを使用する前に、ここで .NET Desktop Runtime 8.x をダウンロードしてインストールしてください。
  </VTDocCard>
  <VTDocCard title="公式言語パック（External Language Pack）" icon="list-check" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases/tag/v1.1.0-lang">
    繁体字中国語、日本語、英語の言語パックの個別リリースページです。.meowlang をダウンロード後、プログラム内の「言語パックをインストール」で導入できます。メインプログラムの圧縮パッケージと一緒にリリースされる場合は、すでに lang ディレクトリに置かれています。
  </VTDocCard>
</VTDocCardGroup>

<VTDocNote>
  これは Vibe-Coding 作品で、各リリースは作者が実機で検証しています。作者：Hatasoft-Studio。プロジェクトホームページと問題のフィードバックは GitHub リポジトリをご覧ください。
</VTDocNote>
