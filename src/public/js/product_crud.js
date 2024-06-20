// TODO > Esto seria mas para un rol ADMIN

// import io from "socket.io-client";
// const socket = io.connect('http://localhost:8080');
const cartForm = document.getElementById('cartForm');

async function renderProducts(products) {
    if (!products || !products.image) {
        console.error('No se pudo renderizar el producto:', products);
        return;
    }

    const productList = document.getElementById('productList');
    const productElement = document.createElement('div');
    productElement.classList.add('col-md-4', 'mb-4');
    productElement.innerHTML = `
        <div class="card">
            <img src="/img/${products.image}" class="card-img-top img-fluid" alt="${products.title}"
                style="max-height: 400px; aspect-ratio: 3/2; object-fit: contain;">
            <div class="card-body">
                <h5 class="card-title">${products.title}</h5>
                <p class="card-text">${products.brand}</p>
                <p class="card-text">${products.description}</p>
                <p class="card-text">Precio: $${products.price}</p>
                <p class="card-text">Stock: ${products.stock}</p>
                <p class="card-text">Categoría: ${products.category}</p>
                <a href="http://localhost:8080/api/products/{{this._id}}" class="btn btn-primary">Ver detalles</a>
                <button class="btn btn-danger delete-btn" data-product-id="{{this._id}}">Eliminar Producto</button>
                <button class="btn btn-success cart-btn" data-product-id="{{this._id}}">Agregar al carrito</button> 
            </div>
        </div>`;
    productList.appendChild(productElement);
}



/*
socket.on('addProduct', (addProduct) => {
    renderProducts(addProduct);
});
*/

// Manejar el envío del formulario para agregar un producto
document.getElementById('addProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const formData = new FormData(event.target);

    try {
        const response = await fetch('http://localhost:8080/api/products/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto');
        }

        const data = await response.json();
        //socket.emit("addProduct", data.Product);
        console.log('Producto agregado:', data.Product);

        // Limpiar el formulario después de agregar el producto
        event.target.reset();

    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});

// Función para manejar el evento de hacer clic en el botón "Eliminar Producto"
function handleDeleteProduct(event) {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const productId = event.target.getAttribute('data-product-id');

    // Emitir el evento "deleteProduct" al servidor con el ID del producto a eliminar
    socket.emit('deleteProduct', productId);
}

// Agregar un event listener para el evento click en el contenedor productList
document.getElementById('productList').addEventListener('click', handleDeleteProduct);

// Manejar el evento de producto borrado desde el servidor
socket.on('deleteProduct', (deletedProductId) => {
    // Eliminar el producto de la interfaz
    const productElement = document.querySelector(`[data-product-id="${deletedProductId}"]`);
    if (productElement) {
        productElement.parentElement.parentElement.remove();
        console.log(`Producto con ID ${deletedProductId} eliminado`);
    } else {
        console.log(`No se encontró el producto con ID ${deletedProductId}`);
    }
});