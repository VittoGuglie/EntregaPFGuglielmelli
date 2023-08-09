# Proyecto de API Ecommerce
## Descripción
Este proyecto consiste en la creación de una API para un sitio de comercio electrónico (ecommerce) como parte de los requisitos del Proyecto Final en la institución educativa Coderhouse.
## Primera Práctica
* Definición
* Componentes
## Segunda Entrega
* Profesionalizando la base de datos del proyecto
## Tercera entrega
* Mejorando la aquitectura del servidor
## Última entrega
* Profundizar de conceptos estrechamente relacionados con entregas pasadas.
### Definición
Construccion de una aplicacion para un proyecto final ecommerce.
### Componentes 
A continuación se presentan las principales dependencias utilizadas en el proyecto:
* Express: Un framework de aplicaciones web para Node.js que facilita la creación de API y rutas.
* Multer: Middleware para manejar la carga de archivos, útil para la gestión de imágenes de productos.
* Handlebars: Un motor de plantillas para generar vistas HTML de manera dinámica.
* Mongoose: Una biblioteca de modelado de objetos MongoDB para Node.js, que simplifica la interacción con la base de datos.
* JWT (JSON Web Tokens): Utilizado para la autenticación y autorización de usuarios en la API.

Entre muchas otras, estas son solo algunas de las dependencias clave que se utilizan en el proyecto.

## Módulos
El proyecto se divide en varios componentes que trabajan juntos para construir la API ecommerce:
* **Configuracion del servidor**: Inicialización y configuración de Express, configuración de middleware y manejo de errores.
* **Enrutador**: Definición de rutas y controladores correspondientes para las diversas funcionalidades de la API.
* **Modelos**: Definición de esquemas de datos utilizando Mongoose para representar los objetos en la base de datos.
* **DAO's (Data Access Objects)**: Capa de acceso a datos que interactúa con la base de datos a través de los modelos definidos.
* **Controladores**: Lógica de negocio y control de las solicitudes entrantes, procesamiento de datos y respuestas.
* **Config**: Configuraciones adicionales para módulos como autenticación, manejo de archivos, etc.

# Instalación y Uso
1. Clona este repositorio: `git clone https://github.com/VittoGuglie/entregable_proyecto_final_guglielmelli.git`
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en un archivo `.env` (si es necesario).
4. Inicia el servidor: `npm start`
# Pruebas
Se han incluido pruebas unitarias y de integración para garantizar el correcto funcionamiento de la API. Para ejecutar las pruebas, utiliza el siguiente comando: `npm test` que fue configurado con mocha y supertest. 
