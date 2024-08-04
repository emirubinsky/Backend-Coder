const socket = io.connect('http://localhost:8080');

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */
console.log("HOLA SOY PRODUCT ADD JS")
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
            // Retrieve all files uploaded for the thumbnails input
            //const thumbnailsInput = document.querySelector('#thumbnails');
            //const thumbnailsFiles = thumbnailsInput.files;

            //console.log("all files", thumbnailsFiles)
            // Append each thumbnail file to the FormData object
            /*
            for (let i = 0; i < thumbnailsFiles.length; i++) {
                console.log("file " + i, thumbnailsFiles[i])
                formData.append('thumbnails', thumbnailsFiles[i]);
            }
            */

            // Append storedFiles to formData with unique keys
            storedFiles.forEach((file, index) => {
                formData.append(`thumbnails`, file);
            });

            const response = await fetch('http://localhost:8080/api/products/', {
                method: 'POST',
                body: formData  // Use formData directly as the body
            });

            const data = await response.json();

            if (response.ok && data.Product && data.Product._id) {
                showCustomAlert({
                    type: 'success',
                    message: `Producto creado correctamente`
                })

                window.location.href = `http://localhost:8080/products/${data.Product._id}`;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            const form = document.getElementById('formAdd')
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('alert', 'alert-danger');
            errorDiv.textContent = 'Error en la insercion de nuevo producto. Revise el formulario.';
            form.insertAdjacentElement('beforebegin', errorDiv);
            console.error('Error:', error);

            showCustomAlert({
                type: 'error',
                message: `Error en la insercion de nuevo producto`,
                stack: error
            })
        }
    });

    /* "Multi File input" */
    const fileInput = document.querySelector('#fileInput');
    const thumbnailList = document.querySelector('#thumbnailList');
    const submitBtn = document.querySelector('#submitBtn');

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

    /* old Thumbnail buttons */
    /*
    document.getElementById('thumbnails').addEventListener('change', function (event) {
        const files = event.target.files;
        const thumbnailList = document.getElementById('thumbnailList');

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
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
    */
    // Add event listener to dynamically added remove buttons
    /*
    document.getElementById('thumbnailList').addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-thumbnail')) {
            event.preventDefault(); // Prevent default button behavior (form submission)
            event.stopPropagation(); // Stop event from propagating to parent elements

            // Remove the thumbnail row
            const row = event.target.closest('tr');
            row.remove();
        }
    });
    */

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
/*
function removeThumbnail(button) {
    const row = button.closest('tr');
    row.remove();
}
*/
/*
// JavaScript to handle thumbnail image preview and delete functionality
document.getElementById('thumbnails').addEventListener('change', function(event) {
    const files = event.target.files;
    const thumbnailList = document.getElementById('thumbnailList');

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            const row = `
                <tr>
                    <td><img src="${imageUrl}" style="max-height: 100px;"></td>
                    <td><button class="btn btn-danger" onclick="removeThumbnail(this)">Remove</button></td>
                </tr>
            `;
            thumbnailList.insertAdjacentHTML('beforeend', row);
        };
        reader.readAsDataURL(file);
    });
});

*/

