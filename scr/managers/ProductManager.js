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

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id.toString());
        } catch (err) {
            console.error('Error al buscar el producto por ID:', err);
            return null;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newProduct = {
                id: (products.length + 1).toString(),
                ...product
            };
            products.push(newProduct);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (err) {
            console.error('Error al agregar el producto:', err);
            throw new Error('No se pudo agregar el producto');
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id.toString());
            if (index === -1) return null;

            products[index] = { ...products[index], ...updatedFields };

            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[index];
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            throw new Error('No se pudo actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id.toString());
            if (index === -1) return null;

            const deletedProduct = products.splice(index, 1)[0];
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return deletedProduct;
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
            throw new Error('No se pudo eliminar el producto');
        }
    }
}

export default ProductManager;