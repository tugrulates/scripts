; Cookie Clicker helper

#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

#InstallMouseHook

SetTitleMatchMode, 2
#IfWinActive, ahk_exe Cookie Clicker.exe

; Right click
; toggle mode if caps lock is on, otherwise press to spam
RButton::
	while GetKeyState("RButton","P") or GetKeyState("CapsLock","T") {
		if !WinActive(Cookie Clicker) or GetKeyState("LButton","P") {
			return
		}
		Click, 4
		Sleep 30
	}
	return

; Middle click
; reload save from clipboard
MButton::
	Send, ^o
	Send, ^v
	Send, {Enter}
	return

#IfWinActive
