


const socket = io.connect('http://localhost:8080');

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */
console.log("HOLA SOY PRODUCT UPDATE JS")
const token = localStorage.getItem("token");
console.log("Token:", token);

document.addEventListener('DOMContentLoaded', function () {
    //const form = document.querySelector('form');

    const addProductBtn = document.getElementById("addProductBtn")

    addProductBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        try {
            const form = document.querySelector('form');
            const formData = new FormData(form);
            console.log("formData", formData)

            // Append storedFiles to formData with unique keys
            storedFiles.forEach((file, index) => {
                formData.append(`thumbnails`, file);
            });

            const response = await fetch('http://localhost:8080/api/products/', {
                method: 'PUT',
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

    /* "Multi File input" */
    const fileInput = document.querySelector('#fileInput');
    const thumbnailList = document.querySelector('#thumbnailList');

    const storedFiles = []; // Array to hold selected files

    // Add event listener to file input for selecting files
    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
    
        Array.from(files).forEach(file => {
            storedFiles.push(file);
    
            // Display thumbnail in table row
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                const row = `
                    <tr>
                        <td><img src="${imageUrl}" style="max-height: 100px;"></td>
                        <td><button class="btn btn-danger remove-thumbnail">Remove</button></td>
                    </tr>
                `;
                thumbnailList.insertAdjacentHTML('beforeend', row);
            };
            reader.readAsDataURL(file);
        });
    });


    
    // Add event listener to dynamically added remove buttons
    thumbnailList.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-thumbnail')) {
            event.preventDefault(); // Prevent default button behavior (form submission)
            event.stopPropagation(); // Stop event from propagating to parent elements

            // Remove the thumbnail from the storedFiles array
            const row = event.target.closest('tr');
            const thumbnailIndex = Array.from(thumbnailList.children).indexOf(row);

            if (thumbnailIndex !== -1) {
                storedFiles.splice(thumbnailIndex, 1); // Remove file from storedFiles array
                row.remove(); // Remove row from table
            }
        }
    });
});