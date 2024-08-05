document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newPassword = document.getElementById("password").value;
        const token = window.location.pathname.split("/").pop();

        try {
            showLoading()
            const response = await fetch(`${ORGANICA_BASE_URL}/users/resetPassword/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword })
            });

            const result = await response.json();

            if (response.ok) {
                hideLoading()
                showCustomAlert({
                    type: 'success',
                    message: `Contraseña restablecida correctamente.`
                })
                window.location.href = `${ORGANICA_BASE_URL}`+"/login";
            } else {
                hideLoading()
                errorMessage.style.display = "block";
                errorMessage.textContent = result.error || "Ocurrió un error al restablecer la contraseña.";
                showCustomAlert({
                    type: 'error',
                    message: "Ocurrió un error al restablecer la contraseña.",
                    stack: error
                })
            }
        } catch (error) {
            hideLoading()
            console.error("Error submitting reset password form:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al restablecer la contraseña.";

            showCustomAlert({
                type: 'error',
                message: "Ocurrió un error al restablecer la contraseña.",
                stack: error
            })
        } finally {
            hideLoading()
        }
    });
});