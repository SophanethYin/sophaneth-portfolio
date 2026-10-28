@echo off
title Sophaneth Portfolio - http://localhost:3000
cd /d "%~dp0"

rem Node may not be on PATH yet in windows opened before it was installed.
set "PATH=%ProgramFiles%\nodejs;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and try again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing packages, first run only...
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

rem Open the browser once the server answers.
start "" /min powershell -NoProfile -WindowStyle Hidden -Command "do { Start-Sleep 1; try { $ok = (Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 60).StatusCode -eq 200 } catch { $ok = $false } } until ($ok); Start-Process http://localhost:3000"

echo.
echo  Portfolio is starting at http://localhost:3000
echo  Keep this window open. Close it to stop the website.
echo.
call npm run dev -- -p 3000
pause
