# Práctica 7: Formulario Web con Docker Compose, AngularJS y MySQL

Esta es una aplicación web "Hola Mundo" funcional que consiste en un formulario de registro y visualización de contactos conectado a una base de datos MySQL, orquestado completamente mediante **Docker Compose**.

## Tecnologías Utilizadas

* **Frontend:** HTML5, Tailwind CSS y AngularJS (v1.8.2).
* **Backend:** Node.js (Express).
* **Base de Datos:** MySQL (v8.0).
* **Contenedores:** Docker y Docker Compose.

---

## Estructura del Proyecto

```text
├── db/
│   └── init.sql          # Inicialización automatizada de la base de datos
├── src/
│   ├── Dockerfile        # Definición del contenedor de la aplicación
│   ├── package.json      # Dependencias del servidor Node.js
│   ├── server.js         # Servidor Express con endpoints de API
│   └── index.html        # Interfaz de usuario del formulario
├── docker-compose.yml    # Orquestación de servicios (web y db)
└── README.md             # Instrucciones del proyecto
```

---

## Requisitos Previos

* Tener instalado **Docker Desktop** en tu máquina y en ejecución.

---

## Cómo Ejecutar la Aplicación

1. Clona este repositorio o ubícate en el directorio del proyecto.
2. Levanta los contenedores con el siguiente comando en la terminal:
   ```bash
   docker compose up --build -d
   ```
3. Una vez finalice la compilación y arranque de servicios, abre tu navegador y entra en:
   👉 **[http://localhost:8081](http://localhost:8081)**

---

## Notas de Configuración de Puertos

Para evitar colisiones con bases de datos locales u otros servidores web en la máquina anfitriona, los puertos se mapearon de la siguiente manera:
* **Aplicación Web (Express):** Acceso en el puerto **`8081`** (interno en el contenedor `8080`).
* **Base de Datos (MySQL):** Acceso en el puerto **`3307`** (interno en el contenedor `3306`).
