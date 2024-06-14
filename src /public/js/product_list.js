const socket = io.connect('http://localhost:8080');

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */
console.log("HOLA SOY PRODUCT LIST JS")
const token = localStorage.getItem("token");
console.log("Token:", token);

// Agregar un event listener para el evento click en el contenedor productList
// Esto hace que cualquier click dispara este evento, y dentro del evento manej
//document.getElementByClass('.btn-delete-product').addEventListener('click', handleDeleteProduct);

var everyDeleteProductBtn = document.getElementsByClassName("btn-delete-product")

for (var i = 0; i < everyDeleteProductBtn.length; i++) {
    everyDeleteProductBtn[i].addEventListener('click', handleDeleteProduct, false);
}

var everyUpdateProductBtn = document.getElementsByClassName("btn-update-product")

for (var i = 0; i < everyUpdateProductBtn.length; i++) {
    everyUpdateProductBtn[i].addEventListener('click', handleUpdateProduct, false);
}

function handleDeleteProduct(event) {

    const token = localStorage.getItem('token');

    if (!token) {
        console.log("Usuario no logueado o registrado");
        window.location.href = "http://localhost:8080/"
    }

    const userId = localStorage.getItem('userId');
    const cartId = localStorage.getItem('cartId');

    const productId = event.target.getAttribute('data-product-id');

    // Realizar una solicitud HTTP POST para agregar el producto al carrito
    const url = `http://localhost:8080/api/products/${productId}` 

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al querer borrar el producto del sistema');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto eliminado:', data);
            window.location.reload()
        })
        .catch(error => {
            console.error('Error al querer borrar el producto del sistema', error);
        });
}

function handleUpdateProduct(event) {

    const token = localStorage.getItem('token');

    if (!token) {
        console.log("Usuario no logueado o registrado");
        window.location.href = "http://localhost:8080/"
    }

    const userId = localStorage.getItem('userId');
    const cartId = localStorage.getItem('cartId');

    const productId = event.target.getAttribute('data-product-id');

    window.location.href = `http://localhost:8080/products/update/${productId}` 

}



