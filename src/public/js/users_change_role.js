document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("roleChangeForm");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userId = localStorage.getItem('userId');
        const newRole = document.getElementById("role").value;

        try {
            const response = await fetch(`http://localhost:8080/api/sessions/premium/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newRole })
            });

            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const result = await response.json();
                
                if (response.ok) {
                    showCustomAlert({
                        type: 'success',
                        message: `Intercambio de ROL exitosa!`
                    })
                    window.location.href = "http://localhost:8080/home"; 
                } else {
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