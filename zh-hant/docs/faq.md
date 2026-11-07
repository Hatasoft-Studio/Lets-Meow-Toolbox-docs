---
title: 常見問題
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

# 常見問題

這裡收集了最常遇到的問題。先說一句定心丸：程式內建了**全域例外攔截與記錄**，如果啟動或執行出錯，會彈出錯誤對話方塊並寫入記錄，不會「靜默打不開」讓你摸不著頭腦。

## 程式打不開 / 沒反應

<VTDocAccordionGroup>
  <VTDocAccordion title="雙擊沒反應（最常見）">
    十有八九是你用的是「免安裝精簡版」（framework-dependent），但電腦裡沒裝執行庫。兩個辦法任選：

    1. 安裝 [.NET 8 桌面執行階段](https://dotnet.microsoft.com/download/dotnet/8.0)，注意選「.NET Desktop Runtime 8.x」；
    2. 直接換「免安裝完整版」（self-contained），它自帶執行庫，雙擊即用。
  </VTDocAccordion>
  <VTDocAccordion title="彈出錯誤對話方塊">
    這是程式的兜底機制在作用：出錯會彈出視窗並寫記錄。記下彈窗資訊，然後去記錄目錄看當天的記錄檔，提 Issue 時把記錄內容帶上，作者排查會快很多。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 記錄相關

<VTDocAccordionGroup>
  <VTDocAccordion title="記錄在哪裡">
    `%LocalAppData%\LetsMeowToolbox\logs\meow-日期.log`。檔案總管位址欄貼上 `%LocalAppData%\LetsMeowToolbox\logs` 按 Enter 即可打開目錄。
  </VTDocAccordion>
  <VTDocAccordion title="記錄裡記了什麼">
    自 v0.1.1 起記錄為全域記錄：你的全部設定操作、執行結果與時間，按 INFO / WARN / ERROR 三個級別記錄，不再是空檔案。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 介面相關

<VTDocAccordionGroup>
  <VTDocAccordion title="背景變成純色了">
    非 Win11 系統可能會自動回退為純色背景，這是預期行為，不影響任何功能。
  </VTDocAccordion>
  <VTDocAccordion title="高危外掛區是空的">
    主程式本身不含任何高危代碼。要用高危功能，需要把高危外掛 DLL 放進程式同級的 `plugins` 目錄，詳見[高危外掛區](/zh-hant/docs/high-risk-zone.html)。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 語言與更新（v0.2.0 起）

<VTDocAccordionGroup>
  <VTDocAccordion title="找不到「選擇語言」按鈕">
    語言卡片在「設定」頁最上面。如果 `lang` 目錄裡一個外置語言包都沒有，程式仍然預設使用內嵌的簡體中文；把官方語言包（或第三方 `.meowlang`）放進程式同級的 `lang` 目錄後重新啟動程式，列表裡就會出現。
  </VTDocAccordion>
  <VTDocAccordion title="切換語言後程式自己重新啟動了">
    這是正常設計。點「載入所選語言」並確認後，程式會重新啟動一次，讓所有介面文字按新語言重新翻譯；重新啟動失敗時才會提示錯誤並寫記錄。
  </VTDocAccordion>
  <VTDocAccordion title="語言包裝不上，提示版本不適用">
    語言包裡的 `appVersion` 只允許用在指定版本上，例如 `0.2.0 | 0.2.1` 或 `>=0.2.0`。請換成適配當前版本的語言包，或者升級主程式。具體規則見[設定與關於](/zh-hant/docs/settings.html)。
  </VTDocAccordion>
  <VTDocAccordion title="提示同名語言包作者不一致，無法安裝">
    程式發現 `lang` 目錄裡已有同 ID 的語言包，但作者或作者網站不同，為了防止覆蓋，安裝會被拒絕。到 `lang` 目錄手動刪除舊的 `.meowlang` 檔案，再重新安裝即可。
  </VTDocAccordion>
  <VTDocAccordion title="官方語言包怎麼分辨">
    語言包詳情裡，官方語言包的製作者旁邊會顯示**綠色盾牌標識**；程式判定官方需要同時滿足製作者為 `Hatasoft-Studio`、作者網站為官方站點。第三方語言包安裝時還會額外彈一次確認。
  </VTDocAccordion>
  <VTDocAccordion title="點「檢查更新」顯示檢查失敗">
    檢查更新需要存取官方更新介面，網路不通、被防火牆攔截或介面臨時異常都會失敗。可以稍後重試；失敗不影響程式其他功能。若一直失敗，請到 GitHub 儲存庫提 Issue。
  </VTDocAccordion>
  <VTDocAccordion title="啟動時彈出「此版本已停止支援」">
    說明官方已經把當前版本列入停止支援列表，更新前無法繼續使用。點「前往官網取得新版本」下載最新版；點「結束程式」則直接結束。更新後即可正常使用。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 下載相關

<VTDocAccordionGroup>
  <VTDocAccordion title="下載速度非常慢">
    GitHub 的伺服器在海外，直連慢是正常的。到下載頁把「下載線路」切換為 EZ-Mirror 鏡像即可加速（Pre Release 版本除外，鏡像站不同步預發布版本）。
  </VTDocAccordion>
  <VTDocAccordion title="找不到安裝版（.exe 安裝包）">
    不是每個版本都提供安裝版。例如 v0.1.1 有 installer-version 安裝包，v0.1.2 和 v0.2.0 就暫時沒有。以下載頁列出的實際資源為準；沒有安裝版時，用「免安裝完整版」解壓縮即用，體驗是一樣的。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 還是沒解決？

如果出現了任何問題或 bug，請前往官方 GitHub 儲存庫提 Issue：

- 官方儲存庫：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- 全部歷史版本與更新說明：[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- 提 Issue 前建議先看看[更新記錄](/zh-hant/version.html)，確認你用的是最新版本——有些問題新版已經修掉了。
