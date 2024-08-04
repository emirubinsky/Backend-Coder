const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("roleChangePremiumForm");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Crear un nuevo FormData con los archivos del formulario
        const formData = new FormData(form);

        try {
            // https://backend-final-production-8834.up.railway.app/api/sessions/premium/
            // http://localhost:8080/api/sessions/premium/
            const response = await fetch(`http://localhost:8080/users/premium/${userId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    "authorization": `Bearer ${token}`
                },
            });

            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const result = await response.json();
                
                if (response.ok) {
                    showCustomAlert({
                        type: 'success',
                        message: `Actualizacion de ROL exitosa! => Ahora es PREMIUM`
                    })
                    
                    // https://backend-final-production-8834.up.railway.app/api/sessions/login
                    // http://localhost:8080/api/sessions/premium/
                    window.location.href = "http://localhost:8080/login"; 
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.textContent = result.error || "Ocurrió un error al cambiar el rol del usuario.";

                    console.error("Respuesta mala!", result.error);
                    showCustomAlert({
                        type: 'error',
                        message: `"Ocurrió un error`,
                        stack: result
                    })
                }
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error("Error enviando el formulario:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al cambiar el rol del usuario.";

            showCustomAlert({
                type: 'error',
                message: `"Ocurrió un error al cambiar el rol del usuario`,
                stack: error
            })

        }
    });
});