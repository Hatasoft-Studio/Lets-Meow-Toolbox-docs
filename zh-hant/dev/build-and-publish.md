---
title: 建置與發布
---

<VTDocWarning>
頁面所有內容均翻譯自簡體中文版，請優先參考簡體中文版頁面。本項目尚未提供該語言的翻譯版本，預計未來會上線多語言版本，敬請期待。
</VTDocWarning>

# 建置與發布

這一頁講怎麼把原始碼變成能跑的 `LetsMeowToolbox.exe`：環境要裝什麼、偵錯怎麼跑、兩種單一檔案發布模式怎麼打。

## 環境準備

| 要裝的東西 | 說明 |
| --- | --- |
| Visual Studio 2022 Community | 安裝時勾選「.NET 桌面開發」工作負載 |
| .NET 8 SDK | 目標框架是 `net8.0-windows` |
| NuGet 包 | 首次建置自動還原，主要依賴是 HandyControl 3.5.1 |

儲存庫根目錄的 `Directory.Build.props` 裡設定了 `EnableWindowsTargeting=true`，所以也**允許在 Linux 上交叉編譯**這個 Windows 目標項目（用 `dotnet` CLI 即可，不強制 VS）。

## 拿到代碼並跑起來（偵錯）

```bash
git clone https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox.git
```

然後在 VS 裡打開 `LetsMeowToolbox.sln`，F5 執行 `LetsMeowToolbox.App` 就行。

有一個細節：建置時**高危外掛會自動複製**到主程式輸出目錄的 `plugins` 資料夾，所以偵錯狀態下高危外掛區是直接可用的，不需要你手動搬 DLL。

## 單一檔案發布：兩種模式

程式對外發布的是**單一檔案** `LetsMeowToolbox.exe` + `plugins/` 目錄，分兩種模式。儲存庫 `build/` 目錄下各有一個 PowerShell 腳本，流程都是三步：

1. 清理舊產物；
2. `dotnet publish` 發布主程式（單一檔案）；
3. 建置高危外掛，並把 `LetsMeowToolbox.Plugins.HighRisk.dll` 複製到產物目錄的 `plugins/`。

### 模式一：依賴執行階段（小）

目標機需要先裝好 .NET 8 桌面執行階段，產物約 10~20 MB：

```powershell
./build/publish-framework-dependent.ps1
# 产物：dist/framework-dependent/LetsMeowToolbox.exe + plugins/
```

腳本內部實際執行的命令：

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained false -o dist/framework-dependent
```

### 模式二：自含（大）

執行庫全部打包進去，目標機什麼都不用裝，產物約 90~110 MB：

```powershell
./build/publish-self-contained.ps1
# 产物：dist/self-contained/LetsMeowToolbox.exe + plugins/
```

腳本內部實際執行的命令：

```powershell
dotnet publish src/LetsMeowToolbox.App/LetsMeowToolbox.App.csproj `
    -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o dist/self-contained
```

不想用腳本的話，手動執行上面兩條 `dotnet publish`，再自己把 `src/LetsMeowToolbox.Plugins.HighRisk/bin/Release/net8.0-windows/LetsMeowToolbox.Plugins.HighRisk.dll` 複製到產物目錄的 `plugins/` 裡，效果一樣。

## 產物對照表

| 模式 | 產物目錄 | 目標機要求 | 體積參考 |
| --- | --- | --- | --- |
| 依賴執行階段 | `dist/framework-dependent/` | 需安裝 .NET 8 桌面執行階段 | 約 10~20 MB |
| 自含 | `dist/self-contained/` | 無需安裝 .NET | 約 90~110 MB |

## 幾個容易踩的點

<VTDocTip>
- **主程式名是固定的**：`LetsMeowToolbox.exe`，由 csproj 裡的 `AssemblyName=LetsMeowToolbox` 決定，別指望改出別的名；
- **RID 兜底**：單一檔案發布時如果命令列沒給 RID，csproj 會兜底指定 `win-x64`；
- **自含模式**會同時開啟 `IncludeNativeLibrariesForSelfExtract`，原生庫一併打進單一檔案；
- **版本號**在 `LetsMeowToolbox.App.csproj` 的 `Version` 屬性裡維護（當前 0.1.2），發布新版本時別忘了同步更新 `Services/AppInfo.cs` 裡的 `Version` 與 `Changelog`。
</VTDocTip>
