#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

!c::
if GetKeyState("CapsLock", "T")
  Send, Ç
else
  Send, ç
return

+!c::
if GetKeyState("CapsLock", "T")
  Send, ç
else
  Send, Ç
return

!g::
if GetKeyState("CapsLock", "T")
  Send, Ğ
else
  Send, ğ
return

+!g::
if GetKeyState("CapsLock", "T")
  Send, ğ
else
  Send, Ğ
return

!i::
if GetKeyState("CapsLock", "T")
  Send, İ
else
  Send, ı
return

+!i::
if GetKeyState("CapsLock", "T")
  Send, ı
else
  Send, İ
return

!o::
if GetKeyState("CapsLock", "T")
  Send, Ö
else
  Send, ö
return

+!o::
if GetKeyState("CapsLock", "T")
  Send, ö
else
  Send, Ö
return

!s::
if GetKeyState("CapsLock", "T")
  Send, Ş
else
  Send, ş
return

+!s::
if GetKeyState("CapsLock", "T")
  Send, ş
else
  Send, Ş
return

!u::
if GetKeyState("CapsLock", "T")
  Send, Ü
else
  Send, ü
return

+!u::
if GetKeyState("CapsLock", "T")
  Send, ü
else
  Send, Ü
return

