document.getElementById('add-to-cart-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cartId = document.getElementById('cart-id').value;
    const productId = document.getElementById('product-id').value;

    try {
        const response = await fetch(`/api/carts/${cartId}/${productId}`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto al carrito');
        }

        const updatedCart = await response.json();
        updateCartView(updatedCart);
    } catch (error) {
        console.error(error.message);
        alert('No se pudo agregar el producto al carrito');
    }
});

function updateCartView(cart) {
    const cartProductsList = document.getElementById('cart-products');
    cartProductsList.innerHTML = '';

    cart.products.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.product.title}</strong> - Cantidad: ${item.quantity}`;
        cartProductsList.appendChild(li);
    });
}