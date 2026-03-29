# Proyecto Contenedores — Con Proxy (Traefik)

> Esta rama implementa la plataforma con **Traefik** como proxy inverso. Todos los microservicios son accesibles desde el puerto 80 a través de rutas limpias (`/ms/{nombre}/`) sin necesidad de gestionar puertos manualmente.
>
> Para ver la versión sin proxy, consulta la rama `main`.

---

## Descripción del Proyecto

Plataforma basada en Docker y Docker Compose para crear, administrar y eliminar microservicios dinámicamente a través de un dashboard web. El usuario pega código fuente directamente en la interfaz, selecciona el lenguaje, y la plataforma construye y despliega automáticamente un contenedor Docker con un endpoint HTTP listo para usar.

### Características de cada microservicio
- Aplicación independiente empaquetada en su propio contenedor Docker.
- Expone un endpoint HTTP que recibe parámetros y retorna JSON.
- Se crea dinámicamente desde la interfaz web sin reiniciar la plataforma.
- Soporta Python (Flask) y Node.js (Express).

---

## Nuestro Abordaje

Diseñamos una arquitectura de cuatro componentes que trabajan juntos:

1. **Frontend (Dashboard):** Desarrollado en React + TypeScript con Vite. Permite crear microservicios, listar los existentes, iniciarlos, detenerlos y eliminarlos.

2. **Backend (Orquestador en Express.js):** Recibe las peticiones del dashboard y gestiona el ciclo de vida de los contenedores usando `child_process` para ejecutar comandos Docker nativos (`docker build`, `docker run`, `docker stop`, `docker rm`).

3. **Plantillas base:** Un servidor web genérico para cada lenguaje (Python/Flask y Node.js/Express) que envuelve el código del usuario en una función `handler`, garantizando que cualquier código inyectado exponga un endpoint HTTP y retorne JSON.

4. **Traefik (Proxy Inverso):** Actúa como punto de entrada único en el puerto 80. Detecta automáticamente los contenedores nuevos mediante labels de Docker y les asigna rutas limpias del tipo `/ms/{nombre}/`. Elimina la necesidad de gestionar puertos manualmente.

### Flujo dinámico

Al recibir una petición de creación, el backend:
1. Crea una carpeta temporal única para el microservicio
2. Copia la plantilla correspondiente al lenguaje seleccionado
3. Inyecta el código del usuario dentro de la función `handler`
4. Construye la imagen Docker con `docker build`
5. Levanta el contenedor con labels de Traefik para enrutamiento automático
6. El microservicio queda disponible en `http://localhost/ms/{nombre}/`

---

## Diagrama de Arquitectura

![Diagrama de Arquitectura del sistema](diagramas/Arquitectura.png)

---

## Requisitos Previos

- Docker Desktop instalado y en ejecución
- Git

---

## Ejecución del Proyecto

1. Asegurarse de tener **Docker Desktop** ejecutándose en tu sistema.
2. Abre una terminal en la raiz del proyecto (donde está el `docker-compose.yml`).
3. Ejecuta el siguiente comando:
```bash
docker-compose up
```
(Nota: Para forzar la reconstrucción de imágenes tras cambios locales usa: `docker-compose up --build`)

4. Una vez listos los contenedores, accede al Dashboard web en: `http://localhost/`
5. *(Opcional)* El dashboard de Traefik también se enciende en: `http://localhost:8080/`

---

## Estructura de Carpetas

```
PROYECTOCONTENEDORES/
├── frontend/                   # Dashboard en React + TypeScript
│   ├── src/
│   │   ├── components/         # Componentes React (formulario, lista)
│   │   ├── services/           # Llamadas a la API del backend
│   │   ├── store/              # Estado global con Zustand
│   │   └── types/              # Tipos TypeScript
│   └── Dockerfile
├── backend/                    # Orquestador en Express.js
│   ├── templates/              # Plantillas base por lenguaje
│   │   ├── nodejs/
│   │   │   ├── Dockerfile
│   │   │   ├── server.js
│   │   │   └── package.json
│   │   └── python/
│   │       ├── Dockerfile
│   │       ├── server.py
│   │       └── requirements.txt
│   ├── src/
│   │   ├── config/             # Configuración global
│   │   ├── controllers/        # Lógica de cada endpoint
│   │   ├── routes/             # Rutas de la API
│   │   └── services/           # Comandos Docker
│   └── Dockerfile
├── docker-compose.yml          # Orquesta frontend, backend y Traefik
└── README.md
```

---

## Pruebas de la API

Se puede usar Postman, Thunder Client o cURL apuntando a `http://localhost/api/microservices`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/microservices` | Crear microservicio (body: `name`, `language`, `code`) |
| `GET` | `/api/microservices` | Listar todos los microservicios |
| `POST` | `/api/microservices/:id/start` | Iniciar un microservicio detenido |
| `POST` | `/api/microservices/:id/stop` | Detener un microservicio |
| `DELETE` | `/api/microservices/:id` | Eliminar un microservicio |

![diagrama de secuencia para hacer un nuevo microservicio](diagramas/Nuevo-Microservicio.png)

---

## Ejemplos para Probar

Ejemplos funcionales listos para copiar y pegar en la plataforma al momento de crear un servicio

### 1. Hola Mundo (Python)
Seleccionar lenguaje: **Python**
```python
def hola():
    return "Hola Mundo"

return hola()
```

### 2. Suma de dos valores (Python)
Seleccionar lenguaje: **Python** 
```python
def sumar():
    # Obtener parámetros desde la URL (http://localhost/ms/suma/?a=10&b=20)

    a = request.args.get('a', default=0, type=int)
    b = request.args.get('b', default=0, type=int)
    resultado = a + b
    return f"La suma de {a} y {b} es: {resultado}"

return sumar()
```

### 3. Suma de dos valores (Node.js)
Seleccionar lenguaje: **Node.js**
```javascript
// Obtener parámetros desde la URL (http://localhost/ms/suma/?a=10&b=20)
const a = parseInt(query.a || 0);
const b = parseInt(query.b || 0);
const resultado = a + b;

return `La suma de ${a} y ${b} es: ${resultado}`;
```

---

## Integrantes Grupo 8
- Claudia Elias Sierra
- Carlos Ruidiaz Mendoza
- Juan Fernandez Barrios
- Zenen Contreras Royero
