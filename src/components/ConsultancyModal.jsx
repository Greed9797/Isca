import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { supabase } from '../utils/supabase';

const ConsultancyModal = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    tipo_negocio: '',
    faturamento: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setTimeout(() => {
        setIsActive(true);
        document.body.style.overflow = 'hidden';
      }, 10);
    } else {
      setIsActive(false);
      setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = '';
        // Reset form on close
        setFormData({
          nome: '',
          email: '',
          whatsapp: '',
          tipo_negocio: '',
          faturamento: ''
        });
        setErrors({});
      }, 300);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    
    // Nome e Sobrenome (at least 2 words)
    const nameParts = formData.nome.trim().split(/\s+/);
    if (nameParts.length < 2) {
      newErrors.nome = 'Digite seu nome e sobrenome';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Digite um e-mail válido';
    }

    // WhatsApp validation (BR format: DD + 9 digits)
    const phoneDigits = formData.whatsapp.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      newErrors.whatsapp = 'Digite o DDD + número (11 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        full_name: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        business_type: formData.tipo_negocio,
        revenue: formData.faturamento
      }]);

      if (error) throw error;

      const evtId = 'Lead_' + Date.now();
      const nameParts = formData.nome.trim().split(/\s+/);
      if (window.fbq) window.fbq('track', 'Lead', {}, { eventID: evtId });
      if (window.capiSend) window.capiSend({
        event_name: 'Lead',
        event_id: evtId,
        event_source_url: location.href,
        em: formData.email.toLowerCase().trim(),
        ph: formData.whatsapp.replace(/\D/g, ''),
        fn: nameParts[0] || '',
        ln: nameParts.slice(1).join(' ') || '',
      });

      window.location.href = "sucesso.html";
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay Desfocado */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      {/* Conteúdo do Modal */}
      <div 
        className={`relative bg-[#0a0a0a] border border-[#222] shadow-[0_0_60px_rgba(0,0,0,0.8)] rounded-2xl w-full max-w-[600px] overflow-hidden transition-all duration-300 ease-in-out transform ${isActive ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        
        {/* Barra de Destaque Superior */}
        <div className="h-1.5 w-full bg-[#F55900]"></div>

        {/* Cabeçalho */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight tracking-tight">
              Preencha os dados abaixo<br/>
              <span className="text-[#F55900]">e solicite seu diagnóstico</span>
            </h2>
            <p className="text-zinc-400 text-sm font-medium">Você está a um passo da consultoria estratégica.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white transition-colors bg-[#111] hover:bg-[#222] rounded-full w-10 h-10 flex items-center justify-center focus:outline-none group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 flex flex-col gap-4">
          <div>
            <input type="text" name="nome" placeholder="Nome e sobrenome" required
                   value={formData.nome} onChange={handleChange}
                   className={`w-full bg-[#3f3f3f] text-white border ${errors.nome ? 'border-red-500' : 'border-[#4a4a4a]'} rounded px-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] transition-colors placeholder:text-[#999]`} />
            {errors.nome && <span className="text-red-500 text-[10px] mt-1 ml-1">{errors.nome}</span>}
          </div>
          
          <div>
            <input type="email" name="email" placeholder="Digite seu melhor e-mail" required
                   value={formData.email} onChange={handleChange}
                   className={`w-full bg-[#3f3f3f] text-white border ${errors.email ? 'border-red-500' : 'border-[#4a4a4a]'} rounded px-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] transition-colors placeholder:text-[#999]`} />
            {errors.email && <span className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</span>}
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/20px-Flag_of_Brazil.svg.png" alt="BR" className="w-4 rounded-sm" />
                <ChevronDown className="w-3 h-3 text-[#999]" />
              </div>
              <input type="tel" name="whatsapp" placeholder="Whatsapp com DDD" required
                     value={formData.whatsapp} onChange={handleChange}
                     className={`w-full bg-[#3f3f3f] text-white border ${errors.whatsapp ? 'border-red-500' : 'border-[#4a4a4a]'} rounded pl-14 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] transition-colors placeholder:text-[#999]`} />
            </div>
            {errors.whatsapp && <span className="text-red-500 text-[10px] mt-1 ml-1">{errors.whatsapp}</span>}
          </div>
          
          <div>
            <div className="relative">
              <select name="tipo_negocio" required 
                      value={formData.tipo_negocio} onChange={handleChange}
                      className="w-full bg-[#3f3f3f] text-white border border-[#4a4a4a] rounded px-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] transition-colors appearance-none cursor-pointer">
                <option value="" disabled className="text-[#999]">Qual é o seu tipo de negócio?</option>
                <option value="Fabricante">Sou Fabricante</option>
                <option value="Revenda">Trabalho Com Revenda</option>
                <option value="Importacao">Importo e Vendo</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="text-white w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <select name="faturamento" required
                      value={formData.faturamento} onChange={handleChange}
                      className="w-full bg-[#3f3f3f] text-white border border-[#4a4a4a] rounded px-4 py-3.5 text-sm focus:outline-none focus:border-[#F55900] transition-colors appearance-none cursor-pointer">
                <option value="" disabled className="text-[#999]">Qual é o seu faturamento MENSAL aproximado?</option>
                <option value="10k a 30k">De R$ 10.000 a R$ 30.000</option>
                <option value="30k a 100k">De R$ 30.000 a R$ 100.000</option>
                <option value="100k a 500k">De R$ 100.000 a R$ 500.000</option>
                <option value="Acima de 500k">Acima de R$ 500.000</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="text-white w-4 h-4" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#F55900] hover:bg-[#d44d00] text-white font-bold uppercase py-4 px-6 rounded-lg transition-all mt-2 text-sm flex justify-center items-center shadow-[0_0_20px_rgba(245,89,0,0.2)] hover:shadow-[0_0_30px_rgba(245,89,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'ENVIANDO...' : 'QUERO APLICAR AGORA'}
          </button>
          
          <p className="text-zinc-500 text-[10px] text-center mt-2 leading-relaxed px-4">
            Ao se inscrever você concorda com o tratamento de seus dados pessoais para receber comunicações via whatsapp, sms, ligações e e-mails do Grupo W3. Seus dados apenas serão utilizados para fins de comunicação e marketing. Você pode cancelar o recebimento desses e-emails quando quiser.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConsultancyModal;
