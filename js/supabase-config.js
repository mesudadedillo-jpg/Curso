// js/supabaseClient.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos el cliente y lo asignamos a 'db' para evitar conflictos de nombres
const client = window.supabase.createClient(supabaseUrl, supabaseKey);

// Esta línea es la más importante para que productos.js funcione:
window.db = client; 

console.log("Conexión con Supabase establecida bajo el alias 'db'");