@echo off

echo Installing Auto Organizer (shortcut mode)...

REM 📁 nykyinen kansio
set APPDIR=%~dp0

REM 📁 startup kansio
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

REM 📄 väliaikainen vbs joka luo shortcutin
set SCRIPT=%TEMP%\createShortcut.vbs

echo Set oWS = WScript.CreateObject("WScript.Shell") >> "%SCRIPT%"
echo sLinkFile = "%STARTUP%\Auto Organizer.lnk" >> "%SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SCRIPT%"
echo oLink.TargetPath = "%APPDIR%start.vbs" >> "%SCRIPT%"
echo oLink.WorkingDirectory = "%APPDIR%" >> "%SCRIPT%"
echo oLink.Save >> "%SCRIPT%"

cscript //nologo "%SCRIPT%"

del "%SCRIPT%"

echo Shortcut created!

timeout /t 2 >nul

echo Restarting PC...
pause
shutdown /r /t 0