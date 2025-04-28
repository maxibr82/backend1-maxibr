import fs from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/products.json');
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error al leer el archivo products.json:', err);
            return [];
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();

            // Validar que el código del producto sea único
            if (products.some(p => p.code === product.code)) {
                throw new Error(`El código de producto "${product.code}" ya existe.`);
            }

            // Generar un nuevo ID único
            const newId = products.length > 0 ? (parseInt(products[products.length - 1].id) + 1).toString() : '1';
            const newProduct = { id: newId, ...product };

            // Agregar el nuevo producto al array
            products.push(newProduct);

            // Guardar en el archivo JSON
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (err) {
            console.error('Error al agregar el producto:', err.message);
            throw new Error('No se pudo agregar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();

            // Convertir el ID a cadena para asegurar la comparación correcta
            const productIndex = products.findIndex((product) => product.id === id.toString());
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            // Eliminar el producto del array
            const deletedProduct = products.splice(productIndex, 1)[0];

            // Guardar los cambios en el archivo JSON
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));

            return deletedProduct;
        } catch (err) {
            console.error('Error al eliminar el producto:', err.message);
            throw new Error('No se pudo eliminar el producto');
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();

            // Convertir el ID a cadena para asegurar la comparación correcta
            const productIndex = products.findIndex((product) => product.id === id.toString());
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            // Validar que los campos actualizados sean válidos
            const validFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
            Object.keys(updatedFields).forEach((key) => {
                if (!validFields.includes(key)) {
                    throw new Error(`El campo "${key}" no es válido`);
                }
            });

            // Actualizar las propiedades del producto
            const updatedProduct = { ...products[productIndex], ...updatedFields };
            products[productIndex] = updatedProduct;

            // Guardar los cambios en el archivo JSON
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));

            return updatedProduct;
        } catch (err) {
            console.error('Error al actualizar el producto:', err.message);
            throw new Error('No se pudo actualizar el producto');
        }
    }
}

export default ProductManager;