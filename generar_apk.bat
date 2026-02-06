@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo   🌦️ GENERADOR APK - ESTACIÓN ICABRA64
echo ═══════════════════════════════════════════════════════
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo.
    echo 📥 Descárgalo desde: https://nodejs.org/
    echo.
    echo Después de instalar, reinicia este script.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version
echo.

REM Instalar EAS CLI globalmente
echo 📦 Instalando herramientas EAS CLI y Expo CLI...
call npm install -g eas-cli expo-cli
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando herramientas
    pause
    exit /b 1
)
echo.

REM Instalar dependencias del proyecto
echo 📦 Instalando dependencias del proyecto...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)
echo.

echo ═══════════════════════════════════════════════════════
echo   ✅ INSTALACIÓN COMPLETADA
echo ═══════════════════════════════════════════════════════
echo.
echo 🔐 Ahora necesitas iniciar sesión en Expo
echo.
echo ¿Tienes cuenta en Expo? (S/N)
set /p tiene_cuenta=

if /i "%tiene_cuenta%"=="N" (
    echo.
    echo 📝 Regístrate GRATIS en: https://expo.dev/signup
    echo.
    echo Una vez registrado, vuelve aquí y presiona una tecla.
    pause >nul
)

echo.
echo 🔐 Iniciando sesión en Expo...
call npx expo login
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en login
    pause
    exit /b 1
)
echo.

echo ═══════════════════════════════════════════════════════
echo   🔨 GENERANDO APK
echo ═══════════════════════════════════════════════════════
echo.
echo ⏱️ Esto tardará 3-5 minutos...
echo.

REM Configurar EAS (primera vez)
call eas build:configure
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en configuración
    pause
    exit /b 1
)

REM Generar APK
call eas build -p android --profile preview
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error generando APK
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════
echo   ✅ APK GENERADO EXITOSAMENTE
echo ═══════════════════════════════════════════════════════
echo.
echo 📱 Descarga el APK desde el enlace que aparece arriba
echo 📱 Instálalo en tu móvil
echo 📱 Activa "Instalar apps de origen desconocido" si es necesario
echo.
pause
