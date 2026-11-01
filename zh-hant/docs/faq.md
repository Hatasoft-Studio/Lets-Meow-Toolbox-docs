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

## 下載相關

<VTDocAccordionGroup>
  <VTDocAccordion title="下載速度非常慢">
    GitHub 的伺服器在海外，直連慢是正常的。到下載頁把「下載線路」切換為 EZ-Mirror 鏡像即可加速（Pre Release 版本除外，鏡像站不同步預發布版本）。
  </VTDocAccordion>
  <VTDocAccordion title="找不到安裝版（.exe 安裝包）">
    不是每個版本都提供安裝版。例如 v0.1.1 有 installer-version 安裝包，v0.1.2 就暫時沒有。以下載頁列出的實際資源為準；沒有安裝版時，用「免安裝完整版」解壓縮即用，體驗是一樣的。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 還是沒解決？

如果出現了任何問題或 bug，請前往官方 GitHub 儲存庫提 Issue：

- 官方儲存庫：<https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox>
- 全部歷史版本與更新說明：[GitHub Releases](https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases)
- 提 Issue 前建議先看看[更新記錄](/zh-hant/version.html)，確認你用的是最新版本——有些問題新版已經修掉了。
