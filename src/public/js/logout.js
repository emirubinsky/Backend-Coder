const logout = async () => {
    const token = localStorage.getItem('token');
    console.log("Token antes de enviarlo al servidor:", token);

    try {
        showLoading();
        const response = await fetch(`${ORGANICA_BASE_URL}`+'/users/logout', {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            hideLoading()
            console.log('Logout exitoso');
            localStorage.removeItem("token");
            window.location.replace("/users/login");
        } else {
            hideLoading()
            const errorMessage = await response.text();
            console.error('Error en el logout:', errorMessage);
        }
    } catch (error) {
        console.error('Error en el logout:', error);
        showCustomAlert({
            type: 'error',
            message: `Error en el logout`,
            stack: error
        })
    } finally {
        hideLoading()
    }
};

// Función para manejar el evento de clic en el botón de logout
const handleLogoutClick = () => {
    logout();
};

// Agregar un event listener al botón de logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton'); // ID del botón de logout en tu HTML
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogoutClick);
    }
});