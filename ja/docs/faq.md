---
title: よくある質問
---

<VTDocWarning>
このページのすべての内容は簡体字中国語版から翻訳されたものです。簡体字中国語版のページを優先してご参照ください。本プロジェクトではまだこの言語の翻訳版を提供していませんが、今後マルチ言語版の公開を予定しています。どうぞご期待ください。
</VTDocWarning>

# よくある質問

ここでは最もよく遭遇する問題を集めました。まず安心材料を一言：プログラムは**グローバル例外キャッチとログ**を内蔵しており、起動や実行中にエラーが発生すると、エラーダイアログを表示してログに記録するため、「黙って開かない」まま頭を悩ませることはありません。

## プログラムが開かない / 反応がない

<VTDocAccordionGroup>
  <VTDocAccordion title="ダブルクリックしても反応がない（最も多い）">
    十中八九、「ポータブル軽量版」（framework-dependent）を使っているのに、パソコンにランタイムがインストールされていないことが原因です。方法は 2 つ、どちらでも構いません：

    1. [.NET 8 デスクトップランタイム](https://dotnet.microsoft.com/download/dotnet/8.0)をインストール。".NET Desktop Runtime 8.x" を選ぶこと。
    2. 直接「ポータブル完全版」（self-contained）に切り替える。ランタイムを内蔵し、ダブルクリックですぐに使えます。
  </VTDocAccordion>
  <VTDocAccordion title="エラーダイアログが表示される">
    これはプログラムのフォールバックメカニズムが動作しています：エラー時にダイアログを表示しログに記録します。ダイアログの内容を控え、ログディレクトリで当日のログファイルを確認し、Issue 提出時にログ内容を添えると、作者の調査がずっと速くなります。
  </VTDocAccordion>
</VTDocAccordionGroup>

## ログ関連

<VTDocAccordionGroup>
  <VTDocAccordion title="ログはどこにありますか">
    `%LocalAppData%\LetsMeowToolbox\logs\meow-日付.log`。エクスプローラーのアドレスバーに `%LocalAppData%\LetsMeowToolbox\logs` を貼り付けて Enter するとディレクトリを開けます。
  </VTDocAccordion>
  <VTDocAccordion title="ログには何が記録されますか">
    v0.1.1 からログはグローバル記録になりました：全設定操作、実行結果、時刻が INFO / WARN / ERROR の 3 レベルで記録され、空ファイルではなくなりました。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 画面関連

<VTDocAccordionGroup>
  <VTDocAccordion title="背景が単色になった">
    非 Win11 システムでは自動的に単色背景にフォールバックすることがあります。これは想定された動作で、機能には一切影響しません。
  </VTDocAccordion>
  <VTDocAccordion title="高リスクプラグインエリアが空">
    メインプログラム自体には高リスクコードは一切含まれていません。高リスク機能を使うには、高リスクプラグインの DLL をプログラムと同じ階層の `plugins` ディレクトリに入れる必要があります。詳しくは[高リスクプラグインエリア](/ja/docs/high-risk-zone.html)をご覧ください。
  </VTDocAccordion>
</VTDocAccordionGroup>

## ダウンロード関連

<VTDocAccordionGroup>
  <VTDocAccordion title="ダウンロード速度が非常に遅い">
    GitHub のサーバーは海外にあるため、直接接続が遅いのは正常です。ダウンロードページで「ダウンロード回線」を EZ-Mirror ミラーに切り替えると高速化できます（Pre Release バージョンを除く。ミラーサイトはプレリリースバージョンを同期しません）。
  </VTDocAccordion>
  <VTDocAccordion title="インストール版（.exe インストーラー）が見つからない">
    すべてのバージョンにインストール版が提供されるわけではありません。例えば v0.1.1 には installer-version インストーラーがありますが、v0.1.2 にはいまのところありません。ダウンロードページに表示される実際のリソースが基準です。インストール版がない場合は、「ポータブル完全版」を解凍すればそのまま使え、体験は同じです。
  </VTDocAccordion>
</VTDocAccordionGroup>

## まだ解決しない場合

問題や bug が発生した場合は、公式 GitHub リポジトリで Issue を提出してください：

- 公式リポジトリ：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- 過去の全バージョンと更新説明：[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- Issue 提出前にまず[更新履歴](/ja/version.html)を確認し、最新バージョンを使っていることを確認することをおすすめします——一部の問題は新しいバージョンで修正済みです。
