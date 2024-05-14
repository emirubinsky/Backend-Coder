const socket = io.connect('http://localhost:8080');

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */
console.log("HOLA SOY PRODUCT ADD JS")
const token = localStorage.getItem("token");
console.log("Token:", token);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:8080/api/products/', {
                method: 'POST',
                body: formData  // Use formData directly as the body
            });

            const data = await response.json();

            if (response.ok && data.Product && data.Product._id) {
                window.location.href = `http://localhost:8080/products/${data.Product._id}`;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('alert', 'alert-danger');
            errorDiv.textContent = 'Failed to add product. Please try again.';
            form.insertAdjacentElement('beforebegin', errorDiv);
            console.error('Error:', error);
        }
    });
});