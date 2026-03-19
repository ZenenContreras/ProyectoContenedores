# Proyecto Contenedores 


## Estructura de carpetas

```
PROYECTOCONTENEDORES/
├── frontend/             # Dashboard en React.js
├── backend/              # Orquestador en Express
│   ├── templates/        # Plantillas base (Dockerfile, server.js, server.py)
│   ├── nodejs/
│   │   ├── Dockerfile
│   │   └── server.js
│   └── python/
│       ├── Dockerfile
│       └── server.py
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