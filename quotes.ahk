; Quick combos for apostrophes and quotes

#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; Alt+Single Quote is Apostrophe
<!'::
Send, ’
return

; Alt+Left Bracket is Left Single Quote
<![::
Send, ‘
return

; Alt+Right Bracket is Right Single Quote
<!]::
Send, ’
return

; Shift+Alt+Left Bracket is Left Double Quote
+<![::
Send, “
return

; Shift+Alt+Right Bracket is Right Double Quote
+<!]::
Send, ”
return
