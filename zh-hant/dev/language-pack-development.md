---
title: 語言包開發
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

# 語言包開發

這一頁講 v0.2.0 引入的外置語言包機制：`.meowlang` 檔案長什麼樣、程式怎麼校驗與安裝、怎麼自己做一個語言包，以及設定頁「檢查更新」背後的介面。

## 語言體系怎麼組織的

主程式的多語言由兩層組成：

| 層 | 位置 | 說明 |
| --- | --- | --- |
| 內嵌源語言 | `src/LetsMeowToolbox.App/Localization/zh-Hans.meowlang` | 以 `EmbeddedResource` 打進主程式，簡體中文永遠可用，不依賴任何外置檔案 |
| 外置語言包 | 程式目錄下的 `lang/*.meowlang` | 儲存庫根目錄 `lang/` 裡的官方語言包（`zh-Hant`、`ja`、`en`），建置時由 csproj 複製到輸出目錄，啟動時自動掃描 |

相關實現集中在三個檔案：

- `Services/LocalizationService.cs`：語言包模型 `LanguagePack`、掃描 `lang` 目錄、按原文翻譯、遍歷可視樹替換介面文字；
- `Services/LanguagePackInstaller.cs`：語言包讀取校驗、適用版本判斷、版本比較、複製安裝、重新啟動程式；
- `Views/LanguageManagerDialog.xaml(.cs)`、`LanguagePackDetailsDialog`、`LanguageInstallProgressDialog`：選擇語言、查看詳情、安裝進度三個視窗。

簡體中文是**源語言**，其他語言包裡的 `strings` 都是「簡體中文原文 → 目標語言譯文」的映射，所以新增語言不需要改任何 C# 代碼。

## .meowlang 檔案格式

語言包本質上是一個 UTF-8 編碼的 JSON 文字檔。一個最小的例子：

```json
{
  "id": "xx",
  "name": "示例语言",
  "author": "YourName",
  "authorWebsite": "https://example.com",
  "version": "1.0.0",
  "source": "zh-Hans",
  "languageType": "示例语言",
  "appVersion": ">=0.2.0",
  "description": "这是一个示例语言包。",
  "strings": {
    "设置": "Settings",
    "检查更新": "Check for updates"
  }
}
```

欄位說明：

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `id` | ✅ | 語言包唯一標識，也決定安裝後的檔案名（`<id>.meowlang`）。不能是 `zh-Hans`，那是內嵌源語言 |
| `name` | ✅ | 顯示名稱，例如 `繁體中文`、`日本語` |
| `author` | ✅ | 製作者，官方包固定為 `Hatasoft-Studio` |
| `authorWebsite` | — | 作者官網，和 `author` 一起決定是否為官方語言包 |
| `version` | ✅ | 語言包自身版本號，用於同名包更新/降級比較 |
| `source` | — | 源語言，預設 `zh-Hans` |
| `languageType` | — | 語言類型文案，例如「英語」「繁體中文」 |
| `appVersion` | — | 適用的主程式版本範圍，預設 `*` |
| `description` | — | 簡介，展示在詳情視窗 |
| `strings` | ✅ | 原文 → 譯文字典，不能為空 |

<VTDocTip>
`strings` 的鍵必須和介面上的簡體中文原文**完全一致**（包括標點與空格）。程式按原文精確匹配，找不到譯文時原樣顯示簡體中文，不會報錯。多行文字會按行分別查表：空行直接跳過，不含中文字元的行（品牌名、數字、純英文）原樣保留。
</VTDocTip>

## 適用版本（appVersion）規則

判斷邏輯在 `LanguagePackInstaller.CheckCompatible`，最終委託給 `MatchesRange`：

- 留空或 `*`：任何版本都適用；
- 可以用 `|` 分隔多段，任意一段匹配即通過，例如 `0.2.0 | 0.2.1 | 0.2.2`；
- 單段支援 `>=`、`<=`、`>`、`<`、`=`、`==` 前綴，也支援直接寫版本號（等價於 `==`）；
- 同一段裡可以用空格或逗號寫多個條件，需要**全部滿足**；
- 無法解析的條件會被忽略，避免誤殺。

版本比較由 `LanguagePackInstaller.CompareVersion` 完成：解析版本號時去掉開頭的 `v`/`V`，按 `.` 分段取整數，非數字部分直接截斷（所以 `v1.1.0-lang` 會按 `1.1.0` 比較）。

## 官方語言包怎麼判定

`LanguagePackRules.IsOfficial` 要求**作者與作者網站同時匹配**：

- `author` 等於 `Hatasoft-Studio`（不區分大小寫，去除首尾空格）；
- `authorWebsite` 等於 `https://hatasoft365.top` 或 `https://lets-meow-toolbox.hatasoft365.top`（同樣忽略大小寫，末尾斜線會被去掉）。

只有同時滿足才會在詳情視窗顯示綠色盾牌，並跳過第三方確認。

## 安裝流程（代碼層面）

設定頁「安裝語言包」最終呼叫 `LanguageManagerDialog.InstallInteractive`，順序如下：

1. `LanguagePackInstaller.ReadFile` 讀取檔案並校驗必填欄位（`id`、`name`、`author`、`version`、`strings`）；
2. 拒絕 `id == zh-Hans`（簡體中文已內嵌）；
3. `CheckCompatible` 校驗版本範圍，不通過就彈錯誤並寫 WARN 記錄；
4. 若 `lang` 目錄已存在同 `id` 的包：
   - 用 `SameIdentity` 比較 `author` 與 `authorWebsite`（忽略大小寫、忽略末尾 `/`），不一致則拒絕覆蓋並提示手動刪除舊包；
   - 用 `CompareVersion` 判斷這次是「更新」「降級」還是「重新安裝」，二次確認；
5. `LanguagePackDetailsDialog` 展示詳情（安裝時間取當前時間，檔案大小取來源檔案長度）；
6. 非官方語言包額外彈一次第三方確認；
7. `LanguageInstallProgressDialog` 執行安裝：`LanguagePackInstaller.Install` 先複製到 `.tmp`，再替換目標檔案，並把檔案修改時間設為當前時間（詳情裡的「安裝時間」就是讀這個）；
8. 成功後呼叫 `LocalizationService.Refresh()` 重新掃描目錄，並提示「語言包安裝成功！」；失敗則顯示原因與 `LogService.Instance.LogFilePath`。

<VTDocWarning>
安裝只是一個檔案複製到 `lang` 目錄的過程，**不會執行語言包裡的任何代碼**。但語言包會替換介面文案，第三方語言包仍然建議先檢查 JSON 內容再安裝。
</VTDocWarning>

## 切換語言與重新啟動

「載入所選語言」的執行順序：

1. `CheckCompatible` 再次校驗；
2. 如果已經是當前語言，直接提示無需重新載入；
3. 彈出詳情視窗確認；
4. `LocalizationService.SetLanguage(id)` 寫入 `SettingsService.Language`，並觸發 `LanguageChanged` 事件；
5. `LanguagePackInstaller.RestartApp` 啟動新程序並 `Application.Current.Shutdown()`。

程式啟動時 `LocalizationService.Initialize()` 會載入內嵌簡體中文、掃描 `lang` 目錄，再按設定裡儲存的語言 ID 恢復上次選擇；如果指定的包不存在，會回退到簡體中文並把設定改回去。

## 介面翻譯的實現方式

`LocalizationService` 不是給每個控制項綁定資源，而是**遍歷可視樹替換靜態文字**：

- `LocalizeElement` 處理 `TextBlock.Text`（包括 `Run`）、`ContentControl.Content`、`HeaderedContentControl.Header`、`Window.Title`、`FrameworkElement.ToolTip`；
- 忽略帶資料綁定的屬性（`BindingOperations.GetBindingExpressionBase` 不為空就跳過），避免破壞 MVVM 綁定；
- 用 `ConditionalWeakTable` 記錄每個控制項未翻譯前的原文，切換語言時基於原文重新翻譯，所以反覆切換不會出現「譯文套譯文」；
- `ApplyToDeferred` 在 `DispatcherPriority.Loaded` 時再翻譯，等模板與列表項實例化完成；視窗級 `Loaded` 事件透過 `EventManager.RegisterClassHandler` 統一掛接，子頁面/彈窗需要主動呼叫。

這也是為什麼切換語言必須重新啟動：執行中新增的控制項、動態產生的文字不一定能即時刷新，重新啟動最穩。

## 建置時語言包怎麼進產物

`LetsMeowToolbox.App.csproj` 裡有兩段關鍵配置：

```xml
<!-- 内嵌语言：简体中文（源语言）随程序打包，无需外置语言包 -->
<ItemGroup>
  <EmbeddedResource Include="Localization\zh-Hans.meowlang" />
</ItemGroup>

<!-- 外置语言包：随程序输出到 lang 目录，启动时自动扫描 -->
<ItemGroup>
  <None Include="..\..\lang\**\*.meowlang"
        Link="lang\%(RecursiveDir)%(Filename)%(Extension)"
        CopyToOutputDirectory="PreserveNewest"
        CopyToPublishDirectory="PreserveNewest" />
</ItemGroup>
```

所以偵錯（F5）和 `dotnet publish` 之後，產物目錄裡都會自動出現 `lang/`，不需要手動複製。

## 自己做一個語言包

1. 複製官方的 `lang/en.meowlang`（或 `ja.meowlang`）作為模板；
2. 改 `id`、`name`、`author`、`authorWebsite`、`version`、`languageType`、`description`；
3. `appVersion` 按當前主程式版本填寫，例如 `>=0.2.0` 或 `0.2.0 | 0.2.1`；
4. 在 `strings` 裡逐條填譯文，鍵保持簡體中文原文不變；
5. 儲存為 UTF-8 JSON，檔案名建議與 `id` 一致；
6. 打開程式「設定」→「安裝語言包」選這個檔案，確認詳情後安裝，再到「選擇語言」載入。

<VTDocTip>
偵錯時也可以直接把 `.meowlang` 丟進程式目錄的 `lang` 資料夾，重新啟動程式就會出現在語言管理視窗裡——安裝按鈕只是把這一步做得更規範（校驗、確認、記錄安裝時間）。
</VTDocTip>

## 設定頁「檢查更新」介面

`Services/UpdateService.cs` 請求固定位址：

```text
https://api.lets-meow-toolbox.hatasoft365.top/
```

請求頭帶 `User-Agent: LetsMeowToolbox/<當前版本>` 與 `Accept: application/json`，逾時 10 秒。返回 JSON 映射到 `UpdateInfo`：

| 欄位 | 說明 |
| --- | --- |
| `latestVersion` | 最新版本號，必填；為空視為介面數據無效 |
| `downloadUrl` | 官網下載位址；為空時回退 `https://lets-meow-toolbox.hatasoft365.top` |
| `unsupportedVersions` | 已停止支援的版本號陣列；包含當前版本時啟動即強制更新 |
| `changelog` | 更新說明文字，展示在更新彈窗裡 |

判斷邏輯：

- `HasUpdate`：`CompareVersion(latestVersion, AppInfo.Version) > 0`；
- `Unsupported`：`unsupportedVersions` 中任一項與當前版本比較結果相等。

`Views/UpdateDialog` 有兩種模式：

- **普通模式**：顯示當前版本、最新版本、下載位址與更新內容，按鈕為「前往官網取得新版本」/「稍後再說」；
- **強制模式**（`Unsupported`）：標題變為「此版本已停止支援」，按鈕為「前往官網取得新版本」/「結束程式」，關閉視窗後程式結束。

<VTDocNote>
更新介面的位址寫死在 `UpdateService.Endpoint` 常數裡，`SettingsView` 與啟動檢測都使用同一個服務。修改介面位址時記得同步檢查這兩個呼叫點。
</VTDocNote>
