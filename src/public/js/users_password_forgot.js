document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;

        try {
            showLoading()
            const response = await fetch(`${ORGANICA_BASE_URL}`+"/users/requestPasswordReset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok) {
                hideLoading()
                showCustomAlert({
                    type: 'success',
                    message: "Se ha enviado un enlace de restablecimiento de contraseña a su email."
                })
                form.reset();
            } else {
                hideLoading()
                errorMessage.style.display = "block";
                errorMessage.textContent = "Ocurrió un error al enviar el enlace de restablecimiento de contraseña.";

                showCustomAlert({
                    type: 'error',
                    message: `"Ocurrió un error al enviar el enlace de restablecimiento de contraseña.`,
                    stack: error
                })
            }
        } catch (error) {
            hideLoading()
            console.error("Error enviando el formulario:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al enviar el enlace de restablecimiento de contraseña.";

            showCustomAlert({
                type: 'error',
                message: `"Ocurrió un error al enviar el enlace de restablecimiento de contraseña.`,
                stack: error
            })
        } finally {
            hideLoading()
        }
    });
});
