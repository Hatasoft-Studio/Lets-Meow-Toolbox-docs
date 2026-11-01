---
title: Beginner Zone and Advanced Zone
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Beginner Zone and Advanced Zone

These two zones are the main force for "system tuning" in the program. The Beginner Zone is gentle and requires no confirmation; the Advanced Zone makes bigger moves and requires checking the risk warning first. This page explains every feature in plain language.

## 🟢 Beginner Zone

Positioning: **not enabled by default, no risk confirmation required**. All features here are of the "better if changed, still restorable if changed wrong" type.

### Win11 Classic Context Menu

The Win11 context menu hides a layer behind "Show more options", which many people find anti-human. This switch takes you back to the Win10-style classic context menu — one right-click and all options are right there.

### Taskbar / Explorer Tweaks

Adjusts some annoying little details in the taskbar and Explorer to make daily operations more comfortable.

### Disable Ads / Telemetry / Notification Suggestions

The recommended content, ad slots and telemetry reporting that pop up from time to time in Windows — this feature turns them off following publicly available registry conventions. The key conventions reference the public lists of the open source project Win11Debloat.

### Safe UWP Uninstall (Whitelist)

Uninstalls the preinstalled UWP apps on Win11 that you'll never use. To prevent accidental removal, the program has a built-in **whitelist**: critical system components are not within the uninstallable range, so you don't need to worry about breaking your system. The whitelist also references Win11Debloat's public lists.

### Power / Indexing / Autoplay / Thumbnail Optimizations

A set of one-click optimization items for common performance and experience details, covering power plans, search indexing, autoplay and thumbnail-related settings.

### One-Click Restore

Anything changed in the Beginner Zone can be rolled back with one-click restore. No need to panic before making changes — the undo pill is ready.

## 🟡 Advanced Zone

Positioning: **unlocked after checking the risk warning**. Features here have a bigger impact on the system, so the program asks you to confirm that you know what you're doing first.

### Windows Update Pause Limit / Disable

Windows Updates sometimes come at the worst time. This feature adjusts the pause limit for updates, or disables them entirely. The registry / command conventions reference Sophia Script's public scripts.

### One-Click Restore

Just like the Beginner Zone, changes in the Advanced Zone also support one-click restore.

<VTDocWarning>
The Advanced Zone involves Windows Update policies — make sure you understand the consequences before making changes. All operations still require manual confirmation before execution, but "confirm before execute" does not mean "no impact after execution". Use as needed.
</VTDocWarning>

## Tips

- Every switch has a plain-language description next to it; if unsure, read the description before acting;
- All operations are recorded in the log (INFO / WARN / ERROR); if something goes wrong, you can check the log for comparison;
- If you're unhappy with the changes, first use the "one-click restore" of the corresponding zone.
