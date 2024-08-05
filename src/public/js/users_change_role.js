document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("roleChangeForm");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userId = localStorage.getItem('userId');
        const newRole = document.getElementById("role").value;

        try {
            showLoading()
            const response = await fetch(`${ORGANICA_BASE_URL}/api/sessions/premium/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newRole })
            });

            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const result = await response.json();
                
                if (response.ok) {
                    hideLoading()
                    showCustomAlert({
                        type: 'success',
                        message: `Intercambio de ROL exitosa!`
                    })
                    window.location.href = `${ORGANICA_BASE_URL}`+"/home"; 
                } else {
                    hideLoading()
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
            hideLoading()
            console.error("Error enviando el formulario:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al cambiar el rol del usuario.";

            showCustomAlert({
                type: 'error',
                message: `"Ocurrió un error al cambiar el rol del usuario`,
                stack: error
            })
        } finally {
            hideLoading()
        }
    });
});