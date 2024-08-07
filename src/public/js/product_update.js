const socket = io.connect(ORGANICA_BASE_URL);

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

    const storedFiles = []; // Array to hold selected files
    const removedThumbnails = []; // Array to hold removed thumbnails

    // Function to fetch existing thumbnails and populate storedFiles
    async function populateStoredFiles(productId) {
        try {
            showLoading();
            const response = await fetch(`${ORGANICA_BASE_URL}/api/products/${productId}`);
            const data = await response.json();

            if (response.ok && data.product && data.product.thumbnails) {
                for (const thumbnailUrl of data.product.thumbnails) {
                    console.log("thumbnailUrl", thumbnailUrl);

                    if (thumbnailUrl !== null) {
                        const blobResponse = await fetch(`${ORGANICA_BASE_URL}/img/products/${thumbnailUrl}`);
                        const blob = await blobResponse.blob();

                        // Obtén el tipo MIME del blob
                        const mimeType = blob.type;

                        const file = new File([blob], thumbnailUrl.substring(thumbnailUrl.lastIndexOf('/') + 1), { type: mimeType });
                        storedFiles.push(file);
                        console.log("new file stored in storedFiles", file.name, file.type);
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
        } finally {
            hideLoading();
        }
    }

    // Function to display existing thumbnails in the table
    function displayExistingThumbnails() {
        thumbnailList.innerHTML = ''; // Clear existing thumbnails
        console.log("displayExistingThumbnails > ", storedFiles)
        storedFiles.forEach(file => {
            const row = `
                <tr>
                    <td><img src="/img/products/${file.name}" style="max-height: 100px;"></td>
                    <td><button class="btn btn-danger remove-thumbnail" data-thumbnail="${file.name}">Remove</button></td>
                </tr>
            `;
            thumbnailList.insertAdjacentHTML('beforeend', row);
        });
    }

    /* "Multi File input" */
    // Add event listener to file input for selecting files
    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;

        Array.from(files).forEach(file => {
            storedFiles.push(file);

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
            const removedThumbnail = event.target.getAttribute('data-thumbnail');

            if (thumbnailIndex !== -1) {
                storedFiles.splice(thumbnailIndex, 1); // Remove file from storedFiles array
                removedThumbnails.push(removedThumbnail); // Add to removedThumbnails array
                row.remove(); // Remove row from table
            }
        }
    });
    // Preload existing thumbnails and display on page load
    await populateStoredFiles(productId);
    // displayExistingThumbnails();

    // Handle form submission for updating product
    updateProductBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        try {
            showLoading();
            const form = document.querySelector('form');
            const formData = new FormData(form);
            console.log("formData", formData)

            // Check if a new main image file is selected
            const mainImageInput = document.querySelector('#image');
            if (mainImageInput.files.length > 0) {
                // Ya me acordé porque tenia esto comentado...
                // formData.append('image', mainImageInput.files[0]);
            } else {
                formData.delete('image'); // Remove 'image' field if not present
            }

            // Append new thumbnail files to formData
            storedFiles.forEach(file => {
                formData.append('thumbnails', file);
            });

            // Append removed thumbnails to formData
            removedThumbnails.forEach(thumbnail => {
                formData.append('removedThumbnails', thumbnail);
            });

            // Remove potential duplicate entries for image and thumbnails
            /*
            const uniqueEntries = new Map();
            for (const [key, value] of formData.entries()) {
                if (!uniqueEntries.has(key)) {
                    uniqueEntries.set(key, value);
                } else if (key === 'thumbnails') {
                    if (Array.isArray(uniqueEntries.get(key))) {
                        uniqueEntries.get(key).push(value);
                    } else {
                        uniqueEntries.set(key, [uniqueEntries.get(key), value]);
                    }
                }
            }

            const cleanedFormData = new FormData();
            for (const [key, value] of uniqueEntries.entries()) {
                if (Array.isArray(value)) {
                    value.forEach(val => cleanedFormData.append(key, val));
                } else {
                    cleanedFormData.append(key, value);
                }
            }    
            */

            const requestOptions = {
                method: 'PUT',
                body: formData
            };

            const response = await fetch(`${ORGANICA_BASE_URL}/api/products/${productId}`, requestOptions);
            const data = await response.json();

            if (response.ok && data.Product && data.Product._id) {
                hideLoading();
                showCustomAlert({
                    type: 'success',
                    message: `Producto actualizado correctamente`
                })

                window.location.href = `${ORGANICA_BASE_URL}/products/${data.Product._id}`;
            } else {
                hideLoading();
                if (data.hasOwnProperty('details')) {
                    throw new Error(data.details);
                } else {
                    throw new Error('Revise el formulario y vuelva a intentar');
                }

            }
        } catch (error) {
            hideLoading();
            const form = document.getElementById('formUpdate')
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
        } finally {
            hideLoading();
        }
    });
});