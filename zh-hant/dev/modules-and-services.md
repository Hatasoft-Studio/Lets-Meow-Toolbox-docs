---
title: 模組與服務速覽
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

# 模組與服務速覽

這一頁把主程式裡的功能模組（Modules）、服務（Services）、工具類（Utils）和主題（Themes）逐個點名，幫你在讀原始碼時快速定位「這個檔案是幹什麼的」。

## 功能模組（Modules/）

模組按功能分區組織，一個模組對應一組功能邏輯：

### Modules/Beginner/ —— 新手區

| 檔案 | 負責 |
| --- | --- |
| `OptimizeModule.cs` | 電源 / 索引 / 自動播放 / 縮圖等優化項 |
| `PrivacyAdsModule.cs` | 關閉廣告 / 遙測 / 通知推薦 |
| `RightClickMenuModule.cs` | Win11 經典右鍵選單切換 |
| `TaskbarExplorerModule.cs` | 工作列 / 檔案總管微調 |
| `UwpCleanModule.cs` | 安全 UWP 解除安裝（白名單） |

### Modules/Advanced/ —— 進階區

| 檔案 | 負責 |
| --- | --- |
| `WindowsUpdateModule.cs` | Windows 更新暫停期限 / 停用 |

### Modules/Uninstaller/ —— 解除安裝程式

| 檔案 | 負責 |
| --- | --- |
| `UninstallerService.cs` | Win32 軟體解除安裝主邏輯 |
| `ResidueScanner.cs` | 解除安裝後的殘留掃描 |
| `ReportWriter.cs` | 清理報告匯出 |

### Modules/Unlock/ —— 解除佔用

| 檔案 | 負責 |
| --- | --- |
| `UnlockService.cs` | 尋找佔用程序、關閉釋放、開機延遲刪除 |

## 服務（Services/）

服務是貫穿全域的單例能力，按檔名就能對上職責：

| 檔案 | 一句話職責 |
| --- | --- |
| `AdminService.cs` | 管理員權限相關處理 |
| `AppInfo.cs` | 版本號、儲存庫位址與內建更新記錄（`Changelog`），發版時必改 |
| `BackupService.cs` | 備份能力 |
| `ConfigService.cs` | 配置讀寫 |
| `FeatureHost.cs` | 功能宿主：承載各功能項的執行入口 |
| `FluentToast.cs` | Fluent 風格的通知提示 |
| `LanguagePackInstaller.cs` | 語言包讀取校驗、適用版本判斷、版本比較、安裝到 `lang` 目錄與重新啟動程式（v0.2.0） |
| `LocalizationService.cs` | 多語言：掃描 `lang` 目錄、載入 `.meowlang`、按原文翻譯並遍歷可視樹替換文字（v0.2.0） |
| `LogService.cs` | 全域記錄（INFO / WARN / ERROR），寫到 `%LocalAppData%\LetsMeowToolbox\logs` |
| `OsVersionService.cs` | 系統版本偵測（Win10 / Win11 差異處理會用到） |
| `PluginLoader.cs` | 高危外掛載入器：掃描並動態載入 `plugins/` 目錄下的外掛 DLL |
| `SettingsService.cs` | 設定項管理 |
| `ThemeService.cs` | 主題切換（淺色 / 二次元模式等） |
| `Ui.cs` | 介面互動封裝（彈窗、錯誤提示等） |
| `UpdateService.cs` | 更新檢查：請求官方更新介面，返回最新版本、下載位址、停止支援列表與更新說明（v0.2.0） |

## 工具類（Utils/）

底層能力封裝，基本都是「髒活累活」的集中地：

| 檔案 | 一句話職責 |
| --- | --- |
| `CmdRunner.cs` | 執行 cmd 命令 |
| `PowerShellRunner.cs` | 執行 PowerShell 命令 |
| `NativeMethods.cs` | Win32 原生 API 的 P/Invoke 宣告 |
| `RestartManager.cs` | RestartManager API 封裝（查「誰在佔用檔案」用的就是它） |
| `PendingFileOps.cs` | 重新啟動後延遲檔案操作（開機延遲刪除的底層，基於 MoveFileEx 機制） |
| `ProcessUtil.cs` | 程序相關操作 |
| `RegistryUtil.cs` | 登錄讀寫封裝 |
| `UwpWhitelist.cs` | UWP 解除安裝白名單（防止誤刪系統元件） |
| `WindowBackdrop.cs` | 視窗背景材質（Win11 材質 / 純色回退） |

## 主題（Themes/）

| 檔案 | 說明 |
| --- | --- |
| `Brushes.Light.xaml` | 淺色主題畫筆 |
| `Brushes.Anime.xaml` | 二次元模式畫筆（v0.1.1 優化過可讀性） |
| `FluentStyles.xaml` | Fluent 風格樣式 |

## 介面（Views/）速查

頁面與分區基本一一對應：`BeginnerView`（新手區）、`AdvancedView`（進階區）、`UninstallerView` + `UninstallerPanel`（解除安裝程式）、`UnlockView` + `UnlockPanel`（解除佔用）、`HighRiskView`（高危外掛區）、`SettingsView`（設定，含語言與更新卡片）、`CreditsView`（特別鳴謝）。對話方塊類：`ChangelogDialog`（更新記錄）、`LicenseDialog`（首次啟動協議）、`FluentDialog`、`UpdateDialog`（發現新版本 / 停止支援強制更新）、`LanguageManagerDialog`（語言管理）、`LanguagePackDetailsDialog`（語言包詳情）、`LanguageInstallProgressDialog`（安裝進度）。

<VTDocTip>
讀原始碼的推薦路線：先看 `Views/` 找到介面入口 → 跳到對應 `Modules/` 看邏輯 → 遇到底層操作再看 `Utils/`。服務層（`Services/`）在哪裡都會被碰到，不用專門通讀。
</VTDocTip>
