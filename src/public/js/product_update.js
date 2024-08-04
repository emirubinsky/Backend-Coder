const socket = io.connect('http://localhost:8080');

/**
 * Funciones asociados a la view the product_list
 * - Agregar un producto al carro (en memoria)
 */
console.log("HOLA SOY PRODUCT UPDATE JS")
const token = localStorage.getItem("token");
console.log("Token:", token);


document.addEventListener('DOMContentLoaded', async function () {
    const updateProductBtn = document.getElementById("updateProductBtn");
    const thumbnailList = document.querySelector('#thumbnailList');
    const fileInput = document.querySelector('#fileInput');

    const productIdInput = document.getElementById('productId');
    const productId = productIdInput.value;
    console.log('Product ID:', productId);

    const storedFiles = []; // Array to hold selected files

    // Function to fetch existing thumbnails and populate storedFiles
    async function populateStoredFiles(productId) {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${productId}`);
            const data = await response.json();
            console.log("populateStoredFiles > ", data);

            if (response.ok && data.product && data.product.thumbnails) {
                for (const thumbnailUrl of data.product.thumbnails) {
                    console.log("thumbnailUrl", thumbnailUrl);

                    if (thumbnailUrl !== null) {
                        const blob = await fetch(`http://localhost:8080/img/products/${thumbnailUrl}`).then(res => res.blob());
                        const file = new File([blob], thumbnailUrl.substring(thumbnailUrl.lastIndexOf('/') + 1));
                        storedFiles.push(file);
                        console.log("new file stored in storedFiles", file.name);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
            showCustomAlert({
                type: 'warning',
                message: `Algoaaa`,
                stack: error
            })
        }
    }

    // Function to display existing thumbnails in the table
    function displayExistingThumbnails() {
        thumbnailList.innerHTML = ''; // Clear existing thumbnails

        console.log("displayExistingThumbnails > ", storedFiles)

        storedFiles.forEach(file => {
            //const reader = new FileReader();
            //reader.onload = function (e) {
            //const imageUrl = e.target.result;
            const row = `
                    <tr>
                        <td><img src="/img/products/${file.name}" style="max-height: 100px;"></td>
                        <td><button class="btn btn-danger remove-thumbnail">Remove</button></td>
                    </tr>
                `;
            thumbnailList.insertAdjacentHTML('beforeend', row);
            //};
            //reader.readAsDataURL(file);
        });
    }


    /* "Multi File input" */

    // Add event listener to file input for selecting files
    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;

        Array.from(files).forEach(file => {
            storedFiles.push(file);

            // Display thumbnail in table row
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

    // Add event listener to dynamically added remove buttons
    thumbnailList.addEventListener('click', function (event) {
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

    // Preload existing thumbnails and display on page load
    await populateStoredFiles(productId);
    displayExistingThumbnails();




    // Handle form submission for updating product
    updateProductBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        try {
            const form = document.querySelector('form');
            const formData = new FormData(form);
            console.log("formData", formData)

            // Check if a new main image file is selected
            const mainImageInput = document.querySelector('#image');
            if (mainImageInput.files.length > 0) {
                console.log("no voy a agregar algo mas")
                //formData.append('image', mainImageInput.files[0]);
            } else {
                formData.delete('image'); // Remove 'image' field if not present
            }

            // Append new thumbnail files to formData
            storedFiles.forEach((file, index) => {
                formData.append(`thumbnails`, file);
            });

            const requestOptions = {
                method: 'PUT',
                body: formData
            };

            const response = await fetch(`http://localhost:8080/api/products/${productId}`, requestOptions);
            const data = await response.json();

            if (response.ok && data.Product && data.Product._id) {

                showCustomAlert({
                    type: 'success',
                    message: `Producto actualizado correctamente`
                })

                window.location.href = `http://localhost:8080/products/${data.Product._id}`;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            const form = document.getElementById('formAdd')
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('alert', 'alert-danger');
            errorDiv.textContent = 'Failed to update product. Please try again.';
            form.insertAdjacentElement('beforebegin', errorDiv);
            console.error('Error:', error);

            showCustomAlert({
                type: 'error',
                message: `Error en la actualizacion de nuevo producto`,
                stack: error
            })
        }
    });
});