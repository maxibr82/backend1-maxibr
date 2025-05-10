import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Obtener productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Construir el filtro de búsqueda
        const filter = query ? { category: { $regex: query, $options: 'i' } } : {};

        // Construir las opciones de paginación
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        // Usar mongoose-paginate-v2
        const result = await Product.paginate(filter, options);

        // Responder con el formato solicitado
        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}`
                : null,
            nextLink: result.hasNextPage
                ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}`
                : null,
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos', error: err.message });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        req.app.get('io').emit('productAdded', newProduct); // Emitir evento WebSocket
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        req.app.get('io').emit('productDeleted', deletedProduct); // Emitir evento WebSocket
        res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;