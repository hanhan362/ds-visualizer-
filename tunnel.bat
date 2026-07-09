@echo off
setlocal enabledelayedexpansion
title DS-Visualizer Tunnel (Auto-reconnect)

echo === DS-Visualizer Public Tunnel ===
echo Backend: http://localhost:8080
echo Auto-reconnect: ON
echo.

:loop
echo [%time%] Connecting...
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ConnectTimeout=10 -R 80:localhost:8080 serveo.net 2>tunnel-url.txt
echo [%time%] Tunnel died. Reconnecting in 5s...
timeout /t 5 /nobreak >nul
goto loop
