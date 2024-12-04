document.addEventListener('DOMContentLoaded', function () {

    // Obtener los elementos del DOM
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const spinner = loginBtn.querySelector('.spinner-border');
    const feedbackDiv = document.getElementById('feedback');

    // Validar el formulario antes de enviarlo
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar el envío del formulario por defecto

        // Limpiar las clases de error previas
        clearValidation();

        // Validar email y contraseña
        let isValid = validateForm();

        if (!isValid) {
            return; // Si no es válido, no enviamos el formulario
        }

        // Mostrar spinner mientras se procesa el login
        showSpinner();

        // Realizar el login mediante la API
        loginUser(emailInput.value.trim(), passwordInput.value.trim());
    });

    // Función para mostrar/ocultar la contraseña
    togglePasswordBtn.addEventListener('click', function () {
        togglePasswordVisibility();
    });

    // Función para hacer la solicitud de login
    async function loginUser(email, password) {
        try {
            const response = await fetch('api/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            hideSpinner();

            if (response.ok) {
                const data = await response.json();
                if (data.redirectTo) {
                    window.location.href = data.redirectTo;
                } else {
                    showFeedback('Login exitoso, redirigiendo...', 'success');
                }
            } else {
                const errorData = await response.json();
                showFeedback(errorData.message || 'Credenciales incorrectas.', 'danger');
            }
        } catch (error) {
            hideSpinner();
            showFeedback('Error al conectar con el servidor. Intenta nuevamente.', 'danger');
        }
    }

    // Función para validar el formulario
    function validateForm() {
        let isValid = true;

        // Validar email
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            emailInput.classList.add('is-invalid');
        }

        // Validar contraseña (mínimo 8 caracteres)
        const password = passwordInput.value.trim();
        if (password.length < 8) {
            isValid = false;
            passwordInput.classList.add('is-invalid');
        }

        return isValid;
    }

    // Función para limpiar las clases de validación
    function clearValidation() {
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');
    }

    // Función para mostrar el spinner
    function showSpinner() {
        spinner.classList.remove('d-none');
    }

    // Función para ocultar el spinner
    function hideSpinner() {
        spinner.classList.add('d-none');
    }

    // Función para mostrar mensajes de feedback
    function showFeedback(message, type) {
        if (!feedbackDiv) {
            console.warn('Elemento de feedback no encontrado.');
            return;
        }

        feedbackDiv.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;

        // Ocultar el mensaje después de unos segundos
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
        }, 5000);
    }

    // Función para alternar la visibilidad de la contraseña
    function togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        } else {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    }

});
