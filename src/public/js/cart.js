const socket = io.connect('http://localhost:8080');

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

/* Boton para remover un producto del carrito */

// Agregar un event listener para el evento click en el contenedor productList
document.getElementById('cartList').addEventListener('click', handleDeleteProductCart);

// Función para eliminar un producto del carrito usando Fetch
async function deleteProductFromCart(cid, pid) {
    console.log("id del carrito:", cid);
    console.log("id del producto:", pid);

    try {
        const response = await fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log(`Producto con ID ${pid} eliminado del carrito ${cid}`);
        } else {
            console.error(`Error al eliminar el producto con ID ${pid} del carrito`);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
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
    } else {
        console.log(`No se encontró el producto con ID ${deleteProductCartId}`);
    }
});


/* Boton de retornar al paso anterior */ 

const returnToShoppingBtn = document.getElementById('returnToShopping');
returnToShoppingBtn.addEventListener('click', () => {
    
    // Construir la URL del carrito utilizando el ID seleccionado
    const shoppingUrl = `http://localhost:8080/products`;

    // Redireccionar al usuario a la URL del carrito
    window.location.href = shoppingUrl;
});


/* Boton de ir a confirmar la compra */ 

async function confirmCartToTicket(cid) {
    console.log("id del carrito:", cid);
    
    try {

        console.log({
            body:{
                cartId: cid
            }
        })

        const response = await fetch(`http://localhost:8080/api/tickets`, {
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
            console.log(`Creado el ticket a partir del del carrito ${cid}`);
        } else {
            console.error(`Algo ha pasado al intentar crear un Ticket`);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}