# Proyecto Contenedores 

## Descripcion del proyecto
El objetivo es construir una plataforma basada en Docker y Docker Compose para crear, administrar y eliminar microservicios dinámicamente a través de un dashboard web

### Características de cada microservicio:
- Aplicación independiente empaquetada y ejecutada en su propio contenedor Docker.
- Expone al menos un endpoint HTTP que recibe parámetros y retorna una respuesta en formato JSON.
- Se crea dinámicamente pegando código fuente desde la interfaz web.
- Debe soportar la selección de al menos dos lenguajes de programación.
- No es una función del dashboard, un archivo suelto, ni una ruta adicional del backend principal.

### Requisitos del sistema:

- Construir automáticamente la imagen Docker y desplegar el contenedor.
- Administrar los microservicios existentes (listar, habilitar, deshabilitar y eliminar).
- La solución debe levantarse con un solo comando: `docker-compose up`

### Nuestro Abordaje

Diseñamos una arquitectura cliente-servidor para automatizar los procesos:

1. **Frontend (Dashboard):** Desarrollado en React para la interfaz de usuario donde se pega el código.

2. **Backend (Orquestador en Express.js):**

- **Plantillas base:** Diseñamos un Dockerfile y un servidor web genérico (para Node.js y Python) que garantizan que cualquier código inyectado exponga un puerto y retorne JSON.

- **Servicio Docker:** Usamos el módulo `child_process` de Node.js para que el backend ejecute comandos nativos en la terminal de forma invisible (`docker build, docker run, docker ps, docker rm`).

- **Flujo dinámico:** Al recibir una petición, el backend:
    - Crea una carpeta temporal única
    - Copia la plantilla correspondiente
    - Inyecta el código del usuario
    - Construye la imagen 
    - Levanta el contenedor aisladamente en un puerto disponible.


## Video Demostracion

**Falta esto**

## Diagrama de Arquitectura

**Falta esto**

## Estructura de carpetas

```
PROYECTOCONTENEDORES/
├── frontend/             # Dashboard en React.js
├── backend/              # Orquestador en Express
│   ├── templates/        # Plantillas base (Dockerfile, server.js, server.py)
│   │   ├── nodejs/
│   │   │   ├── Dockerfile
│   │   │   └── server.js
│   │   └── python/
│   │       ├── Dockerfile
│   │       └── server.js        
│   ├── python/
│   │    ├── Dockerfile
│   │    └── server.py
│   ├── src/
│   │   ├── config/       # Configuración global (ej. puertos iniciales)
│   │   │   └── docker.config.js
│   │   ├── controllers/  # Recibe la petición del dashboard y responde
│   │   │   └── microservices.controller.js
│   │   ├── routes/       # Rutas de la API (/api/services)
│   │   │   └── microservices.routes.js
│   │   └── services/     # Ejecuta comandos de Docker (build, run, stop, rm)
│   │       └── docker.service.js
│   ├── package.json
│   ├── index.js
│   └── Dockerfile        # Imagen del backend
├── docker-compose.yml    # Levanta frontend y backend con un comando 
└── README.md             # Documentación, diagrama y ejemplos
```

### Integrantes Grupo 8: 
- Claudia Elia Sierra
- Carlos Ruidiaz Mendoza
- Juan Fernandez Barrios
- Zenen Contreras Royero
