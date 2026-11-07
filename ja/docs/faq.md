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

## 言語と更新（v0.2.0 から）

<VTDocAccordionGroup>
  <VTDocAccordion title="「言語を選択」ボタンが見つからない">
    言語カードは「設定」ページの一番上にあります。`lang` ディレクトリに外部言語パックが一つもない場合でも、プログラムはデフォルトで組み込みの簡体字中国語を使用します。公式言語パック（またはサードパーティの `.meowlang`）をプログラムと同じ階層の `lang` ディレクトリに入れてプログラムを再起動すると、リストに表示されます。
  </VTDocAccordion>
  <VTDocAccordion title="言語を切り替えたらプログラムが自動で再起動した">
    これは正常な設計です。「選択した言語を読み込む」をクリックして確認すると、プログラムが 1 回再起動し、すべての画面テキストが新しい言語で翻訳し直されます。再起動に失敗した場合のみエラーを表示してログに書き込みます。
  </VTDocAccordion>
  <VTDocAccordion title="言語パックをインストールできない、バージョンが適用外と表示される">
    言語パック内の `appVersion` は指定されたバージョンでのみ使用が許可されます。例えば `0.2.0 | 0.2.1` や `>=0.2.0` です。現在のバージョンに適合する言語パックに変更するか、メインプログラムをアップグレードしてください。具体的なルールは[設定とバージョン情報](/ja/docs/settings.html)をご覧ください。
  </VTDocAccordion>
  <VTDocAccordion title="同名言語パックの作者が一致せず、インストールできない">
    プログラムは `lang` ディレクトリに同じ ID の言語パックが既にあることを検出しましたが、作者または作者サイトが異なるため、上書きを防ぐためにインストールが拒否されました。`lang` ディレクトリで古い `.meowlang` ファイルを手動で削除してから、再度インストールしてください。
  </VTDocAccordion>
  <VTDocAccordion title="公式言語パックの見分け方">
    言語パックの詳細では、公式言語パックの制作者の横に**緑色の盾アイコン**が表示されます。プログラムが公式と判定するには、制作者が `Hatasoft-Studio` で、作者サイトが公式サイトであることの両方を満たす必要があります。サードパーティ言語パックのインストール時には追加で確認が 1 回表示されます。
  </VTDocAccordion>
  <VTDocAccordion title="「更新を確認」をクリックすると確認失敗と表示される">
    更新の確認には公式更新インターフェースへのアクセスが必要で、ネットワークが通じない、ファイアウォールにブロックされる、インターフェースが一時的に異常などの場合に失敗します。後で再試行できます。失敗してもプログラムの他の機能には影響しません。ずっと失敗する場合は GitHub リポジトリで Issue を提出してください。
  </VTDocAccordion>
  <VTDocAccordion title="起動時に「このバージョンはサポートを終了しました」が表示される">
    公式が現在のバージョンをサポート終了リストに追加したことを意味し、更新するまで使用を続けられません。「公式サイトで新バージョンを入手」をクリックして最新版をダウンロードしてください。「プログラムを終了」をクリックすると直接終了します。更新後は正常に使用できます。
  </VTDocAccordion>
</VTDocAccordionGroup>

## ダウンロード関連

<VTDocAccordionGroup>
  <VTDocAccordion title="ダウンロード速度が非常に遅い">
    GitHub のサーバーは海外にあるため、直接接続が遅いのは正常です。ダウンロードページで「ダウンロード回線」を EZ-Mirror ミラーに切り替えると高速化できます（Pre Release バージョンを除く。ミラーサイトはプレリリースバージョンを同期しません）。
  </VTDocAccordion>
  <VTDocAccordion title="インストール版（.exe インストーラー）が見つからない">
    すべてのバージョンにインストール版が提供されるわけではありません。例えば v0.1.1 には installer-version インストーラーがありますが、v0.1.2 と v0.2.0 にはいまのところありません。ダウンロードページに表示される実際のリソースが基準です。インストール版がない場合は、「ポータブル完全版」を解凍すればそのまま使え、体験は同じです。
  </VTDocAccordion>
</VTDocAccordionGroup>

## まだ解決しない場合

問題や bug が発生した場合は、公式 GitHub リポジトリで Issue を提出してください：

- 公式リポジトリ：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- 過去の全バージョンと更新説明：[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- Issue 提出前にまず[更新履歴](/ja/version.html)を確認し、最新バージョンを使っていることを確認することをおすすめします——一部の問題は新しいバージョンで修正済みです。
