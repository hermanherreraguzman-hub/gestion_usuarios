###Gestion de Usuarios - Aplicación Web

Aplicación web completa para gestión de usuarios con operaciones CRUD (Crear, Leer, Actualizar, Eliminar). Desarrollada con Node.js, Express, SQLite en el backend y HTML, CSS, JavaScript vanilla en el frontend.

# Características

-  **CRUD completo** de usuarios
-  **Validaciones** en cliente y servidor
-  **Base de datos SQLite** (persistente)
-  **Seguridad** con helmet, CORS configurado
-  **Diseño responsive**
- **Interfaz moderna** y amigable

## Requisitos previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Git

## Instalación y ejecución

### 1. Clonar el repositorio
``bash
git clone https://github.com/hermanherreraguzman-hub/gestion_usuarios
### 2. Instalar dependencias
bash
npm install
### 3. Configurar variables de entorno
Crear archivo .env en la raíz:

env
PORT=3000
DB_PATH=./src/data/usuarios.db
### 4. Crear directorio para la base de datos
bash
mkdir -p src/data
### 5. Ejecutar la aplicación
bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
### 6. Acceder a la aplicación
Abrir el navegador en: http://localhost:3000

