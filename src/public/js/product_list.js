const socket = io.connect(ORGANICA_BASE_URL);

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
        window.location.href = `${ORGANICA_BASE_URL}`+"/"
    }

    const userId = localStorage.getItem('userId');
    const cartId = localStorage.getItem('cartId');

    const productId = event.target.getAttribute('data-product-id');

    // Realizar una solicitud HTTP POST para agregar el producto al carrito
    const url = `${ORGANICA_BASE_URL}/api/products/${productId}` 

    showLoading();
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
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
            console.log('Producto eliminado:', data);
            showCustomAlert({
                type: 'success',
                message: `Producto eliminado correctamente.`
            })
            window.location.reload()
        })
        .catch(error => {
            console.error('Error al querer borrar el producto del sistema', error);
            showCustomAlert({
                type: 'error',
                message: `Error al querer borrar el producto del sistema`,
                stack: error
            })
        })
        .finally(() => hideLoading());
}

function handleUpdateProduct(event) {

    const token = localStorage.getItem('token');

    if (!token) {
        console.log("Usuario no logueado o registrado");
        showCustomAlert({
            type: 'warning',
            message: `Usuario no logueado o registrado`,
            stack: error
        })
        window.location.href = `${ORGANICA_BASE_URL}`+"/"
    }

    const userId = localStorage.getItem('userId');
    const cartId = localStorage.getItem('cartId');

    const productId = event.target.getAttribute('data-product-id');

    window.location.href = `${ORGANICA_BASE_URL}/products/update/${productId}` 

}



