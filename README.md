# StudyAI

StudyAI es una aplicación web desarrollada como proyecto final.

La aplicación permite a los estudiantes gestionar sus documentos de estudio en formato PDF, generar resúmenes y tests mediante Inteligencia Artificial, organizar sus tareas y eventos en un calendario y administrar su perfil personal.

---

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Gestión segura de usuarios mediante Supabase Authentication.
- Subida de documentos PDF.
- Visualización de documentos PDF desde la aplicación.
- Generación automática de resúmenes mediante Inteligencia Artificial.
- Generación automática de tests de estudio mediante Inteligencia Artificial.
- Regeneración de tests.
- Calendario académico para organizar eventos.
- Gestión de eventos (crear, completar y eliminar).
- Perfil de usuario.
- Cambio de nombre.
- Cambio de contraseña.

---

## Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Supabase
    - Authentication
    - Database
    - Storage
    - Edge Functions

### Inteligencia Artificial

- OpenRouter API

### Librerías

- PDF.js
- FullCalendar

---

## Estructura del proyecto

```
StudyAI/
│
├── supabase/
│
├── css/
│   ├── app.css
│   ├── auth.css
│   ├── calendar.css
│   ├── dashboard.css
│   ├── document.css
│   ├── documents.css
│   └── profile.css
│
├── js/
│   ├── auth.js
│   ├── auth-guard.js
│   ├── calendar.js
│   ├── dashboard.js
│   ├── document.js
│   ├── documents.js
│   ├── profile.js
│   └── supabase.js

│
├── calendar.html
├── dashboard.html
├── document.html
├── documents.html
├── index.html
├── login.html
├── profile.html
├── register.html
│
├── package.json
├── package-lock.json
└── README.md
```

---

## Aplicación online

La aplicación está disponible en:

https:enlace

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Elisabetto/StudyAI.git

2. Abrir el proyecto con Visual Studio Code.

3. Instalar las dependencias del proyecto:

```bash
npm install
```

4. Crear un proyecto en Supabase.

5. Configurar la base de datos creando las tablas necesarias.

6. Crear el bucket **documents** en Supabase Storage para almacenar los archivos PDF.

7. Desplegar la Edge Function encargada de comunicarse con OpenRouter.

8. Configurar las credenciales de Supabase y OpenRouter.

9. Ejecutar el proyecto mediante Live Server o un servidor local.

---

## Base de datos

La aplicación utiliza las siguientes tablas:

- profiles: guarda los datos del usuario.
- documents: guarda el documento subido a la app.
- events: guarda el evento registrado en la app.

---

## Inteligencia Artificial

StudyAI utiliza OpenRouter para generar:

- Resúmenes automáticos de documentos PDF.
- Tests de estudio basados en el contenido del documento.

La extracción del texto del PDF se realiza mediante la librería PDF.js.

---

## Funcionalidades principales

### Gestión de documentos

- Subida de archivos PDF.
- Almacenamiento en Supabase Storage.
- Visualización del documento.
- Eliminación de documentos.
- Búsqueda por título.

### Resumen automático

Permite generar un resumen del contenido del documento utilizando Inteligencia Artificial.

### Test automático

Permite generar 10 preguntas tipo test a partir del contenido del documento mediante la Inteligencia Artificial.

### Calendario

Permite ver y gestionar eventos personales:

- Crear eventos.
- Marcar eventos como completados.
- Eliminar eventos.
- Visualización mensual mediante FullCalendar.

### Perfil

El usuario puede:

- Ver sus datos.
- Cambiar su nombre.
- Cambiar su contraseña.

---

## Seguridad

- Autenticación mediante Supabase Authentication.
- Protección de rutas privadas.
- Políticas RLS en Supabase para garantizar que cada usuario solo pueda acceder a su propia información.

---

## Autor

**Elisabet Torres Vivanco**

---

## 📄 Licencia

Proyecto desarrollado con fines educativos.