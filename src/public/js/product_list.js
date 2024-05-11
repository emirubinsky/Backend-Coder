import Cart from '../js/cartInMemory.js'

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */

const token = localStorage.getItem("token");
console.log("Token:", token);

// Agregar un event listener para el evento click en el contenedor productList
// Esto hace que cualquier click dispara este evento, y dentro del evento manej
//document.getElementByClass('.btn-add-to-cart').addEventListener('click', handleAddToCart);

var everyAddToCartButton = document.getElementsByClassName("btn-add-to-cart")

for (var i = 0; i < everyAddToCartButton.length; i++) {
    everyAddToCartButton[i].addEventListener('click', handleAddToCart, false);
}

function handleAddToCart(event){

    const productId = event.target.getAttribute('data-product-id');
    const name = event.target.getAttribute('data-product-name');

    const inMemoryProduct = {
        productId,
        name
    }

    Cart.addItemForUser(token, inMemoryProduct); // Assuming 'currentProduct' is the product being viewed
    alert('Product added to cart!');
}

function handleAddToCart_deprecated(event) {
    if (!event.target.classList.contains('cart-btn')) {
        return;
    }

    const productId = event.target.getAttribute('data-product-id');

    // Realizar una solicitud HTTP POST para agregar el producto al carrito
    fetch("http://localhost:8080/api/carts/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar el producto al carrito');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto agregado al carrito:', data);
        })
        .catch(error => {
            console.error('Error al agregar el producto al carrito:', error);
        });
}

const goToCartBtn = document.getElementById('goToCartBtn');

// Agregar un evento de clic al botón
goToCartBtn.addEventListener('click', (event) => {

    let cartId = event.target.getAttribute('data-cart-id');

    if(cartId === ''){
        cartId = -1
    }

    const currentInMemoryCart = Cart.getCartItemsForUser(token)

    console.log("currentInMemoryCart", currentInMemoryCart)

    // Construir la URL del carrito utilizando el ID seleccionado
    const cartUrl = `http://localhost:8080/cart/${cartId}`;
    // Redireccionar al usuario a la URL del carrito
    window.location.href = cartUrl;
});




