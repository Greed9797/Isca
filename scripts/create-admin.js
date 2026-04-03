import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY; // Em um caso real de admin backend script, o ideal seria a SERVICE_ROLE_KEY, mas a anônima pode criar users se configurada.

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  console.log("Tentando criar usuário admin...");
  
  const { data, error } = await supabase.auth.signUp({
    email: 'leo@leonardoames.com.br',
    password: 'Mentoria@132465',
  });

  if (error) {
    console.error("Erro ao criar usuário:", error.message);
  } else {
    console.log("Usuário criado com sucesso!");
    console.log(data);
  }
}

createUser();
