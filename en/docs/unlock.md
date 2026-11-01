---
title: Unlock
---

<VTDocWarning>
All content on this page is translated from the Simplified Chinese version. Please refer to the Simplified Chinese version as the primary reference. This project does not yet offer an official translation in this language; multilingual versions are planned for the future — stay tuned.
</VTDocWarning>

# Unlock

"The file is being used by another program and can't be deleted" — when you see this message, this page is your savior. Since v0.1.1, "Unlock" has also been an **independent navigation category and standalone page**.

## What It Can Do

### Find Locking Processes

Point it at a locked file or directory, and it finds out exactly which process is locking it.

### Close Programs to Release Locks

Once the locking process is found, you can close it to release the lock. After closing, the file that couldn't be deleted can be deleted normally.

**Note**: core system processes are on the built-in blacklist and **forbidden from being force-terminated** — no need to worry about crashing your system with a slip of the hand.

### Delayed Delete on Boot

Some files are truly stubborn and can't be deleted no matter what. This feature schedules them to be **deleted at the next boot** — early in system startup the file isn't locked yet, so the deletion succeeds. Under the hood it uses Windows' native file operation capabilities (such as MoveFileEx's delayed operation mechanism).

## Linked with the Uninstaller

If you hit "file is locked" while uninstalling software, you can jump straight to this page to handle the lock, then go back and continue cleaning up. The two pages are designed to work together.

## Usage Suggestions

1. First find out **who** is locking on the unlock page — don't just close processes right away; what if it's your unsaved document?
2. Only execute the close after confirming the process can be closed;
3. For things that really can't be deleted, use delayed delete on boot as the fallback;
4. v0.1.2 fixed the issue where the locking process list collapsed in height and the scroll wheel was swallowed in small windows; the list now scrolls normally with the whole page — upgrading is recommended for older versions.

<VTDocTip>
The underlying implementation only calls Microsoft's native Win32 APIs (RestartManager, MoveFileEx, etc.), without relying on third-party drivers or magic. The code is open source and inspectable.
</VTDocTip>
