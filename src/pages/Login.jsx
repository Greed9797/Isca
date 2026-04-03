import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Cybersecurity: Always sanitize inputs (basic trim) and use parameterized auth requests 
    // (Supabase handles SQL injection natively, but trimming prevents trailing space errors)
    try {
      await signIn(email.trim(), password);
      // Sucesso! Redireciona para a página segura.
      navigate(from, { replace: true });
    } catch (err) {
      // Cybersecurity: Do not expose detailed errors like "User not found" vs "Invalid password"
      // Always use a generic error message for login failures to prevent user enumeration attacks.
      console.error('Falha de segurança ao tentar login:', err.message);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-['Inter'] selection:bg-[#F55900] selection:text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F55900]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 sm:p-12 relative z-10">
        
        {/* Security Badge */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-zinc-800 flex items-center justify-center shadow-lg relative group">
             <div className="absolute inset-0 bg-[#F55900]/20 blur-md rounded-full"></div>
             <Lock className="w-8 h-8 text-[#F55900] relative z-10" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Acesso Restrito</h2>
          <p className="text-zinc-500 text-sm font-medium">Painel Administrativo W3 Automations</p>
        </div>

        {/* Security Warning / Error display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-lg flex items-center gap-3">
             <ShieldAlert className="w-5 h-5 shrink-0" />
             {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@w3.com.br"
              className="w-full bg-[#1a1a1a] text-white border border-zinc-800 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] focus:ring-1 focus:ring-[#F55900] transition-all placeholder:text-zinc-600"
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Senha Segura</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#1a1a1a] text-white border border-zinc-800 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] focus:ring-1 focus:ring-[#F55900] transition-all placeholder:text-zinc-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#F55900] hover:bg-[#d44d00] text-white font-black uppercase tracking-widest py-4 px-6 rounded-lg transition-all mt-4 text-sm flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(245,89,0,0.2)] hover:shadow-[0_0_30px_rgba(245,89,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Autenticando...' : 'Acessar Painel'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800 pt-6">
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Ambiente Protegido
          </p>
        </div>

      </div>
    </div>
  );
}
