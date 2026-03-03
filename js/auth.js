// Usamos 'db' porque así lo definiste en tu archivo de configuración
const db = window.db; 

let isLoginMode = true;

// 1. Capturamos los elementos con el signo '?' para que no truene si no existen
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const btnMainAction = document.getElementById('btnMainAction');
const toggleText = document.getElementById('toggle-text');
const alertContainer = document.getElementById('alert-container');

// Función para mostrar alertas elegantes
function showAlert(message, type = 'error') {
    if (!alertContainer) return; // Seguridad extra
    alertContainer.innerText = message;
    alertContainer.className = `alert alert-${type}`;
    alertContainer.classList.remove('hidden');
    setTimeout(() => alertContainer.classList.add('hidden'), 5000);
}

// 2. Lógica para alternar entre Login y Registro
// Usamos 'Delegación de Eventos' para que el enlace no se rompa al cambiar el HTML
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'toggle-auth') {
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
    }
});

// 3. Acción principal Unificada (Login o Registro)
btnMainAction?.addEventListener('click', async () => {
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        return showAlert("Por favor, llena todos los campos");
    }

    // Mostramos que está cargando (opcional)
    btnMainAction.disabled = true;
    btnMainAction.innerText = isLoginMode ? "Entrando..." : "Registrando...";

    if (isLoginMode) {
        // --- LOGICA DE LOGIN ---
        const { data: authData, error: authError } = await db.auth.signInWithPassword({ email, password });
        
        if (authError) {
            btnMainAction.disabled = false;
            btnMainAction.innerText = "Entrar";
            return showAlert(authError.message);
        }

        // Buscamos el rol del usuario en tu tabla 'profiles'
        const { data: profile } = await db.from('profiles').select('role').eq('id', authData.user.id).single();
        
        // Redirección según rol
        window.location.href = profile?.role === 'admin' ? 'admin/dashboard.html' : 'client/profile.html';

    } else {
        // --- LOGICA DE REGISTRO ---
        const { error } = await db.auth.signUp({ email, password });
        
        btnMainAction.disabled = false;
        btnMainAction.innerText = "Crear Cuenta";

        if (error) return showAlert(error.message);
        
        showAlert("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
        // Forzamos el cambio a modo login automáticamente
        isLoginMode = false; 
        document.getElementById('toggle-auth')?.click();
    }
});

// 4. Otros botones (Solo si existen en la página actual)
document.getElementById('btnTogglePass')?.addEventListener('click', () => {
    const passInput = document.getElementById('password');
    if (passInput) {
        passInput.type = passInput.type === "password" ? "text" : "password";
    }
});

// El botón de logout suele estar en las páginas de admin/cliente
document.getElementById('btnLogout')?.addEventListener('click', async () => {
    await db.auth.signOut();
    window.location.href = '../index.html';
});
