const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    constructor() {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
    }

    async getProducts() {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = (products.length + 1).toString();
        products.push(product);
        await fs.promises.writeFile(filePath, JSON.stringify(products, null, 2));
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updatedFields };
        await fs.promises.writeFile(filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(product => product.id !== id);
        await fs.promises.writeFile(filePath, JSON.stringify(filteredProducts, null, 2));
        return filteredProducts;
    }
}

module.exports = ProductManager;