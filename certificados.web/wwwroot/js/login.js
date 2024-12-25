document.addEventListener('DOMContentLoaded', function () {

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const feedbackDiv = document.getElementById('feedback');
    const spinner = document.querySelector('.spinner-border');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar el envio del formulario por defecto

        // Limpiar las clases de error previas
        clearValidation();

        // Validar email y contrasenia
        let isValid = validateForm();

        if (!isValid) {
            return; // Si no es valido no enviamos el formulario
        }

        // Mostrar spinner mientras se procesa el login
        showSpinner();

        // Realizar el login mediante la API
        loginUser(emailInput.value.trim(), passwordInput.value.trim());
    });

    // Funcion para mostrar/ocultar la contrasenia
    togglePasswordBtn.addEventListener('click', function () {
        togglePasswordVisibility();
    });

    // Funcion para hacer la solicitud de login
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

    // Funcion para validar el formulario
    function validateForm() {
        let isValid = true;

        // Validar email
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            emailInput.classList.add('is-invalid');
        }

        // Validar contrasenia (minimo 8 caracteres)
        const password = passwordInput.value.trim();
        if (password.length < 8) {
            isValid = false;
            passwordInput.classList.add('is-invalid');
        }

        return isValid;
    }

    // Funcion para limpiar las clases de validacion
    function clearValidation() {
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');
    }

    // Funcion para mostrar el spinner
    function showSpinner() {
        if (spinner) {
            spinner.classList.remove('d-none');
        }
    }

    // Funcion para ocultar el spinner
    function hideSpinner() {
        if (spinner) {
            spinner.classList.add('d-none');
        }
    }

    // Funcion para mostrar mensajes de feedback
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

        // Ocultar el mensaje despues de unos segundos
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
        }, 5000);
    }

    // Funcion para alternar la visibilidad de la contrasenia
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
