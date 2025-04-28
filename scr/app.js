import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { create } from 'express-handlebars';
import viewsRoutes from './routes/viewsRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import cartsRoutes from './routes/cartsRoutes.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;
const server = createServer(app);
const io = new Server(server);
const productManager = new ProductManager();

// Configuración de express-handlebars
const hbs = create({
    extname: '.handlebars',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './scr/views');

// Middleware para manejar JSON y datos URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('scr/public'));

// Rutas
app.use('/', viewsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar la adición de productos
    socket.on('addProduct', async (product) => {
        try {
            const newProduct = await productManager.addProduct(product);
            io.emit('productAdded', newProduct); // Notificar a todos los clientes
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Manejar la eliminación de productos
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            io.emit('productDeleted', productId); // Notificar a todos los clientes
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});

// Compartir instancia de WebSocket con las rutas
app.set('io', io);

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});