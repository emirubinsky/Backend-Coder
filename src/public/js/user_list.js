
const prodURL = "https://backend-final-production-8834.up.railwayx.app/api/sessions/"
const socket = io.connect(ORGANICA_BASE_URL);

const token = localStorage.getItem("token");

// Función para manejar el evento de hacer clic en el botón "Eliminar Usuario"
function handleDeleteUser(event) {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const userId = event.target.getAttribute('data-user-id');

    showLoading();
    // Realizar la solicitud HTTP DELETE para eliminar el usuario
    fetch(`${ORGANICA_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(badResult => {
                    throw new Error(badResult.details);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuario eliminado:', data);
            // Emitir el evento "deleteUser" al servidor con el ID del usuario a eliminar
            socket.emit('deleteUser', userId);
            showCustomAlert({
                type: 'success',
                message: 'Usuario Eliminado'
            })
            window.location.reload()
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            showCustomAlert({
                type: 'error',
                message: 'Error al eliminar el usuario',
                stack: error
            })
        })
        .finally(() => hideLoading());
}

// Agregar un event listener para el evento click en el contenedor userList
document.getElementById('userList').addEventListener('click', handleDeleteUser);

// Manejar el evento de usuario eliminado desde el servidor
socket.on('deleteUser', (deleteUserId) => {
    // Eliminar el usuario de la interfaz
    const userElement = document.querySelector(`[data-user-id="${deleteUserId}"]`);
    if (userElement) {
        userElement.parentElement.parentElement.remove();
        console.log(`Usuario con ID ${deleteUserId} eliminado`);
    } else {
        console.log(`No se encontró el usuario con ID ${deleteUserId}`);
    }
});

// Función para manejar el evento de hacer clic en el botón "Cambiar Rol"
function handleChangeUserRole(event) {
    if (!event.target.classList.contains('update-btn')) {
        return;
    }

    const userId = event.target.getAttribute('data-user-id');

    // Realizar la solicitud HTTP PUT para cambiar el rol del usuario
    showLoading();
    fetch(`${ORGANICA_BASE_URL}/users/swapRole/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(badResult => {
                    throw new Error(badResult.details);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Rol editado:', data);
            // Emitir el evento "swapRole" al servidor con el ID del usuario cuyo rol se cambió
            socket.emit('swapRole', { userId, user: data });
            window.location.reload()
        })
        .catch(error => {
            console.error('Error al cambiar el rol del usuario:', error);
            showCustomAlert({
                type: 'error',
                message: 'Error al cambiar el rol del usuario',
                stack: error
            })
        })
        .finally(() => hideLoading());
}

// Agregar un event listener para el evento click en el contenedor userList
document.getElementById('userList').addEventListener('click', handleChangeUserRole);

// Manejar el evento de rol cambiado desde el servidor
socket.on('changeRole', ({ userId, user }) => {
    // Actualizar el rol del usuario en la interfaz
    const userElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (userElement) {
        // Actualizar los elementos del usuario con la nueva información
        userElement.querySelector('.user-role').textContent = user.role;
        console.log(`Usuario con ID ${userId} rol cambiado`);
    } else {
        console.log(`No se encontró el usuario con ID ${userId}`);
    }
});