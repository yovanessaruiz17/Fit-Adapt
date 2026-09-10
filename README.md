# FitAdapt — Plataforma de Entrenamiento Adaptativo Inteligente (PWA)

FitAdapt es una aplicación web progresiva (**PWA**) de entrenamiento personalizado que adapta rutinas en función del nivel, tiempo disponible, ubicación (casa o gimnasio), equipamiento y salud articular del usuario, utilizando un **motor de reglas biomecánicas determinista**.

---

## 👤 Autoría y Derechos de Autor

- **Autora y Desarrolladora:** [Yordev](https://yordevctg17.netlify.app/) - Yorleidys Ruiz
- **Portafolio / Web:** [https://yordevctg17.netlify.app/](https://yordevctg17.netlify.app/)
- **Copyright:** &copy; 2026 **Yordev - Yorleidys Ruiz**. Todos los derechos reservados.

---


## 🚀 Despliegue en Netlify (Paso a Paso)

El proyecto está preconfigurado con `netlify.toml` y `public/_redirects` para funcionar de forma inmediata en Netlify sin errores de rutas (`404` en recargas).

### Opción A: Conectar Repositorio Git (Recomendada)
1. **Sube tu código a GitHub, GitLab o Bitbucket**.
2. Inicia sesión en [Netlify](https://app.netlify.com/).
3. Haz clic en **"Add new site"** > **"Import an existing project"**.
4. Selecciona tu proveedor Git y elige el repositorio de FitAdapt.
5. Netlify detectará automáticamente el archivo `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. *(Opcional)* En **Site Configuration > Environment variables**, puedes agregar:
   - `GEMINI_API_KEY`: Tu clave de Google Gemini (si deseas habilitar respuestas generativas en el asistente).
7. Haz clic en **"Deploy site"**. En menos de 2 minutos tu sitio estará en línea con certificado SSL (HTTPS) y capacidad de instalación PWA.

### Opción B: Despliegue Rápido por Arrastre (Netlify Drop)
Si deseas realizar una prueba rápida sin vincular Git:
1. En tu terminal local, ejecuta:
   ```bash
   npm install
   npm run build
   ```
2. Inicia sesión en Netlify y ve a la pestaña **"Sites"**.
3. Arrastra la carpeta `dist` que se generó directamente sobre la zona de **Netlify Drop**.

---

## 🛠️ Requisitos y Scripts del Proyecto

- **Node.js:** Versión 18 o 20 LTS recomendada.
- **Gestor de paquetes:** npm, yarn, pnpm o bun.

### Comandos principales
```bash
# Instalar dependencias
npm install

# Modo desarrollo local
npm run dev

# Compilar para producción (genera la carpeta dist/)
npm run build

# Validar tipos TypeScript
npm run lint

# Previsualizar la compilación de producción localmente
npm run preview
```

---

## 📱 Capacidades de Progressive Web App (PWA)

- **Instalación:** Funciona en Android, iOS (Safari "Añadir a pantalla de inicio") y navegadores de escritorio (Chrome, Edge).
- **Service Worker:** Precacheo de activos estáticos, CSS, fuentes e iconos con estrategias de respuesta inmediata.
- **Modo Offline:** Detección de conectividad con banner informativo y cola de sincronización local (`SyncManager`).

---

## 📋 Flujo de Entrada y Privacidad

1. **Onboarding Obligatorio:** En la primera visita, el usuario visualiza la política de protección de datos personales antes de ingresar datos sensibles.
2. **Consentimientos Expresos:** Se solicitan 3 confirmaciones (protección de datos, tratamiento biomecánico/articular y alcance orientativo no clínico).
3. **Calibración Biomecánica:** En 10 pasos guiados, se configuran objetivos, tiempo, material disponible y articulaciones sensibles (rodillas, hombros, lumbares, etc.).
4. **Generación Determinista:** El motor calcula ejercicios seguros, descansos y progresiones adaptadas a cada sesión.

---

## ⚖️ Aviso Legal y Médico

FitAdapt es una herramienta tecnológica y orientativa de acondicionamiento físico. No constituye un dispositivo médico ni reemplaza la valoración, diagnóstico o prescripción de profesionales sanitarios o fisioterapeutas colegiados.

---

## 📜 Derechos de Propiedad Intelectual

Todo el código fuente, diseño de interfaces, lógica algorítmica y arquitectura del sistema pertenecen a **[Yordev](https://yordevctg17.netlify.app/) - Yorleidys Ruiz**. Prohibida su reproducción, distribución o explotación no autorizada.
&copy; 2026 [Yordev](https://yordevctg17.netlify.app/) - Yorleidys Ruiz. Todos los derechos reservados.

