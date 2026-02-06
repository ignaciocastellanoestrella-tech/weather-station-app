@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo   🚀 PRUEBA RÁPIDA CON EXPO GO (SIN APK)
echo ═══════════════════════════════════════════════════════
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo.
    echo 📥 Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)
echo.

echo ═══════════════════════════════════════════════════════
echo   ✅ LISTO PARA INICIAR
echo ═══════════════════════════════════════════════════════
echo.
echo 📱 Asegúrate de tener Expo Go instalado en tu móvil
echo    (descárgalo desde Play Store si no lo tienes)
echo.
echo 🔄 Iniciando servidor...
echo 📱 Escanea el QR con Expo Go cuando aparezca
echo.
pause

call npx expo start

pause
