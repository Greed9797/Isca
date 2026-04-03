import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function login() {
  console.log("Tentando logar com o usuário...");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'leo@leonardoames.com.br',
    password: 'Mentoria@132465',
  });

  if (error) {
    console.error("Erro ao fazer login:", error.message);
  } else {
    console.log("Login com sucesso!");
    console.log(data);
  }
}

login();