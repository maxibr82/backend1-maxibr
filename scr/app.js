import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { create } from 'express-handlebars';
import connectDB from './config/db.js';
import viewsRoutes from './routes/viewsRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import cartsRoutes from './routes/cartsRoutes.js';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app);
const io = new Server(server);

// Conectar a la base de datos
connectDB();

// Configuración de express-handlebars
const hbs = create({
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './scr/views');

// Middleware
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

    socket.on('addProduct', async (product) => {
        try {
            const newProduct = await Product.create(product);
            io.emit('productAdded', newProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            io.emit('productDeleted', productId);
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