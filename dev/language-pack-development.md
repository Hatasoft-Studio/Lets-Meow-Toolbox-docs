---
title: 语言包开发
---

# 语言包开发

这一页讲 v0.2.0 引入的外置语言包机制：`.meowlang` 文件长什么样、程序怎么校验与安装、怎么自己做一个语言包，以及设置页「检查更新」背后的接口。

## 语言体系怎么组织的

主程序的多语言由两层组成：

| 层 | 位置 | 说明 |
| --- | --- | --- |
| 内嵌源语言 | `src/LetsMeowToolbox.App/Localization/zh-Hans.meowlang` | 以 `EmbeddedResource` 打进主程序，简体中文永远可用，不依赖任何外置文件 |
| 外置语言包 | 程序目录下的 `lang/*.meowlang` | 仓库根目录 `lang/` 里的官方语言包（`zh-Hant`、`ja`、`en`），构建时由 csproj 复制到输出目录，启动时自动扫描 |

相关实现集中在三个文件：

- `Services/LocalizationService.cs`：语言包模型 `LanguagePack`、扫描 `lang` 目录、按原文翻译、遍历可视树替换界面文本；
- `Services/LanguagePackInstaller.cs`：语言包读取校验、适用版本判断、版本比较、复制安装、重启程序；
- `Views/LanguageManagerDialog.xaml(.cs)`、`LanguagePackDetailsDialog`、`LanguageInstallProgressDialog`：选择语言、查看详情、安装进度三个窗口。

简体中文是**源语言**，其他语言包里的 `strings` 都是“简体中文原文 → 目标语言译文”的映射，所以新增语言不需要改任何 C# 代码。

## .meowlang 文件格式

语言包本质上是一个 UTF-8 编码的 JSON 文本文件。一个最小的例子：

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

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 语言包唯一标识，也决定安装后的文件名（`<id>.meowlang`）。不能是 `zh-Hans`，那是内嵌源语言 |
| `name` | ✅ | 显示名称，例如 `繁體中文`、`日本語` |
| `author` | ✅ | 制作者，官方包固定为 `Hatasoft-Studio` |
| `authorWebsite` | — | 作者官网，和 `author` 一起决定是否为官方语言包 |
| `version` | ✅ | 语言包自身版本号，用于同名包更新/降级比较 |
| `source` | — | 源语言，默认 `zh-Hans` |
| `languageType` | — | 语言类型文案，例如“英语”“繁体中文” |
| `appVersion` | — | 适用的主程序版本范围，默认 `*` |
| `description` | — | 简介，展示在详情窗口 |
| `strings` | ✅ | 原文 → 译文字典，不能为空 |

<VTDocTip>
`strings` 的键必须和界面上的简体中文原文**完全一致**（包括标点与空格）。程序按原文精确匹配，找不到译文时原样显示简体中文，不会报错。多行文本会按行分别查表：空行直接跳过，不含中文字符的行（品牌名、数字、纯英文）原样保留。
</VTDocTip>

## 适用版本（appVersion）规则

判断逻辑在 `LanguagePackInstaller.CheckCompatible`，最终委托给 `MatchesRange`：

- 留空或 `*`：任何版本都适用；
- 可以用 `|` 分隔多段，任意一段匹配即通过，例如 `0.2.0 | 0.2.1 | 0.2.2`；
- 单段支持 `>=`、`<=`、`>`、`<`、`=`、`==` 前缀，也支持直接写版本号（等价于 `==`）；
- 同一段里可以用空格或逗号写多个条件，需要**全部满足**；
- 无法解析的条件会被忽略，避免误杀。

版本比较由 `LanguagePackInstaller.CompareVersion` 完成：解析版本号时去掉开头的 `v`/`V`，按 `.` 分段取整数，非数字部分直接截断（所以 `v1.1.0-lang` 会按 `1.1.0` 比较）。

## 官方语言包怎么判定

`LanguagePackRules.IsOfficial` 要求**作者与作者网站同时匹配**：

- `author` 等于 `Hatasoft-Studio`（不区分大小写，去除首尾空格）；
- `authorWebsite` 等于 `https://hatasoft365.top` 或 `https://lets-meow-toolbox.hatasoft365.top`（同样忽略大小写，末尾斜杠会被去掉）。

只有同时满足才会在详情窗口显示绿色盾牌，并跳过第三方确认。

## 安装流程（代码层面）

设置页「安装语言包」最终调用 `LanguageManagerDialog.InstallInteractive`，顺序如下：

1. `LanguagePackInstaller.ReadFile` 读取文件并校验必填字段（`id`、`name`、`author`、`version`、`strings`）；
2. 拒绝 `id == zh-Hans`（简体中文已内嵌）；
3. `CheckCompatible` 校验版本范围，不通过就弹错误并写 WARN 日志；
4. 若 `lang` 目录已存在同 `id` 的包：
   - 用 `SameIdentity` 比较 `author` 与 `authorWebsite`（忽略大小写、忽略末尾 `/`），不一致则拒绝覆盖并提示手动删除旧包；
   - 用 `CompareVersion` 判断这次是「更新」「降级」还是「重新安装」，二次确认；
5. `LanguagePackDetailsDialog` 展示详情（安装时间取当前时间，文件大小取源文件长度）；
6. 非官方语言包额外弹一次第三方确认；
7. `LanguageInstallProgressDialog` 执行安装：`LanguagePackInstaller.Install` 先复制到 `.tmp`，再替换目标文件，并把文件修改时间设为当前时间（详情里的“安装时间”就是读这个）；
8. 成功后调用 `LocalizationService.Refresh()` 重新扫描目录，并提示「语言包安装成功！」；失败则显示原因与 `LogService.Instance.LogFilePath`。

<VTDocWarning>
安装只是一个文件复制到 `lang` 目录的过程，**不会执行语言包里的任何代码**。但语言包会替换界面文案，第三方语言包仍然建议先检查 JSON 内容再安装。
</VTDocWarning>

## 切换语言与重启

「加载所选语言」的执行顺序：

1. `CheckCompatible` 再次校验；
2. 如果已经是当前语言，直接提示无需重新加载；
3. 弹出详情窗口确认；
4. `LocalizationService.SetLanguage(id)` 写入 `SettingsService.Language`，并触发 `LanguageChanged` 事件；
5. `LanguagePackInstaller.RestartApp` 启动新进程并 `Application.Current.Shutdown()`。

程序启动时 `LocalizationService.Initialize()` 会加载内嵌简体中文、扫描 `lang` 目录，再按设置里保存的语言 ID 恢复上次选择；如果指定的包不存在，会回退到简体中文并把设置改回去。

## 界面翻译的实现方式

`LocalizationService` 不是给每个控件绑定资源，而是**遍历可视树替换静态文本**：

- `LocalizeElement` 处理 `TextBlock.Text`（包括 `Run`）、`ContentControl.Content`、`HeaderedContentControl.Header`、`Window.Title`、`FrameworkElement.ToolTip`；
- 忽略带数据绑定的属性（`BindingOperations.GetBindingExpressionBase` 不为空就跳过），避免破坏 MVVM 绑定；
- 用 `ConditionalWeakTable` 记录每个控件未翻译前的原文，切换语言时基于原文重新翻译，所以反复切换不会出现“译文套译文”；
- `ApplyToDeferred` 在 `DispatcherPriority.Loaded` 时再翻译，等模板与列表项实例化完成；窗口级 `Loaded` 事件通过 `EventManager.RegisterClassHandler` 统一挂接，子页面/弹窗需要主动调用。

这也是为什么切换语言必须重启：运行中新增的控件、动态生成的文本不一定能即时刷新，重启最稳。

## 构建时语言包怎么进产物

`LetsMeowToolbox.App.csproj` 里有两段关键配置：

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

所以调试（F5）和 `dotnet publish` 之后，产物目录里都会自动出现 `lang/`，不需要手动复制。

## 自己做一个语言包

1. 复制官方的 `lang/en.meowlang`（或 `ja.meowlang`）作为模板；
2. 改 `id`、`name`、`author`、`authorWebsite`、`version`、`languageType`、`description`；
3. `appVersion` 按当前主程序版本填写，例如 `>=0.2.0` 或 `0.2.0 | 0.2.1`；
4. 在 `strings` 里逐条填译文，键保持简体中文原文不变；
5. 保存为 UTF-8 JSON，文件名建议与 `id` 一致；
6. 打开程序「设置」→「安装语言包」选这个文件，确认详情后安装，再到「选择语言」加载。

<VTDocTip>
调试时也可以直接把 `.meowlang` 丢进程序目录的 `lang` 文件夹，重启程序就会出现在语言管理窗口里——安装按钮只是把这一步做得更规范（校验、确认、记录安装时间）。
</VTDocTip>

## 设置页「检查更新」接口

`Services/UpdateService.cs` 请求固定地址：

```text
https://api.lets-meow-toolbox.hatasoft365.top/
```

请求头带 `User-Agent: LetsMeowToolbox/<当前版本>` 与 `Accept: application/json`，超时 10 秒。返回 JSON 映射到 `UpdateInfo`：

| 字段 | 说明 |
| --- | --- |
| `latestVersion` | 最新版本号，必填；为空视为接口数据无效 |
| `downloadUrl` | 官网下载地址；为空时回退 `https://lets-meow-toolbox.hatasoft365.top` |
| `unsupportedVersions` | 已停止支持的版本号数组；包含当前版本时启动即强制更新 |
| `changelog` | 更新说明文本，展示在更新弹窗里 |

判断逻辑：

- `HasUpdate`：`CompareVersion(latestVersion, AppInfo.Version) > 0`；
- `Unsupported`：`unsupportedVersions` 中任一项与当前版本比较结果相等。

`Views/UpdateDialog` 有两种模式：

- **普通模式**：显示当前版本、最新版本、下载地址与更新内容，按钮为「前往官网获取新版本」/「稍后再说」；
- **强制模式**（`Unsupported`）：标题变为「此版本已停止支持」，按钮为「前往官网获取新版本」/「退出程序」，关闭窗口后程序退出。

<VTDocNote>
更新接口的地址写死在 `UpdateService.Endpoint` 常量里，`SettingsView` 与启动检测都使用同一个服务。修改接口地址时记得同步检查这两个调用点。
</VTDocNote>
