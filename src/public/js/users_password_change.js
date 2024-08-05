// Cambiar contraseña de formulario
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

document.addEventListener("DOMContentLoaded", () => {
    const changePasswordForm = document.getElementById("changePasswordForm");
    const errorMessage = document.getElementById("errorMessage");

    changePasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;

        try {
            showLoading()
            const response = await fetch(`${ORGANICA_BASE_URL}/users/changePassword/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.hasOwnProperty('details')) {
                    throw new Error(data.details);
                } else {
                    throw new Error('Revise el formulario y vuelva a intentar');
                }
            }

            hideLoading()
            showCustomAlert({
                type: 'success',
                message: "Contraseña actualizada correctamente"
            })

            // La contraseña se cambió exitosamente, redirigir a otra página o mostrar un mensaje de éxito
            window.location.href = `${ORGANICA_BASE_URL}`+"/home";
        } catch (error) {
            hideLoading()
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";

            showCustomAlert({
                type: 'error',
                message: `"Ocurrió un error`,
                stack: error
            })
        } finally {
            hideLoading()
        }
    });
});