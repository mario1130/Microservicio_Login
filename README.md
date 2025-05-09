# Microservicio de Login

Este proyecto implementa un microservicio de autenticación y gestión de usuarios utilizando tecnologías modernas como Node.js, Firebase, PostgreSQL y RabbitMQ. A continuación, se detalla su funcionalidad, configuración y arquitectura.

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Endpoints](#endpoints)
6. [Configuración](#configuración)
7. [Base de Datos](#base-de-datos)
8. [Autenticación con Firebase](#autenticación-con-firebase)
9. [Integración con RabbitMQ](#integración-con-rabbitmq)
10. [Dockerización](#dockerización)
11. [Contribuciones](#contribuciones)
12. [Licencia](#licencia)

---

## Descripción General

El microservicio de login permite:
- Autenticación de usuarios mediante Firebase.
- Gestión de usuarios y roles almacenados en PostgreSQL.
- Generación de tokens de sesión únicos.
- Restablecimiento de contraseñas.
- Historial de inicio de sesión almacenado en Firestore.
- Comunicación con otros microservicios mediante RabbitMQ.

Este microservicio está diseñado para ser modular, escalable y seguro, integrándose fácilmente con otros servicios en una arquitectura de microservicios.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:
- Node.js (v18 o superior)
- PostgreSQL
- Firebase (con un proyecto configurado)
- RabbitMQ (con soporte para TLS)
- Docker (opcional, para contenedores)

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/mariopascual/Microservices_Login.git
   cd Microservices_Login
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` y `.env.db` en la raíz del proyecto.
   - Define las variables necesarias como `PG_USER`, `PG_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT_KEY`, `RABBITMQ_HOST`, etc.

4. Genera los certificados TLS para RabbitMQ:
   ```bash
   bash generate-certs.sh
   ```

5. Inicia el servidor:
   ```bash
   npm start
   ```

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
src/
├── app.js                  # Punto de entrada del servidor
├── configuration/          # Configuración de Firebase, PostgreSQL y Firestore
├── controllers/            # Lógica de negocio
├── middlewares/            # Validaciones y middleware
├── models/                 # Modelos de datos para PostgreSQL
├── routes/                 # Definición de rutas
├── utils/                  # Funciones auxiliares
├── init/                   # Archivos de inicialización (SQL, JSON)
├── firebase/               # Configuración de Firebase
shared/
├── rabbitmq.js             # Configuración y manejo de RabbitMQ
certs/                      # Certificados TLS para RabbitMQ
```

---

## Endpoints

### Autenticación (`/login`)
- **POST /login**: Inicia sesión con un token de Firebase.
- **POST /logout**: Cierra sesión del usuario.
- **POST /reset-password**: Envía un enlace para restablecer la contraseña.

### Usuarios (`/user`)
- **POST /by-mail**: Obtiene un usuario por correo electrónico.

---

## Configuración

### Variables de Entorno

El proyecto utiliza variables de entorno para configurar la conexión a la base de datos, Firebase y RabbitMQ. Asegúrate de definir las siguientes variables en un archivo `.env`:

```env
# PostgreSQL
PG_USER=tu_usuario
PG_PASSWORD=tu_contraseña
PG_HOST=localhost
PG_DATABASE=tu_base_de_datos
PG_PORT=5432

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY=path/a/tu/archivo/credenciales.json

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5671
RABBITMQ_QUEUE=user_events
ENCRYPTION_KEY=clave_de_32_bytes_en_hexadecimal
```

---

## Base de Datos

El microservicio utiliza PostgreSQL como base de datos principal. El esquema de la base de datos se define en el archivo `src/init/init.sql`. Incluye tablas como:
- `rol`: Roles de usuario.
- `user`: Información de los usuarios.
- `user_tag`: Relación entre usuarios y etiquetas.

Para inicializar la base de datos, ejecuta el script SQL:
```bash
psql -U postgres -d tu_base_de_datos -f src/init/init.sql
```

---

## Autenticación con Firebase

El microservicio utiliza Firebase Authentication para la autenticación de usuarios. Algunas características incluyen:
- Verificación de tokens de Firebase mediante el SDK de Admin.
- Generación de enlaces para restablecer contraseñas.
- Almacenamiento del historial de inicio de sesión en Firestore.

Asegúrate de configurar correctamente Firebase en el archivo `src/configuration/firebaseConfig.js`.

---

## Integración con RabbitMQ

El microservicio utiliza RabbitMQ para la comunicación entre microservicios. Algunas características incluyen:
- Publicación de eventos como `UserCreated` y `UserUpdated`.
- Consumo de eventos desde la cola `user_events`.
- Cifrado de mensajes utilizando AES-256-CBC.

### Configuración de RabbitMQ

El archivo `rabbitmq.conf` contiene la configuración para habilitar TLS en RabbitMQ. Asegúrate de que los certificados generados estén en la ubicación correcta.

### Generación de Certificados

Ejecuta el script `generate-certs.sh` para generar los certificados necesarios para RabbitMQ.

---

## Dockerización

El proyecto incluye un `Dockerfile` para ejecutar el microservicio en un contenedor Docker. Para construir y ejecutar el contenedor:
```bash
docker build -t microservices_login .
docker run -p 3001:3001 microservices_login
```

---

## Contribuciones

Si deseas contribuir al proyecto:
1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza un pull request.

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
