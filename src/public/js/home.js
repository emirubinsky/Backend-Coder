// const socket = io.connect('http://localhost:8080');
// socket.emit('message', 'Se ha conectado el websocket');


console.log("SOY HOME!");

function onLoad() {
    const userId = localStorage.getItem("userId")

    fetch('http://localhost:8080/api/carts/user', {
        method: 'POST',
        body: JSON.stringify({
            user: userId
        }),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        }
    })
        .then(response => {
            if (response.status === 200) {
                // La respuesta exitosa
                return response.json();
            } else {
                console.log("hubo un error")
                // Si la respuesta no es exitosa, mostrar un mensaje de error
                throw new Error('Problemas al inicializar carrito');
            }
        })
        .then(response => {

            /*
                message: "Cart creado!!!",
                Cart: newCart,
            */
            console.log({ response })
            const cartId = response.Cart._id;
            localStorage.setItem('cartId', cartId)
            console.log("cartId:", cartId);
            console.log("Carrito inicializado/obtenido !!!");

        })
        .catch(error => {
            console.error('Error en la inicializacion de carrito', error);
            showCustomAlert({
                type: 'error',
                message: `Error en la inicializacion de carrito`,
                stack: error
            })
        });

}

// Add an event listener to call the onLoad function when the document is ready
document.addEventListener("DOMContentLoaded", onLoad);