const socket = io.connect(ORGANICA_BASE_URL);

// const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

/* Boton para remover un producto del carrito */

// Agregar un event listener para el evento click en el contenedor productList
document.getElementById('cartList').addEventListener('click', handleDeleteProductCart);

// Función para eliminar un producto del carrito usando Fetch
async function deleteProductFromCart(cid, pid) {
    const token = localStorage.getItem('token');

    console.log("id del carrito:", cid);
    console.log("id del producto:", pid);

    try {
        showLoading();
        const response = await fetch(`${ORGANICA_BASE_URL}/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            hideLoading()
            console.log(`Producto con ID ${pid} eliminado del carrito ${cid}`);
            showCustomAlert({
                type: 'success',
                message: `Producto con ID ${pid} eliminado del carrito ${cid}`
            })
            window.location.reload()

        } else {
            hideLoading()
            console.error(`Error al eliminar el producto con ID ${pid} del carrito`);
            showCustomAlert({
                type: 'error',
                message: `Error al eliminar el producto con ID ${pid} del carrito`,
                stack: response
            })
        }
    } catch (error) {
        console.error('Error de red:', error);
        showCustomAlert({
            type: 'error',
            message: `Error generico`,
            stack: error
        })
    } finally {
        hideLoading()
    }
}

// Función para eliminar un producto del carrito usando Fetch
async function modifyQuantity(cid, pid, quantityExtra) {
    console.log("id del carrito:", cid);
    console.log("id del producto:", pid);
    console.log("id del producto:", quantityExtra);

    const incrementado = quantityExtra > 0

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const cartId = cid//localStorage.getItem('cartId');

    const productId = pid//event.target.getAttribute('data-product-id');
    const quantityNow = parseInt(event.target.getAttribute('data-product-qty'));
    const quantity = quantityNow + quantityExtra

    showLoading();

    fetch(`${ORGANICA_BASE_URL}/api/carts/${cid}/products/${pid}`, {
        method: 'PUT',
        headers: {
            "authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, cartId, productId, quantity, replace: true })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(badResult => {
                    throw new Error(badResult.details);
                });
            }


            hideLoading()
            console.log(`Producto con ID ${pid} ${incrementado ? 'incrementado' : 'reducido'} en el carrito ${cid}`);
            showCustomAlert({
                type: 'success',
                message: `Producto con ID ${pid} ${incrementado ? 'incrementado' : 'reducido'} en el carrito ${cid}`
            })
            window.location.reload()
        })

        .catch(error => {
            console.error('Error de red:', error);
            showCustomAlert({
                type: 'error',
                message: `Error al intentar: Producto con ID ${pid} ${incrementado ? 'incrementado' : 'reducido'} en el carrito ${cid}`,
                stack: error
            })
        })
        .finally(() => hideLoading());



}

// Función para manejar el evento de hacer clic en el botón "Eliminar Producto"
function handleDeleteProductCart(event) {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const productId = event.target.getAttribute('data-product-id');

    // Emitir el evento "deleteProductCart" al servidor con el ID del producto a eliminar
    socket.emit('deleteProductCart', productId);
}

// Manejar el evento de producto borrado desde el servidor
socket.on('deleteProductCart', (deleteProductCartId) => {
    // Eliminar el producto del DOM
    const cartElement = document.querySelector(`[data-product-id="${deleteProductCartId}"]`);
    if (cartElement) {
        cartElement.parentElement.parentElement.remove();
        console.log(`Producto con ID ${deleteProductCartId} eliminado`);
        showCustomAlert({
            type: 'success',
            message: `Producto con ID ${pid} eliminado del carrito ${cid}`
        })
    } else {
        console.log(`No se encontró el producto con ID ${deleteProductCartId}`);
        showCustomAlert({
            type: 'warning',
            message: `No se encontró el producto con ID ${deleteProductCartId}`
        })
    }
});


/* Boton de retornar al paso anterior */

const returnToShoppingBtn = document.getElementById('returnToShopping');
returnToShoppingBtn.addEventListener('click', () => {

    // Construir la URL del carrito utilizando el ID seleccionado
    const shoppingUrl = `${ORGANICA_BASE_URL}/products`;

    // Redireccionar al usuario a la URL del carrito
    window.location.href = shoppingUrl;
});


/* Boton de ir a confirmar la compra */

async function confirmCartToTicket(cid) {
    console.log("id del carrito:", cid);

    console.log({
        body: {
            cartId: cid
        }
    })

    const token = localStorage.getItem('token');

    showLoading()

    fetch(`${ORGANICA_BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: {
            "authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cartId: cid
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(badResult => {
                    throw new Error(badResult.details);
                });
            }

            hideLoading()
            console.log(`Creado el ticket a partir del del carrito ${cid}`);
            showCustomAlert({
                type: 'success',
                message: `Creado el ticket a partir del del carrito ${cid}`
            })

            // Construir la URL del carrito utilizando el ID seleccionado
            const ticketsUrl = `${ORGANICA_BASE_URL}/tickets`;

            // Redireccionar al usuario a la URL del carrito
            window.location.href = ticketsUrl;
        })

        .catch(error => {
            console.error('Algo ha pasado al intentar crear un Ticket', error);
            showCustomAlert({
                type: 'error',
                message: `Algo ha pasado al intentar crear un Ticket`,
                stack: error
            })
        })
        .finally(() => hideLoading());
}

async function confirmCartToTicketOld(cid) {
    console.log("id del carrito:", cid);

    try {

        const token = localStorage.getItem('token');

        console.log({
            body: {
                cartId: cid
            }
        })

        showLoading()
        const response = await fetch(`${ORGANICA_BASE_URL}/api/tickets`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartId: cid
            })
        });

        if (response.ok) {
            hideLoading()
            console.log(`Creado el ticket a partir del del carrito ${cid}`);
            showCustomAlert({
                type: 'success',
                message: `Creado el ticket a partir del del carrito ${cid}`
            })

            // Construir la URL del carrito utilizando el ID seleccionado
            const ticketsUrl = `${ORGANICA_BASE_URL}/tickets`;

            // Redireccionar al usuario a la URL del carrito
            window.location.href = ticketsUrl;
        } else {
            hideLoading()
            console.error(`Algo ha pasado al intentar crear un Ticket`);
            showCustomAlert({
                type: 'warning',
                message: `Algo ha pasado al intentar crear un Ticket`,
                stack: response
            })
        }
    } catch (error) {
        showCustomAlert({
            type: 'error',
            message: `Error generico`,
            stack: error
        })
    } finally {
        hideLoading()
    }
}