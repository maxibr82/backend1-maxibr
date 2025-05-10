import Product from '../models/Product.js';

class ProductManager {
    async getProducts() {
        try {
            return await Product.find(); // Obtener todos los productos desde MongoDB
        } catch (err) {
            console.error('Error al obtener los productos:', err);
            throw new Error('No se pudieron obtener los productos');
        }
    }

    async addProduct(product) {
        try {
            return await Product.create(product); // Crear un nuevo producto en MongoDB
        } catch (err) {
            console.error('Error al agregar el producto:', err.message);
            throw new Error('No se pudo agregar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id); // Eliminar producto por ID
            if (!deletedProduct) throw new Error('Producto no encontrado');
            return deletedProduct;
        } catch (err) {
            console.error('Error al eliminar el producto:', err.message);
            throw new Error('No se pudo eliminar el producto');
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) throw new Error('Producto no encontrado');
            return updatedProduct;
        } catch (err) {
            console.error('Error al actualizar el producto:', err.message);
            throw new Error('No se pudo actualizar el producto');
        }
    }
}

export default ProductManager;