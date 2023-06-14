; Cookie Clicker helper

#NoEnv
#Warn
#InstallMouseHook
#SingleInstance Force

SendMode Input
SetDefaultMouseSpeed, 100
SetWorkingDir %A_ScriptDir%
SetTitleMatchMode, 2


; Timer: if caps lock is on, searches for golden cookie and click if found
#Persistent
SetTimer, SearchGoldenCookie, 250
return

SearchGoldenCookie:
  if !WinActive("ahk_exe Cookie Clicker.exe") or !GetKeyState("CapsLock","T") {
    return
  }
  ImageSearch, Px, Py, 0, 0, A_ScreenWidth, A_ScreenHeight, cookie.bmp
  if !ErrorLevel {
    MouseGetPos, Mx, My
    Click, %Px% %Py%
    MouseMove, %Mx%, %My%
  }
return


; Right click: toggle mode if caps lock is on, otherwise press to spam
#IfWinActive, ahk_exe Cookie Clicker.exe
RButton::
  while GetKeyState("RButton","P") or GetKeyState("CapsLock","T") {
    if GetKeyState("LButton","P") {
      return
    }
    Click, 4
    Sleep 30
  }
return


; Middle click: reload save from clipboard
#IfWinActive, ahk_exe Cookie Clicker.exe
MButton::
  if GetKeyState("LButton","P") {
    return
  }
  Send, ^o
  Send, ^v
  Send, {Enter}
return
