---
title: 項目結構詳解
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

# 項目結構詳解

這一頁把儲存庫從外到內拆一遍：方案裡有哪幾個專案、主程式內部怎麼分層、專案檔案裡有哪些關鍵配置。

## 儲存庫頂層

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

## 三個專案各幹什麼

| 專案 | 類型 | 職責 |
| --- | --- | --- |
| `LetsMeowToolbox.App` | WPF 應用（WinExe） | 主程式，產物 `LetsMeowToolbox.exe`，引用 PluginAbstractions |
| `LetsMeowToolbox.PluginAbstractions` | 類別庫 | 高危外掛的對外契約：介面與元數據。主程式和外掛都只認這套契約 |
| `LetsMeowToolbox.Plugins.HighRisk` | 類別庫（外置 DLL） | 官方高危外掛：關閉 Defender / 關閉防火牆 / 移除 Edge·WebView2 |

這個拆法是整個項目安全設計的核心：**高危代碼物理上不在主程式裡**，只存在於外置外掛專案中，編譯成 DLL 後由主程式動態載入。

## 主程式內部分層

`src/LetsMeowToolbox.App/` 內部目錄與職責：

| 目錄 | 放什麼 |
| --- | --- |
| `Modules/` | 功能模組，按分區組織：`Beginner/`（新手區 5 個模組）、`Advanced/`（進階區）、`Uninstaller/`（解除安裝）、`Unlock/`（解除佔用） |
| `Services/` | 全域服務：權限、記錄、配置、設定、主題、外掛載入、多語言（`LocalizationService` / `LanguagePackInstaller`）、更新檢查（`UpdateService`）等（下一頁逐個點名） |
| `Localization/` | 內嵌的源語言檔案 `zh-Hans.meowlang`（簡體中文，作為 `EmbeddedResource` 打包） |
| `Utils/` | 底層工具：命令執行、登錄、程序、Win32 原生能力封裝 |
| `Views/` | 介面：各分區頁面、對話方塊（更新記錄、協議、Fluent 對話方塊、更新提示、語言管理與語言包安裝） |
| `Themes/` | 主題資源字典：`Brushes.Light.xaml`、`Brushes.Anime.xaml`、`FluentStyles.xaml` |
| `Models/` | 視圖模型與數據模型（`ObservableObject`、各頁面的 ViewModel） |
| `Assets/` | 圖示、logo、桌布、GPL-3.0 協議全文 |

每個功能分區基本都是「一個 Module（邏輯）+ 一個 View（介面）」的組合，比如解除安裝是 `Modules/Uninstaller/` + `Views/UninstallerView.xaml`。

## csproj 關鍵點逐條說

`LetsMeowToolbox.App.csproj` 裡值得注意的配置：

| 配置 | 值 | 說明 |
| --- | --- | --- |
| `TargetFramework` | `net8.0-windows` | .NET 8，Windows 桌面 |
| `UseWPF` | `true` | WPF 應用 |
| `AssemblyName` | `LetsMeowToolbox` | 主程式名固定為 `LetsMeowToolbox.exe` |
| `Version` | `0.2.0` | v0.1.1 起啟用版本號體系，更新記錄見 `Services/AppInfo.cs` |
| `ApplicationManifest` | `app.manifest` | 應用程式資訊清單 |
| `AllowUnsafeBlocks` | `true` | 允許 unsafe 代碼塊 |
| `PackageReference` | `HandyControl 3.5.1` | 唯一的 NuGet 依賴，UI 控制項庫 |

資源打包方式也值得留意：

- **嵌入資源**（打包進單一檔案，不需要隨 exe 輸出）：`logo_banner.png`、`app_icon.png`、`app.ico`；
- **嵌入資源**：`gpl-3.0.txt`（首次啟動協議彈窗與關於頁使用）；
- **內嵌源語言**：`Localization/zh-Hans.meowlang`（簡體中文，`EmbeddedResource`，即使沒有任何外置語言包也能正常顯示）；
- **鬆檔案**（隨程式輸出到 exe 同目錄，執行時從磁碟載入）：`wallpaper.png`（二次元化桌布）；
- **外置語言包**：儲存庫根目錄 `lang/**/*.meowlang` 以 `None Include` 方式複製到輸出目錄的 `lang/`，`dotnet publish` 時同樣保留（`CopyToPublishDirectory=PreserveNewest`）；
- **可選目錄**：存在 `assets/` 目錄時，整個目錄隨輸出複製。

單一檔案發布相關：未顯式指定 RID 且開啟了 `PublishSingleFile` 時，csproj 兜底 `win-x64`；自含（`SelfContained=true`）時開啟 `IncludeNativeLibrariesForSelfExtract`。

## Directory.Build.props 說了什麼

儲存庫根目錄的 `Directory.Build.props` 對全部專案生效：

- 產品名 `Let's Meow Toolbox`、公司/作者 `Hatasoft-Studio`、版權 `Copyright (c) 2026 Hatasoft-Studio`；
- `EnableWindowsTargeting=true`：允許在 Linux 上交叉編譯 Windows 目標項目。

## 版本號規則（必讀）

版本號體系自 v0.1.1 起執行，定義在 `Services/AppInfo.cs`：**主版本號.次版本號.修訂號**

- **主版本號**：重大架構調整 / 破壞性變更時 +1（0.x 階段指整體重構）；
- **次版本號**：新增功能時 +1；
- **修訂號**：修復缺陷 / 優化時 +1。

規矩：**每次發布時必須在 `AppInfo` 同步更新 `Version` 與 `Changelog`**。程式內的「查看更新記錄」彈窗讀的就是這份數據，忘了更新使用者就看不到新內容。
