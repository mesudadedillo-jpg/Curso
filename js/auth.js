let isLoginMode = true;

const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const btnMainAction = document.getElementById('btnMainAction');
const toggleAuth = document.getElementById('toggle-auth');
const toggleText = document.getElementById('toggle-text');
const alertContainer = document.getElementById('alert-container');

// Función para mostrar alertas sin usar 'alert()' del navegador
function showAlert(message, type = 'error') {
    alertContainer.innerText = message;
    alertContainer.className = `alert alert-${type}`;
    alertContainer.classList.remove('hidden');
    setTimeout(() => alertContainer.classList.add('hidden'), 5000);
}

// Alternar entre Login y Registro
toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
        authTitle.innerText = "Iniciar Sesión";
        authSubtitle.innerText = "Ingresa tus credenciales para continuar";
        btnMainAction.innerText = "Entrar";
        toggleText.innerHTML = '¿No tienes cuenta? <a href="#" id="toggle-auth">Regístrate aquí</a>';
    } else {
        authTitle.innerText = "Crear Cuenta";
        authSubtitle.innerText = "Regístrate para obtener acceso como cliente";
        btnMainAction.innerText = "Crear Cuenta";
        toggleText.innerHTML = '¿Ya tienes cuenta? <a href="#" id="toggle-auth">Inicia sesión</a>';
    }
});

// Acción principal (Login o Registro)
btnMainAction.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return showAlert("Por favor, llena todos los campos");
    }

    if (isLoginMode) {
        // Lógica de Login que ya tenías
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) return showAlert(authError.message);

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();
        window.location.href = profile?.role === 'admin' ? 'admin/dashboard.html' : 'client/profile.html';
    } else {
        // Lógica de Registro
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return showAlert(error.message);
        showAlert("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
        toggleAuth.click(); // Regresa al modo login automáticamente
    }
});