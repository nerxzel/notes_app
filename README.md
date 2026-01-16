## Características Principales

- **Offline-First:** Permite crear, editar y eliminar notas sin conexión a internet utilizando **IndexedDB**.
- **Sincronización Bidireccional:**
  - **Push:** Envía cambios locales pendientes al recuperar la conexión.
  - **Pull:** Descarga cambios remotos periódicamente.
- **Consistencia Eventual:** Soporta múltiples pestañas/clientes sincronizados mediante **Polling**.
- **Resolución de Conflictos:** Implementación de la estrategia **Last Write Wins** basada en timestamps (`updatedAt`).
- **Soft Delete:** Las notas no se eliminan físicamente de inmediato para permitir la sincronización de borrados.
- **Indicador de Estado:** Feedback visual inmediato sobre el estado de la conexión (Online/Offline).

## Stack Tecnológico

**Cliente (Frontend):**

- React + Vite
- Bootstrap (UI)
- IDB (Wrapper para IndexedDB)
- Axios

**Servidor (Backend):**

- Node.js + Express
- Prisma ORM
- SQLite (Base de datos relacional)
- Zod (Validación)

---

## Instrucciones de Instalación y Ejecución

El proyecto se encuentra en dos carpetas: server (backend) y client (frontend). Es necesario ejecutar ambas para su correcto funcionamiento.

### Prerrequisitos

- Node.js (v16 o superior)
- NPM

### Paso 1: Backend

1.  Abrir una terminal y navegar a la carpeta del servidor:
    ```bash
    cd server
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Inicializar la base de datos SQLite (Migración):
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Iniciar el servidor:
    ```bash
    npm run dev
    ```
    > El servidor correrá en: `http://localhost:3000`

### Paso 2: Frontend

1.  Abrir **otra** terminal y navegar a la carpeta del cliente:
    ```bash
    cd client
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Crear el archivo de variables de entorno:
    - Crea un archivo `.env` en la raíz de la carpeta `client`.
    - Agrega la siguiente línea:
    ```env
    VITE_API_URL=http://localhost:3000/api/note
    ```
4.  Iniciar la aplicación:
    ```bash
    npm run dev
    ```
5.  Abrir en el navegador (usualmente `http://localhost:5173`).

---

## Decisiones de Arquitectura

### Modelo de Sincronización

1. Decidí utilizar una base de datos en sqlite para facilitar la portabilidad del proyecto.
2. El servidor y el cliente se encuentran en un sólo repositorio para poder facilitar la revisión del proyecto.
3. Respecto al modelo de datos de las notas, se utilizó ULID para la generación de id desde el cliente ya que al no tener conexión a internet en algunos caso, un incremental normal en el servidor podría generar conflictos.
4. Al detectar el evento `window.online` o al guardar una nota, se dispara una sincronización inmediata.
5. Un `setInterval` ejecuta un ciclo de `Push -> Pull` cada 10 segundos para mantener la consistencia eventual entre clientes distintos.

La aplicación transita por estados definidos:

- **Offline:** Solo lectura/escritura en IndexedDB.
- **Online Idle:** Conectado, esperando interacción o timer.
- **Syncing:** Estado transitorio donde se resuelven las diferencias entre LocalDB y ServerDB.

### Resolución de Conflictos

Se utiliza la estrategia **Last Write Wins**. Al recibir datos del servidor (`mergeNote`), se compara la fecha `updatedAt` de la nota entrante contra la local. Solo se sobrescribe si la versión del servidor es cronológicamente posterior.
