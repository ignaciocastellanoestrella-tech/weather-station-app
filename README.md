# 🌦️ Estación Meteorológica ICABRA64 - Bresser WiFi 5 en 1

App móvil Android para visualizar datos en tiempo real y históricos de tu estación meteorológica Bresser conectada a Wunderground.

## 📱 Características

- **Datos en tiempo real**: Temperatura, humedad, presión, viento, lluvia, UV, radiación solar
- **Gráficas interactivas**: Visualización de las últimas 24 horas
- **Datos históricos**: Estadísticas diarias, semanales, mensuales y anuales
- **Almacenamiento local**: Los datos se guardan en JSON en tu dispositivo
- **Actualización automática**: Refresco cada 5 minutos
- **Interfaz intuitiva**: Navegación por pestañas y diseño limpio

## 🚀 Generar APK (Método más rápido - 5 minutos)

### Opción 1: EAS Build (Requiere cuenta Expo - GRATIS)

1. **Instalar Node.js** (si no lo tienes): https://nodejs.org/

2. **Abrir terminal en la carpeta del proyecto** y ejecutar:

```powershell
cd weather-station-app
npm install -g eas-cli
npm install
npx expo login
```

3. **Configurar EAS** (primera vez):

```powershell
eas build:configure
```

4. **Generar APK**:

```powershell
eas build -p android --profile preview
```

5. **Espera 3-5 minutos** y recibirás un link para descargar el APK. Descárgalo en tu móvil e instálalo.

### Opción 2: Expo Go (Prueba rápida SIN compilar)

1. **Instalar Expo Go** en tu móvil desde Play Store

2. **En terminal**:

```powershell
cd weather-station-app
npm install
npx expo start
```

3. **Escanea el QR** que aparece con Expo Go y la app se abrirá

⚠️ **Nota**: Con Expo Go no tendrás un APK instalable, pero puedes probar la app instantáneamente.

## 📦 Estructura del proyecto

```
weather-station-app/
├── App.js                      # Componente principal
├── components/
│   ├── CurrentWeather.js       # Vista de datos actuales
│   ├── Charts.js               # Gráficas interactivas
│   └── HistoricalData.js       # Estadísticas históricas
├── services/
│   ├── WundergroundAPI.js      # Conexión con API Wunderground
│   └── StorageService.js       # Almacenamiento local en JSON
└── package.json                # Dependencias

```

## 🔧 Configuración

La app ya está configurada con:
- **Station ID**: ICABRA64
- **API Key**: 7fd62c8289ea40bf962c8289ea90bf17

Para cambiarlos, edita `services/WundergroundAPI.js`.

## 📊 Datos que muestra

### Actual
- Temperatura y sensación térmica
- Humedad y punto de rocío
- Velocidad y dirección del viento
- Ráfagas de viento
- Precipitación (tasa y acumulada)
- Presión atmosférica
- Radiación solar
- Índice UV

### Gráficas (últimas 24h)
- Evolución de temperatura
- Evolución de humedad
- Evolución de presión
- Velocidad del viento
- Precipitación acumulada

### Histórico
- Estadísticas máx/min/media por periodo
- Datos diarios, semanales, mensuales y anuales
- Precipitación total acumulada

## 💾 Almacenamiento

Los datos se guardan automáticamente en:
```
/data/user/0/com.icabra64.weatherstation/files/weather_data/
├── current.json      # Último dato recibido
└── history.json      # Histórico completo
```

Los datos históricos se mantienen durante 365 días automáticamente.

## 🛠️ Tecnologías

- **Expo 50** - Framework React Native
- **React Native Chart Kit** - Gráficas
- **Axios** - Peticiones HTTP
- **Expo File System** - Almacenamiento local
- **Wunderground API** - Datos meteorológicos

## ❓ Solución de problemas

**No se conecta a la API:**
- Verifica tu conexión a Internet
- Comprueba que la API key y station ID son correctos

**No se muestran datos históricos:**
- Es normal al principio. Los datos se acumulan con el tiempo.
- Deja la app funcionando y se irán guardando automáticamente.

**El APK no se instala:**
- Activa "Instalar apps de origen desconocido" en tu móvil
- Ve a Ajustes > Seguridad > Orígenes desconocidos

## 📞 Soporte

Configurado para la estación Bresser WiFi 5 en 1 conectada a Wunderground (ICABRA64).

---

**Creado con ❤️ para visualizar tu estación meteorológica personal**
