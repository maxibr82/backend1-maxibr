# Proyecto de Backend con Handlebars y WebSocket

Este proyecto es una aplicación backend que utiliza Express como servidor, Handlebars como motor de plantillas y Socket.IO para manejar la comunicación en tiempo real. La aplicación permite gestionar productos y carritos de compra, y proporciona una interfaz para agregar productos y verlos en tiempo real.

---

## Estructura del Proyecto

```
backend1
├── scr
│   ├── config
│   │   └── db.js
│   ├── managers
│   │   ├── CartManager.js
│   │   └── ProductManager.js
│   ├── models
│   │   ├── Cart.js
│   │   └── Product.js
│   ├── public
│   │   ├── css
│   │   │   └── styles.css
│   │   └── js
│   │       ├── cart.js
│   │       └── client.js
│   ├── routes
│   │   ├── cartsRoutes.js
│   │   ├── productsRoutes.js
│   │   └── viewsRoutes.js
│   ├── views
│   │   ├── layouts
│   │   │   └── main.handlebars
│   │   ├── cart.handlebars
│   │   ├── carts.handlebars
│   │   ├── home.handlebars
│   │   └── realTimeProducts.handlebars
│   └── app.js
├── .env
├── package.json
├── README.md
└── tsconfig.json
```

> **Nota**: La carpeta `config` contiene la configuración de la base de datos MongoDB. La carpeta `models` define los esquemas de Mongoose para productos y carritos.

---

## Instalación

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias necesarias.

---

## Dependencias

- **Express**: Framework para construir aplicaciones web.
- **Handlebars**: Motor de plantillas para renderizar vistas.
- **Socket.IO**: Biblioteca para la comunicación en tiempo real.
- **Mongoose**: ODM para interactuar con MongoDB.
- **mongoose-paginate-v2**: Plugin para manejar la paginación en MongoDB.

---

## Uso

1. Inicia el servidor ejecutando `npm start`.  
-Servidor escuchando en el puerto 8080
-Nuevo cliente conectado
-Conexión a MongoDB exitosa
2. Accede a las siguientes rutas para interactuar con la API:
3. http://localhost:8080
4. http://localhost:8080/realtimeproducts
---

## Rutas de Productos y Carritos (Postman)

### Productos

#### 1. **Obtener todos los productos con paginación**
- **Método**: `GET`
- **URL**: `http://localhost:8080/api/products`
- **Parámetros opcionales**:
  - `page`: Número de página (por defecto: 1).
  - `limit`: Cantidad de productos por página (por defecto: 10).
  - `sort`: Ordenar por precio (`asc` o `desc`).
  - `query`: Filtro por categoría.
- **Ejemplo**:
  ```
  http://localhost:8080/api/products?page=2&limit=5&sort=asc&query=iphone
  ```
- **Respuesta esperada**:
  ```json
  {
      "status": "success",
      "payload": [...],
      "totalPages": 3,
      "prevPage": 1,
      "nextPage": 3,
      "page": 2,
      "hasPrevPage": true,
      "hasNextPage": true,
      "prevLink": "http://localhost:8080/api/products?page=1&limit=5&sort=asc&query=iphone",
      "nextLink": "http://localhost:8080/api/products?page=3&limit=5&sort=asc&query=iphone"
  }
  ```

#### 2. **Agregar un nuevo producto**
- **Método**: `POST`
- **URL**: `http://localhost:8080/api/products`
- **Cuerpo** (JSON):
  ```json
  {
      "title": "iPhone 14",
      "description": "Nuevo modelo de iPhone",
      "code": "IP0014",
      "price": 1500,
      "stock": 30,
      "category": "iphone"
  }
  ```
- **Respuesta esperada**:
  ```json
  {
      "status": "success",
      "product": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "title": "iPhone 14",
          "description": "Nuevo modelo de iPhone",
          "code": "IP0014",
          "price": 1500,
          "stock": 30,
          "category": "iphone",
          "__v": 0
      }
  }
  ```

#### 3. **Actualizar un producto**
- **Método**: `PUT`
- **URL**: `http://localhost:8080/api/products/:id`
- **Cuerpo** (JSON):
  ```json
  {
      "price": 1400,
      "stock": 25
  }
  ```
- **Respuesta esperada**:
  ```json
  {
      "message": "Producto actualizado correctamente",
      "product": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "title": "iPhone 14",
          "description": "Nuevo modelo de iPhone",
          "code": "IP0014",
          "price": 1400,
          "stock": 25,
          "category": "iphone",
          "__v": 0
      }
  }
  ```

#### 4. **Eliminar un producto**
- **Método**: `DELETE`
- **URL**: `http://localhost:8080/api/products/:id`
- **Respuesta esperada**:
  ```json
  {
      "message": "Producto eliminado correctamente",
      "product": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "title": "iPhone 14",
          "description": "Nuevo modelo de iPhone",
          "code": "IP0014",
          "price": 1400,
          "stock": 25,
          "category": "iphone",
          "__v": 0
      }
  }
  ```

---

### Carritos

#### 1. **Crear un carrito**
- **Método**: `POST`
- **URL**: `http://localhost:8080/api/carts`
- **Respuesta esperada**:
  ```json
  {
      "status": "success",
      "cart": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "products": [],
          "__v": 0
      }
  }
  ```

#### 2. **Agregar un producto al carrito**
- **Método**: `POST`
- **URL**: `http://localhost:8080/api/carts/:cid/product/:pid`
- **Respuesta esperada**:
  ```json
  {
      "status": "success",
      "cart": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "products": [
              {
                  "product": "64b1c2d3e4f5g6h7i8j9k0l2",
                  "quantity": 1
              }
          ],
          "__v": 0
      }
  }
  ```

#### 3. **Eliminar un producto del carrito**
- **Método**: `DELETE`
- **URL**: `http://localhost:8080/api/carts/:cid/products/:pid`
- **Respuesta esperada**:
  ```json
  {
      "status": "success",
      "cart": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "products": [],
          "__v": 0
      }
  }
  ```

#### 4. **Actualizar todos los productos del carrito**
- **Método**: `PUT`
- **URL**: `http://localhost:8080/api/carts/:cid`
- **Cuerpo** (JSON):
  ```json
  {
      "products": [
          { "product": "64b1c2d3e4f5g6h7i8j9k0l2", "quantity": 2 },
          { "product": "64b1c2d3e4f5g6h7i8j9k0l3", "quantity": 1 }
      ]
  }
  ```
- **Respuesta esperada**:
  ```json
  {
      "status": "success",
      "cart": {
          "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
          "products": [
              { "product": "64b1c2d3e4f5g6h7i8j9k0l2", "quantity": 2 },
              { "product": "64b1c2d3e4f5g6h7i8j9k0l3", "quantity": 1 }
          ],
          "__v": 0
      }
  }
  ```

#### 5. **Actualizar todos la cantidad de produtos en el carrito**

Endpoint: PUT /api/carts/:cid/products/:pid
URL: http://localhost:8080/api/carts/:cid/products/:pid

Reemplaza :cid con el ID del carrito.
Reemplaza :pid con el ID del producto.
Cuerpo (JSON):

{
    "quantity": 3
}


- **Respuesta esperada**:

{
    "status": "success",
    "cart": {
        "_id": "64b1c2d3e4f5g6h7i8j9k0l1",
        "products": [
            {
                "product": "64b1c2d3e4f5g6h7i8j9k0l2",
                "quantity": 3
            }
        ],
        "__v": 0
    }
}

---

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request.

---

## Licencia

Este proyecto está bajo la Licencia MIT.