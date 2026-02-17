# Documentación Maestra - Finance Flow

Bienvenido a la documentación oficial de **Finance Flow**. Este documento unifica la visión del proyecto, el manual de usuario y la guía técnica de desarrollo, actualizada a **Febrero 2026**.

---

## ÍNDICE

1.  [Visión General del Proyecto](#1-visión-general-del-proyecto)
2.  [Manual de Usuario](#2-manual-de-usuario)
3.  [Guía Técnica y de Desarrollo](#3-guía-técnica-y-de-desarrollo)

---

## 1. VISIÓN GENERAL DEL PROYECTO

### Propósito
**Finance Flow** es una aplicación de gestión de finanzas personales diseñada bajo el modelo **"Offline-First"**. La prioridad es permitir al usuario operar sin depender de una conexión a internet, guardando los datos en su dispositivo y sincronizándolos con la nube cuando sea posible.

### Tecnologías Principales
*   **Frontend**: React + TypeScript (Interfaz robusta y segura).
*   **Framework UI**: Ionic Framework (Componentes móviles nativos).
*   **Estilos**: Tailwind CSS (Diseño rápido y personalizado, tema Cyberpunk).
*   **Persistencia Local**: RxDB (Base de datos NoSQL en el navegador/dispositivo).
*   **Backend & Cloud**: Supabase (Base de datos y Autenticación en la nube).
*   **Móvil**: Capacitor (Empaquetado nativo para Android/iOS).

---

## 2. MANUAL DE USUARIO

Bienvenido a **Finance Flow**, tu herramienta para el control financiero.

### 2.1. Introducción
*   **Funciona sin internet**: Tus datos siempre están disponibles en tu dispositivo.
*   **Respaldo automático**: Al recuperar la conexión, todo se guarda en la nube.
*   **Acceso Universal**: Úsalo desde la web o instala la app en tu Android.

### 2.2. Guía de Uso

#### **Dashboard (Inicio)**
El centro de mando de tus finanzas:
*   **Balance Total**: Visualiza cuánto dinero tienes en total.
*   **Resumen del Mes**: Gráficos comparativos de tus ingresos vs. gastos.
*   **Últimos Movimientos**: Acceso rápido a las transacciones recientes.

#### **Gestión de Billeteras y Categorías**
Antes de crear transacciones, asegúrate de tener configurado tu entorno:
1.  **Billeteras**: Ve a la pestaña **Billeteras** y crea tus cuentas (ej. "Efectivo", "Banco", "Ahorros").
2.  **Categorías**: Ve a la pestaña **Categorías** y crea tus grupos de gastos/ingresos (ej. "Comida", "Transporte", "Nómina").

#### **Gestión de Transacciones**
Para registrar un movimiento:
1.  Ve a la sección **Transacciones**.
2.  Pulsa el botón **"+"**.
3.  Elige el tipo: **Ingreso** o **Gasto**.
4.  **Selecciona una Billetera**: ¿De dónde sale o a dónde entra el dinero?
5.  **Selecciona una Categoría**: ¿Qué tipo de movimiento es? (La lista se filtra según si es ingreso o gasto).
6.  Introduce el monto, la fecha y una nota opcional.
7.  Pulsa **Guardar**.

*Nota*: Si no tienes internet, verás un icono de "pendiente de sincronizar". La app lo subirá cuando vuelvas a estar conectado.

#### **Configuración y Perfil**
Desde aquí puedes gestionar tu sesión de usuario.

### 2.3. Solución de Problemas Comunes
*   **Error de Sincronización**: Verifica tu conexión a internet. Si persiste, comprueba que tus credenciales de Supabase sean correctas.
*   **La app no carga en Android**: Asegúrate de tener instalado **Java 17**.
*   **Problemas al registrarse**: Si la app no redirige al Dashboard, intenta recargar la página. (Este problema ha sido parcheado con una redirección forzada).

---

## 3. GUÍA TÉCNICA Y DE DESARROLLO

Este apartado está dirigido a desarrolladores que deseen mantener o extender el proyecto.

### 3.1. Instalación y Puesta en Marcha

**Requisitos del Sistema:**
*   Node.js (v18+)
*   Git
*   **Java 17 (Microsoft OpenJDK 17)** - *Crucial para compilar en Android*.
*   Android Studio + SDK (Para compilar APK).

**Pasos de Instalación:**
1.  **Clonar**: `git clone <URL_REPO>` y entrar en `finance-flow`.
2.  **Instalar Dependencias**: Ejecutar `npm install`.
3.  **Configurar Entorno**: Crear archivo `.env.local` con las claves de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url
    VITE_SUPABASE_ANON_KEY=tu_key
    ```
4.  **Configurar Android**:
    *   Asegúrate de tener un archivo `local.properties` en la carpeta `android/` apuntando a tu SDK:
        ```properties
        sdk.dir=C\:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
        ```
    *   En `android/gradle.properties`, el JDK está configurado para apuntar a la instalación de Microsoft OpenJDK 17 (ajustar si es necesario).

**Ejecución:**
*   **Web**: `npm run dev` (Inicia servidor local).
*   **Android**:
    *   `npm run build`
    *   `npx cap sync android`
    *   `npx cap open android`

### 3.2. Arquitectura del Código

#### **A. Capa de Datos (The Core)**
*   **RxDB (`src/lib/rxdb.ts`)**: Base de datos local. Esquemas estrictos para `transactions`, `wallets` y `categories`.
*   **Zustand (`src/lib/store.ts`)**: State manager global.
    *   *Actualización reciente*: Ahora incluye lógica para resolver nombres de categorías y billeteras (`getCategoryName`, `getWalletName`) en tiempo de ejecución.

#### **B. Autenticación y Nube**
*   **Supabase (`src/lib/supabase.ts`)**: Backend as a Service.
*   **Auth Context (`src/lib/auth.tsx`)**: Gestiona la sesión.
    *   *Estrategia de Redirección*: En el registro (`Register.tsx`), se utiliza una **Redirección Fuerte** (`window.location.href`) para forzar la recarga de la aplicación y garantizar que el estado de autenticación esté limpio y sincronizado.

#### **C. Interfaz de Usuario (UI)**
*   **Componentes**: Ionic Framework + React.
*   **Tema**: Cyberpunk (Neon/Dark Mode).
*   **Lógica de Formularios**:
    *   `AddTransaction.tsx`: Implementa selectores dinámicos. Las categorías mostradas se filtran reactivamente basándose en si el usuario seleccionó "Ingreso" o "Gasto".

### 3.3. Historial de Cambios y Retos Superados

1.  **Sincronización Offline**: Configurar RxDB para manejar conflictos y replicación.
2.  **Ciclo de Registro (Fix Crítico)**: Se solucionaron condiciones de carrera donde el usuario quedaba "atrapado" en el registro.
    *   *Solución*: Se reemplazó el enrutamiento suave de React Router por un `window.location.href = '/dashboard'`, forzando al navegador a re-inicializar el contexto de autenticación desde el almacenamiento local.
3.  **Compilación Android (Java Version)**:
    *   *Problema*: Gradle requería Java 11+, pero el sistema tenía Java 8.
    *   *Solución*: Se instaló Microsoft OpenJDK 17 y se configuró `gradle.properties` con `org.gradle.java.home` explícito.
4.  **Integración de Datos (Core Logic)**:
    *   *Problema*: Las transacciones usaban IDs hardcodeados (`default-wallet`).
    *   *Solución*: Se implementaron selectores reales en la UI de creación y se actualizó la lista para mostrar nombres legibles cruzando datos con los stores de `wallets` y `categories`.

---
*Documentación generada por Antigravity Agent - Febrero 2026*
