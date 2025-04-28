# README.md

# Proyecto de Backend con Handlebars y WebSocket

Este proyecto es una aplicación backend que utiliza Express como servidor, Handlebars como motor de plantillas y Socket.IO para manejar la comunicación en tiempo real. La aplicación permite gestionar productos y carritos de compra, y proporciona una interfaz para agregar productos y verlos en tiempo real.

## Estructura del Proyecto

```
backend1
├── practico 2
│   ├── scr
│   │   ├── data
│   │   │   ├── carts.json
│   │   │   └── products.json
│   │   ├── managers
│   │   │   ├── CartManager.js
│   │   │   └── ProductManager.js
│   │   ├── public
│   │   │   ├── css
│   │   │   │   └── styles.css
│   │   │   └── js
│   │   │       └── client.js
│   │   ├── routes
│   │   │   ├── cartsRoutes.js
│   │   │   ├── productsRoutes.js
│   │   │   └── viewsRoutes.js
│   │   ├── views
│   │   │   ├── layouts
│   │   │   │   └── main.handlebars
│   │   │   ├── home.handlebars
│   │   │   └── realTimeProducts.handlebars
│   │   └── app.js
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
```

## Instalación

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias necesarias.

## Dependencias

- Express: Framework para construir aplicaciones web.
- Handlebars: Motor de plantillas para renderizar vistas.
- Socket.IO: Biblioteca para la comunicación en tiempo real.

## Uso

1. Inicia el servidor ejecutando `npm start`.
2. Accede a `http://localhost:8080/realtimeproducts` para ver la vista en tiempo real de productos.
3. Accede a `http://localhost:8080/` para ver la lista de productos agregados.

## Funcionalidades

- Agregar productos a través de un formulario en la vista de productos en tiempo real.
- Ver la lista de productos actualizada en tiempo real mediante WebSocket.
- Listar todos los productos en la vista principal.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.