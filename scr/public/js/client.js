const socket = io();

// Manejar el envío del formulario
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturar los datos del formulario
    const title = document.querySelector('input[name="title"]').value;
    const description = document.querySelector('input[name="description"]').value;
    const code = document.querySelector('input[name="code"]').value;
    const price = parseFloat(document.querySelector('input[name="price"]').value);
    const stock = parseInt(document.querySelector('input[name="stock"]').value);

    // Validar que los campos no estén vacíos
    if (!title || !description || !code || isNaN(price) || isNaN(stock)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Enviar los datos al servidor mediante WebSocket
    socket.emit('addProduct', { title, description, code, price, stock });

    // Limpiar el formulario
    event.target.reset();
});

// Escuchar confirmación del servidor para agregar productos
socket.on('productAdded', (newProduct) => {
    const productList = document.getElementById('productList');
    const li = document.createElement('li');
    li.id = `product-${newProduct.id}`;
    li.innerHTML = `
        ${newProduct.title} - $${newProduct.price} - Stock: ${newProduct.stock}
        <button onclick="deleteProduct('${newProduct.id}')">Eliminar</button>
    `;
    productList.appendChild(li);
});

// Escuchar confirmación del servidor para eliminar productos
socket.on('productDeleted', (deletedProductId) => {
    const productElement = document.getElementById(`product-${deletedProductId}`);
    if (productElement) {
        productElement.remove();
    }
});

// Función para eliminar un producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}