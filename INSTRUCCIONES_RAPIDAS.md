# ⚡ INSTRUCCIONES RÁPIDAS - APK EN 5 MINUTOS

## 🎯 Pasos para obtener tu APK

### 1️⃣ Instalar Node.js (si no lo tienes)

Descarga e instala desde: **https://nodejs.org/** (versión LTS recomendada)

Reinicia el terminal después de instalar.

### 2️⃣ Instalar dependencias

Abre PowerShell en esta carpeta y ejecuta:

```powershell
npm install -g eas-cli expo-cli
npm install
```

### 3️⃣ Crear cuenta Expo (GRATIS)

Regístrate en: **https://expo.dev/signup**

Luego en terminal:

```powershell
npx expo login
```

Introduce tu usuario y contraseña de Expo.

### 4️⃣ Generar APK

```powershell
eas build:configure
eas build -p android --profile preview
```

**⏱️ Tardará 3-5 minutos.** Recibirás un enlace para descargar el APK.

### 5️⃣ Instalar en tu móvil

1. Descarga el APK desde el enlace
2. Activa "Instalar apps de origen desconocido" en tu móvil
3. Instala el APK

## 🚀 Alternativa: Probar SIN compilar (30 segundos)

1. Instala **Expo Go** desde Play Store en tu móvil
2. En terminal:
```powershell
npm install
npx expo start
```
3. Escanea el QR con Expo Go

## 📱 Características de la app

✅ Datos actuales de ICABRA64 (Bresser WiFi 5 en 1)
✅ Gráficas de últimas 24 horas
✅ Histórico diario, semanal, mensual y anual
✅ Almacenamiento local en JSON
✅ Actualización automática cada 5 minutos

---

**¿Problemas?** Lee el [README.md](README.md) completo.
