// Agregamos las comillas que faltaban
const supabaseUrl = "https://hthogdhqyekkxyciisth.supabase.co";
const supabaseKey = "sb_publishable_OM58HzTD8HVdMPyJ0y_JXA_mB68BVLg";

// Verificamos si la librería de Supabase ya cargó
if (window.supabase) {
    const client = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Lo asignamos a 'db' para que tus otros archivos lo reconozcan
    window.db = client; 
    window.supabaseClient = client; // Alias extra por seguridad

    console.log("✅ Conexión con Supabase establecida bajo el alias 'db'");
} else {
    console.error("❌ Error: La librería de Supabase no se detectó. Revisa el orden de tus scripts.");
}
