@echo off
echo Stopping all hanging processes...
taskkill /F /IM node.exe /T
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq npm*" /T
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq npx*" /T
echo Done. Please restart your system or just one terminal with npm run dev.
pause
