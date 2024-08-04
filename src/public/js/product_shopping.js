const socket = io.connect('http://localhost:8080');

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */
console.log("HOLA SOY PRODUCT SHOPPING JS")
const token = localStorage.getItem("token");
console.log("Token:", token);

// Agregar un event listener para el evento click en el contenedor productList
// Esto hace que cualquier click dispara este evento, y dentro del evento manej
//document.getElementByClass('.btn-add-to-cart').addEventListener('click', handleAddToCart);

var everyDeleteProductBtn = document.getElementsByClassName("btn-add-to-cart")

for (var i = 0; i < everyDeleteProductBtn.length; i++) {
    everyDeleteProductBtn[i].addEventListener('click', handleAddToCart, false);
}

function handleAddToCart(event) {

    const token = localStorage.getItem('token');

    if (!token) {
        console.log("Usuario no logueado o registrado");
        showCustomAlert({
            type: 'warning',
            message: `Usuario no logueado o registrado`,
            stack: error
        })
        window.location.href = "http://localhost:8080/"
    }

    const userId = localStorage.getItem('userId');
    const cartId = localStorage.getItem('cartId');

    const productId = event.target.getAttribute('data-product-id');
    const quantity = 1

    // Realizar una solicitud HTTP POST para agregar el producto al carrito
    const url = `http://localhost:8080/api/carts/${cartId}/products/${productId}`

    showLoading();
    fetch(url, {
        method: 'PUT',
        headers: {
            "authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, cartId, productId, quantity })
    })
        .then(response => {
            if (!response.ok) {

                return response.json().then(badResult => {
                    throw new Error(badResult.details);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto agregado al carrito:', data);
            showCustomAlert({
                type: 'success',
                message: `Producto agregado al carrito correctamente.`
            })
        })
        .catch(error => {
            console.error('Error al agregar el producto al carrito:', error);
            showCustomAlert({
                type: 'error',
                message: `Error al agregar el producto al carrito`,
                stack: error
            })
        })
        .finally(() => hideLoading());
}


/* Boton de ir al carrito */

const goToCartBtn = document.getElementById('goToCartBtn');
goToCartBtn.addEventListener('click', () => {
    const cartId = localStorage.getItem('cartId')

    // Construir la URL del carrito utilizando el ID seleccionado
    const cartUrl = `http://localhost:8080/cart/${cartId}`;

    // Redireccionar al usuario a la URL del carrito
    window.location.href = cartUrl;
});
