document.addEventListener('DOMContentLoaded', function () {

    // Obtener los elementos del DOM
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const spinner = loginBtn.querySelector('.spinner-border');

    // Validar el formulario antes de enviarlo
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar el envío del formulario por defecto

        // Limpiar las clases de error previas
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        // Validar email y contraseña
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

        if (!isValid) {
            return; // Si no es válido, no enviamos el formulario
        }

        // Mostrar spinner mientras se procesa el login
        spinner.classList.remove('d-none');

        // Realizar el login mediante la API
        loginUser(email, password);
    });

    // Función para mostrar/ocultar la contraseña
    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Cambiar el icono de "ojo"
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        } else {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    });

    // Función para hacer la solicitud de login
    async function loginUser(email, password) {
        try {
            // Realizar la llamada a la API de login
            const response = await fetch('/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            // Ocultar el spinner
            spinner.classList.add('d-none');

            if (response.ok) {
                // Si el login es exitoso, procesar la respuesta JSON y redirigir
                const data = await response.json();
                if (data.redirectTo) {
                    // Redirigir al Dashboard
                    window.location.href = data.redirectTo;
                } else {
                    alert('Login exitoso, pero no se especificó una redirección.');
                }
            } else {
                // Si las credenciales son incorrectas, mostrar un mensaje de error
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        } catch (error) {
            // Manejo de errores si falla la comunicación con el servidor
            spinner.classList.add('d-none');
            alert('Error al conectar con el servidor. Intenta nuevamente.');
        }
    }

});
