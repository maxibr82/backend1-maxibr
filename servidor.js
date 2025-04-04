const express = require('express');
const productsRoutes = require('./scr/routes/productsRoutes');
const cartsRoutes = require('./scr/routes/cartsRoutes');

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});