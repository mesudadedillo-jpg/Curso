async function validarAccesoAdmin() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 1. Verificar si existe sesión
  if (authError || !user) {
    window.location.href = '../index.html';
    return;
  }

  // 2. Verificar el rol en la tabla profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    alert("Acceso Restringido: No eres administrador");
    window.location.href = '../client/profile.html';
    return;
  }

  // 3. Si todo está bien, cargamos los datos
  console.log("Acceso concedido como Admin");
  cargarTodosLosDatos(); 
}

async function cargarTodosLosDatos() {
  const { data, error } = await supabase
    .from('datos_usuarios')
    .select(`
      contenido,
      profiles ( email ) 
    `); 

  if (error) {
    console.error("Error al obtener datos:", error.message);
    return;
  }

  console.table(data); 
}

async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
  } else {
    window.location.href = '../index.html'; 
  }
}

// Event Listeners y Ejecución inicial
document.getElementById('btnLogout')?.addEventListener('click', cerrarSesion);

// Iniciamos la validación al cargar el script
validarAccesoAdmin();