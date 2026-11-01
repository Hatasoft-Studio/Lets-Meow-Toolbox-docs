---
title: 下載 Let's Meow! Toolbox
description: 一個二次元現代化 UI、新手友好的 Windows 10 / 11 一體化調優工具箱。下方會自動從 GitHub 拉取 Release 與 Pre Release 兩個通道的全部版本，可選擇任意版本下載；Release 支援 EZ-Mirror 鏡像加速。
outline: deep
editLink: false
lastUpdated: false
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

<ReleaseDownloader />

## 更新通道

| 通道 | 內容 | 下載線路 | 說明 |
| --- | --- | --- | --- |
| Release | 正式發布版本 | GitHub / EZ-Mirror 鏡像 | 預設通道，鏡像站會同步這些版本 |
| Pre Release | 預發布版本 | 僅 GitHub | 鏡像站暫未同步，只能從 GitHub 下載 |

頁面頂部的「版本」下拉會列出當前通道下的全部歷史版本，預設選中最新版，也可以自由選擇更早的版本號下載。對應版本的 GitHub 與 EZ-Mirror 連結都會自動產生；如果某個版本沒有提供安裝版，頁面會自動隱藏安裝版按鈕，只保留免安裝包。

## 版本類型與體積

程式提供兩種單一檔案發布模式，下載列表中的「免安裝精簡版」與「免安裝完整版」分別對應它們：

| 發布模式 | 是否需要 .NET 8 桌面執行階段 | 體積參考 | 適用場景 |
| --- | --- | --- | --- |
| 依賴執行階段（framework-dependent） | 需要 | 約 10~20 MB | 機器上已安裝 .NET 8 桌面執行階段 |
| 自含（self-contained） | 不需要 | 約 90~110 MB | 全新系統，不想再裝執行庫 |

兩種模式都是單一檔案 `LetsMeowToolbox.exe`，並附帶 `plugins/` 目錄，解壓縮即用。頁面中顯示的檔案大小以 GitHub Release 的實際產物為準。

## 安裝與首次執行

<VTDocSteps>
  <VTDocStep title="下載並解壓縮">
    從上方列表下載對應版本的 zip，解壓縮後得到 LetsMeowToolbox.exe 與 plugins 目錄。
  </VTDocStep>
  <VTDocStep title="按需安裝執行階段">
    選擇「免安裝精簡版」時，請先安裝 .NET 8 桌面執行階段（.NET Desktop Runtime 8.x）；「免安裝完整版」自帶執行庫，可跳過這一步。
  </VTDocStep>
  <VTDocStep title="雙擊執行">
    直接執行 LetsMeowToolbox.exe。主程式不含任何高危代碼，高危功能僅來自 plugins 目錄中的外置外掛 DLL。
  </VTDocStep>
  <VTDocStep title="按提示確認操作">
    所有修改、刪除與清理都需要手動確認，殘留與佔用項預設不勾選。
  </VTDocStep>
</VTDocSteps>

<VTDocTip>
  程式內建全域例外攔截與記錄。若啟動出錯，可打開 <code>%LocalAppData%\LetsMeowToolbox\logs</code> 查看對應日期的記錄檔。
</VTDocTip>

## 系統要求與安全設計

<VTDocCardGroup cols="2">
  <VTDocCard title="系統與架構" icon="gear">
    僅支援 Windows 10 / 11（x64）。技術棧為 WPF · .NET 8（LTS）· C# · HandyControl。
  </VTDocCard>
  <VTDocCard title="安全設計" icon="shield-halved">
    不加殼、不混淆、無自解壓邏輯；底層只調用微軟原生 Win32 API（RestartManager、MoveFileEx、Registry 等）。
  </VTDocCard>
  <VTDocCard title="內建黑名單" icon="list-check">
    C:\Windows、System32、WinSxS 等系統核心目錄與系統核心程序禁止強制結束。
  </VTDocCard>
  <VTDocCard title="開源授權" icon="browser">
    項目以 GPL-3.0 授權開源，主程式代碼與高危外掛分離，可自行審閱與建置。
  </VTDocCard>
</VTDocCardGroup>

## 常見問題

<VTDocAccordionGroup>
  <VTDocAccordion title="框架依賴版雙擊沒反應 / 打不開">
    請先安裝 .NET 8 桌面執行階段（選擇「.NET Desktop Runtime 8.x」）。如果不想安裝執行庫，請直接下載自含（self-contained）版本，它自帶執行庫、雙擊即用。
  </VTDocAccordion>
  <VTDocAccordion title="記錄在哪裡">
    記錄位於 %LocalAppData%\LetsMeowToolbox\logs\meow-日期.log。在檔案總管位址欄貼上 %LocalAppData%\LetsMeowToolbox\logs 按 Enter 即可打開目錄。
  </VTDocAccordion>
  <VTDocAccordion title="介面背景變成純色">
    非 Win11 系統可能會自動回退為純色背景，這是預期行為，不影響功能使用。
  </VTDocAccordion>
  <VTDocAccordion title="高危外掛區沒有內容">
    主程式本體不含任何高危代碼，需要將高危外掛 DLL 放入程式同級的 plugins 目錄後才會載入。
  </VTDocAccordion>
</VTDocAccordionGroup>

## 其他取得方式

<VTDocCardGroup cols="2">
  <VTDocCard title="GitHub Releases" icon="list-check" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox/releases">
    查看全部歷史版本與更新說明，也可手動挑選任意安裝包。
  </VTDocCard>
  <VTDocCard title="EZ-Mirror 鏡像站" icon="upload" href="https://mirror.hatasoft365.top">
    由 EZ-Mirror 提供的加速下載線路，可在上方「下載線路」切換；鏡像僅同步已發布到該站的版本。
  </VTDocCard>
  <VTDocCard title="原始碼儲存庫" icon="browser" href="https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox">
    複製儲存庫後使用 build 目錄下的發布腳本自行建置單一檔案版本。
  </VTDocCard>
  <VTDocCard title=".NET 8 桌面執行階段" icon="rocket" href="https://dotnet.microsoft.com/download/dotnet/8.0">
    使用依賴執行階段版本前，請在此下載並安裝 .NET Desktop Runtime 8.x。
  </VTDocCard>
</VTDocCardGroup>

<VTDocNote>
  這是一個 Vibe-Coding 作品，每次發布都會經過作者親測。作者：Hatasoft-Studio；項目主頁與問題回饋見 GitHub 儲存庫。
</VTDocNote>
