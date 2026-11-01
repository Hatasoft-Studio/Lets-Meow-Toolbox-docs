---
title: Uninstaller
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Uninstaller

Since v0.1.1, "Uninstaller" has been an **independent navigation category and standalone page**, dedicated to the problem of "a pile of software installed, never fully uninstalled".

## What It Can Do

### Batch Win32 Software Uninstall

Lists the Win32 software installed on your system; check multiple entries and uninstall them in batch — no need to click through Control Panel one by one.

### Leftover Scan and Cleanup

After software is uninstalled, a bunch of registry entries and folders often remain. This feature scans those leftovers and lets you check and clean them.

**Note**: leftover items are **unchecked by default**. The program's attitude is "better to delete less than to delete by mistake" — look carefully before checking what you want to clean.

### Export Cleanup Report

The uninstall and cleanup process can be exported as a report, convenient for archiving or troubleshooting.

### Linked with "Unlock"

The scariest thing during uninstall is "the file is locked and can't be deleted". This page is linked with [Unlock](/en/docs/unlock.html) — when you hit a lock issue, you can handle it directly on the Unlock page.

## Whose Design It References

The design of the uninstall and leftover scan module references the uninstall registry reading and leftover detection approach of the open source project **Bulk Crap Uninstaller (BCU, GPL-3.0)** — but note that this is an **independent implementation**, not a copy of the code.

## Usage Suggestions

<VTDocSteps>
  <VTDocStep title="Check the software to uninstall first">
    Check the target software in the list. Look carefully before checking — once batch uninstall starts, it executes in order.
  </VTDocStep>
  <VTDocStep title="Execute uninstall and confirm item by item">
    Both the uninstall and the subsequent cleanup operations go through your manual confirmation — nothing runs automatically.
  </VTDocStep>
  <VTDocStep title="Scan leftovers and check as needed">
    Scan for leftovers after uninstall. Leftovers are unchecked by default; only choose to clean after you've verified them.
  </VTDocStep>
  <VTDocStep title="Export the report for archiving">
    Export the cleanup report if needed, convenient for later review.
  </VTDocStep>
</VTDocSteps>

<VTDocNote>
Core system directories (C:\Windows, System32, WinSxS) are on the program's built-in blacklist and will never be mistakenly deleted as leftovers.
</VTDocNote>
