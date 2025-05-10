const socket = io();

// Manejar el envío del formulario
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturar los datos del formulario
    const formData = new FormData(event.target);
    const product = Object.fromEntries(formData.entries());

    // Validar que los campos no estén vacíos
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Enviar los datos al servidor mediante WebSocket
    socket.emit('addProduct', product);

    // Limpiar el formulario
    event.target.reset();
});

// Escuchar confirmación del servidor para agregar productos
socket.on('productAdded', (newProduct) => {
    const productList = document.getElementById('productList');
    const li = document.createElement('li');
    li.id = `product-${newProduct._id}`;
    li.innerHTML = `
        ${newProduct.title} - $${newProduct.price} - Stock: ${newProduct.stock}
        <button onclick="deleteProduct('${newProduct._id}')">Eliminar</button>
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