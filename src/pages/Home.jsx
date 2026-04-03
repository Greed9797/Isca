import React, { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Users, TrendingUp, BarChart3, 
  MapPin, Globe, GraduationCap, Store, CreditCard, Cpu, 
  Check, X, ChevronDown, Target, Building, Rocket, DollarSign,
  Layers, VolumeX, Play
} from 'lucide-react';
import ConsultancyModal from '../components/ConsultancyModal';

// --- COMPONENTES BASE (Híbridos FGA + W3) ---

const ButtonPrimary = ({ children, className = "", onClick }) => (
  <button 
    onClick={onClick}
    className={`bg-[#F55900] text-white font-extrabold py-4 px-8 rounded-lg flex items-center justify-center gap-2 uppercase tracking-wider hover:bg-[#d44d00] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,89,0,0.3)] hover:shadow-[0_0_40px_rgba(245,89,0,0.6)] ${className}`}
  >
    {children}
  </button>
);

const SectionTitle = ({ subtitle, title, description, className = "" }) => (
  <div className={`text-center max-w-4xl mx-auto mb-16 ${className}`}>
    {subtitle && (
      <h3 className="text-[#F55900] text-xs md:text-sm font-black tracking-[0.2em] uppercase mb-4">
        {subtitle}
      </h3>
    )}
    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase font-['Montserrat'] mb-6">
      {title}
    </h2>
    {description && (
      <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

const ImagePlaceholder = ({ aspect = "aspect-video", icon: Icon = Target, className = "" }) => (
  <div className={`bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center relative overflow-hidden group rounded-xl ${aspect} ${className}`}>
    <Icon className="text-zinc-700 w-16 h-16 group-hover:scale-110 group-hover:text-[#F55900] transition-all duration-500" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
  </div>
);

// --- PÁGINA PRINCIPAL (O MUTANTE V2: Agressivo) ---

export default function App() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black min-h-screen text-white font-['Inter'] selection:bg-[#F55900] selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-[80px] bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="text-2xl font-black tracking-tighter text-white">
            Grupo W3<span className="text-[#F55900]">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
            <a href="#problema" className="text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">O Desafio</a>
            <a href="#solucoes" className="text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">O Ecossistema</a>
            <a href="#cases" className="text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">Resultados</a>
            <a href="#bastidores" className="text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">Bastidores</a>
        </div>
        <button onClick={handleApplyClick} className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wide hover:border-[#F55900] hover:bg-[#F55900]/10 transition-all">
            Solicitar Diagnóstico
        </button>
      </nav>

      {/* 01. HERO SECTION (VSL Integrada + Copy focada no Lead) */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden border-b border-zinc-900 flex flex-col items-center">
        {/* Efeitos de Luz - W3 Style */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#F55900]/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center mt-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F55900]/30 bg-[#F55900]/10 text-[#F55900] text-xs font-bold uppercase tracking-widest mb-8 animate-pulse">
             <Target className="w-4 h-4" /> Diagnóstico exclusivo para E-commerces que já faturam
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-white leading-[1.1] tracking-tighter mb-6 uppercase font-['Montserrat']">
            Escale o Faturamento do seu E-commerce com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F55900] to-[#ff8c42] drop-shadow-[0_0_30px_rgba(245,89,0,0.5)]">Margem e Estrutura Sólida</span>
          </h1>

          <p className="text-zinc-300 text-base md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Entenda o método exato validado por um ecossistema que já operou mais de <strong className="text-white">R$ 100 Milhões</strong> em resultados reais.
          </p>

          <ButtonPrimary className="w-full sm:w-auto text-base py-5 px-10" onClick={handleApplyClick}>
            QUERO MEU DIAGNÓSTICO GRATUITO <ArrowRight className="w-5 h-5 ml-2" />
          </ButtonPrimary>
          <p className="text-zinc-500 text-sm mt-4"><ShieldCheck className="w-4 h-4 inline mr-1 text-[#F55900]" /> 100% Confidencial. Avaliamos a viabilidade de parceria.</p>
        </div>
      </section>

      {/* 02. EXCLUSÃO QUALIFICADA (FGA + W3) */}
      <section className="py-16 px-4 bg-[#050505] border-b border-zinc-900">
         <div className="max-w-6xl mx-auto">
            <h3 className="text-center text-zinc-400 text-sm md:text-base font-bold uppercase tracking-widest mb-10">O Ecossistema W3 é a peça que falta para donos de:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-lg text-center hover:border-[#F55900]/30 transition-colors">
                    <Globe className="w-8 h-8 text-[#F55900] mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">E-commerce Próprio</h4>
                    <p className="text-zinc-500 text-sm">Marcas faturando +R$30k/mês que precisam escalar sem comprometer o lucro.</p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-lg text-center hover:border-[#F55900]/30 transition-colors">
                    <Store className="w-8 h-8 text-[#F55900] mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">Marketplaces</h4>
                    <p className="text-zinc-500 text-sm">Sellers de Shopee e ML que querem fugir da guerra de preços e ter uma operação independente.</p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-lg text-center hover:border-[#F55900]/30 transition-colors">
                    <MapPin className="w-8 h-8 text-[#F55900] mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">Lojas Físicas</h4>
                    <p className="text-zinc-500 text-sm">Varejo tradicional que fatura alto localmente e precisa profissionalizar a operação digital.</p>
                </div>
            </div>
         </div>
      </section>

      {/* 03. PAIN & AGITATION (FGA Framework aplicado ao W3) */}
      <section id="problema" className="py-24 px-4 bg-black relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle 
            subtitle="O Cenário Atual"
            title="Sua operação parece rodar, mas o lucro não sobra no fim do mês?" 
            description="Se você é DONO DE E-COMMERCE, veja se sua rotina reflete algum destes gargalos que impedem a verdadeira escala:"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: DollarSign, title: "Margem Comprimida", text: "Você fatura alto, mas os custos operacionais e taxas engolem seu lucro. Muito esforço para pouco dinheiro no bolso." },
              { icon: TrendingUp, title: "Dependência de Tráfego", text: "Sem anúncios rodando, você não vende. O CPA está cada vez mais caro e o marketing virou um buraco negro de verba." },
              { icon: BarChart3, title: "Falta de Previsibilidade", text: "Vendas oscilando. Um mês é ótimo, o outro é desesperador. Você não tem dados ou clareza de onde investir para crescer seguro." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-zinc-900 p-8 rounded-xl hover:border-[#F55900]/50 transition-colors group">
                <div className="w-14 h-14 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#F55900]/10 transition-colors">
                   <item.icon className="w-7 h-7 text-[#F55900] group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-white text-xl font-bold mb-3 uppercase tracking-wide">{item.title}</h4>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. BEFORE & AFTER (W3 Concept com FGA Aggressiveness) */}
      <section className="py-24 px-4 bg-[#050505] border-y border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <SectionTitle 
            subtitle="A Virada de Chave"
            title="O Diferencial não é crescer rápido. É crescer com estrutura." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {/* O Problema */}
              <div className="bg-black border border-zinc-800 p-10 rounded-2xl flex flex-col justify-center">
                  <h4 className="text-xl md:text-2xl font-black text-white mb-8 uppercase text-center md:text-left">E-commerce Tradicional</h4>
                  <ul className="space-y-6">
                      <li className="flex items-start gap-4"><X className="text-red-500 w-6 h-6 shrink-0 bg-red-500/10 rounded p-1" /> <span className="text-zinc-400 text-lg">Margem de lucro espremida</span></li>
                      <li className="flex items-start gap-4"><X className="text-red-500 w-6 h-6 shrink-0 bg-red-500/10 rounded p-1" /> <span className="text-zinc-400 text-lg">Refém 100% de Facebook Ads</span></li>
                      <li className="flex items-start gap-4"><X className="text-red-500 w-6 h-6 shrink-0 bg-red-500/10 rounded p-1" /> <span className="text-zinc-400 text-lg">Gestão baseada em achismos</span></li>
                  </ul>
              </div>
              
              {/* A Solução W3 */}
              <div className="bg-[#111111] border border-[#F55900] shadow-[0_0_40px_rgba(245,89,0,0.15)] p-10 rounded-2xl relative overflow-hidden flex flex-col justify-center transform md:scale-105 z-10">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F55900] to-[#ffaa00]"></div>
                  <h4 className="text-xl md:text-2xl font-black text-white mb-8 uppercase text-center md:text-left text-[#F55900]">E-commerce Grupo W3</h4>
                  <ul className="space-y-6 relative z-10">
                      <li className="flex items-start gap-4"><Check className="text-[#F55900] w-6 h-6 shrink-0 bg-[#F55900]/10 rounded p-1" /> <span className="text-white font-bold text-lg">Reorganização financeira e lucro real</span></li>
                      <li className="flex items-start gap-4"><Check className="text-[#F55900] w-6 h-6 shrink-0 bg-[#F55900]/10 rounded p-1" /> <span className="text-white font-bold text-lg">Estrutura de vendas multi-canal</span></li>
                      <li className="flex items-start gap-4"><Check className="text-[#F55900] w-6 h-6 shrink-0 bg-[#F55900]/10 rounded p-1" /> <span className="text-white font-bold text-lg">Decisões baseadas em métricas exatas</span></li>
                  </ul>
              </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ButtonPrimary onClick={handleApplyClick}>QUERO ESSA ESTRUTURA NO MEU NEGÓCIO</ButtonPrimary>
          </div>
        </div>
      </section>

      {/* 05. O ECOSSISTEMA / SOLUÇÕES (W3 Content + FGA Modules Layout) */}
      <section id="solucoes" className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            subtitle="Nossas Unidades de Negócio"
            title="Um sistema integrado onde cada engrenagem vende e otimiza" 
            description="Não somos dependentes de uma única solução. Conheça as áreas que vão operar o crescimento do seu e-commerce:"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              { icon: GraduationCap, title: "MENTORIA AMES", desc: "Fundamentos estratégicos para donos de E-commerce. O método que construiu o 3º maior e-commerce de moda infantil do Brasil." },
              { icon: TrendingUp, title: "W3 TRÁFEGO PAGO", desc: "Gestão de mídia que não foca em curtidas, mas em ROAS e margem. Otimização de conversão e escala sustentável." },
              { icon: Store, title: "W3 MARKETPLACES", desc: "Domine Mercado Livre, Shopee e Amazon com nosso time gerindo sua operação AMZ aplicando nossa inteligência de vendas." },
              { icon: CreditCard, title: "W3 PAGAMENTOS", desc: "A mais alta taxa de aprovação do mercado com checkout transparente e recuperação de carrinhos impulsionada por IA." },
              { icon: Cpu, title: "W3 LABS (SaaS)", desc: "Nossa tecnologia própria. Toda a inteligência de gestão, calculadoras de margem e CRM de influenciadores a um clique." }
            ].map((sol, i) => (
              <div key={i} className={`bg-[#0a0a0a] border border-zinc-900 p-8 rounded-xl hover:-translate-y-2 hover:border-[#F55900]/50 transition-all duration-300 flex flex-col ${i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <sol.icon className="w-10 h-10 text-[#F55900] mb-6" />
                <h4 className="text-xl font-black text-white mb-3 tracking-wide">{sol.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. CASES / PROVA SOCIAL (FGA 3-Col + W3 Main Case) */}
      <section id="cases" className="py-24 px-4 bg-[#050505] border-t border-zinc-900">
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle subtitle="Resultados Reais" title="Validação de quem vive o campo de batalha" />
          
          {/* Main Case (W3) */}
          <div className="bg-black border border-[#F55900]/20 rounded-2xl overflow-hidden flex flex-col lg:flex-row mb-16 text-left shadow-2xl">
              <div className="lg:w-1/2 relative bg-[#111] p-12 flex flex-col justify-center border-r border-zinc-900">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase">Ame Kids</h3>
                  <p className="text-zinc-300 text-base mb-8 leading-relaxed">
                    Cofundada por Leonardo Ames, construímos do zero um dos maiores e-commerces de moda infantil do Brasil.
                  </p>
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-white font-medium"><Check className="text-[#F55900] w-5 h-5 shrink-0" /> Faturamento de Múltiplos 7 dígitos</li>
                      <li className="flex items-center gap-3 text-white font-medium"><Check className="text-[#F55900] w-5 h-5 shrink-0" /> +10.000 pedidos despachados/mês</li>
                      <li className="flex items-center gap-3 text-white font-medium"><Check className="text-[#F55900] w-5 h-5 shrink-0" /> Case validador do Método W3</li>
                  </ul>
              </div>
              <div className="lg:w-1/2">
                  <ImagePlaceholder aspect="h-full min-h-[300px] lg:min-h-[400px] w-full rounded-none" icon={Rocket} />
              </div>
          </div>

          {/* Grid FGA Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { badge: "R$ 1.5 MI", sub: "FATURAMENTO/MÊS", desc: "Escala real mantendo a margem saudável" },
              { badge: "+10.000", sub: "VENDAS MENSAIS", desc: "Volume massivo através de múltiplos canais" },
              { badge: "8 CANAIS", sub: "DE AQUISIÇÃO", desc: "Previsibilidade sem depender só de um lugar" }
            ].map((caseItem, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-10 rounded-xl flex flex-col items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <h4 className="text-[#F55900] text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 relative z-10">{caseItem.badge}</h4>
                <p className="text-white text-sm font-bold tracking-widest uppercase mb-4 relative z-10">{caseItem.sub}</p>
                <p className="text-zinc-400 text-xs relative z-10">{caseItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. BASTIDORES & ESPECIALISTAS (FGA Layout aplicado ao W3) */}
      <section id="bastidores" className="py-24 px-4 bg-black border-y border-zinc-900">
         <div className="max-w-6xl mx-auto">
            
            <SectionTitle 
              subtitle="Por trás da operação"
              title="A liderança que opera o crescimento diário" 
              description="Não somos aventureiros digitais. Nossa operação real está em Blumenau/SC, onde lideramos um time focado exclusivamente em faturamento e escala."
            />

            {/* FGA Experts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 mt-16">
              {[
                { name: "LEONARDO AMES", role: "Sócio-Fundador e Especialista em Mentoria E-commerce. Cofundador da Ame Kids." },
                { name: "LUCAS MONTEIRO", role: "Sócio-Fundador e Diretor de Estratégia e Mídia de Performance." },
                { name: "GUSTAVO HOLFMAN", role: "Sócio-Fundador e Head de Operações, Tecnologia e Labs." }
              ].map((expert, i) => (
                 <div key={i} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden hover:border-[#F55900]/30 transition-all">
                    <ImagePlaceholder aspect="aspect-square" icon={Users} className="rounded-none border-0 border-b border-zinc-800" />
                    <div className="p-6 text-center">
                       <h4 className="text-white text-xl font-black uppercase tracking-wide mb-2">{expert.name}</h4>
                       <p className="text-[#F55900] text-xs font-bold uppercase tracking-widest mb-4">SÓCIO-FUNDADOR</p>
                       <p className="text-zinc-400 text-sm leading-relaxed">{expert.role}</p>
                    </div>
                 </div>
              ))}
            </div>

            {/* FGA Style Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-zinc-900 text-center">
               {[
                  { n: "+30", l: "PROFISSIONAIS" },
                  { n: "+100M", l: "GERADOS/ANO" },
                  { n: "100%", l: "ECOSSISTEMA" },
                  { n: "5", l: "UNIDADES NEGÓCIO" }
               ].map((stat, i) => (
                  <div key={i}>
                     <h4 className="text-white text-4xl md:text-5xl font-black mb-2 tracking-tighter">{stat.n}</h4>
                     <p className="text-[#F55900] text-xs md:text-sm font-bold tracking-widest uppercase">{stat.l}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 08. FAQ ACCORDION (FGA Interactive Component) */}
      <section className="py-24 px-4 bg-[#050505]">
        <div className="max-w-3xl mx-auto">
          <SectionTitle title="Perguntas Frequentes" />

          <div className="mt-12 space-y-4">
            {[
              { q: "Para qual tipo de e-commerce o Grupo W3 funciona?", a: "Nossa metodologia e ecossistema são perfeitos para marcas que já vendem no site próprio (+30k/mês), sellers de marketplaces e donos de lojas físicas querendo escalar no digital." },
              { q: "O Grupo W3 é uma agência de marketing?", a: "Não. Somos um Ecossistema de E-commerce. Uma agência foca apenas em anúncios. Nós operamos Tráfego, Mentoria, Marketplaces, Meios de Pagamento e Tecnologia para atuar em 100% da sua conversão." },
              { q: "Como funciona a Consultoria / Diagnóstico Gratuito?", a: "Você preenche o formulário e, se for selecionado, agendaremos uma reunião estratégica para mapear os gargalos da sua operação e desenhar um plano de escala." },
              { q: "Preciso contratar todas as soluções de uma vez?", a: "Não. Durante o diagnóstico, identificaremos qual a maior urgência da sua operação no momento (seja gestão de tráfego, reestruturação com a Mentoria ou escala em Marketplaces)." },
              { q: "Os fundadores realmente operam e-commerces?", a: "Sim! Leonardo Ames e os fundadores aplicam este exato método na Ame Kids, gerando múltiplos 7 dígitos anuais. Nós ensinamos e implementamos o que vivemos no campo de batalha." }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none group"
                >
                  <span className={`font-bold pr-8 text-lg ${openFAQ === index ? 'text-[#F55900]' : 'text-zinc-200 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 shrink-0 ${openFAQ === index ? 'rotate-180 text-[#F55900]' : ''}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed border-t border-zinc-900 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. CTA FINAL SUPER PREMIUM (FGA Plaque & Guarantee Vibe) */}
      <section className="py-32 px-4 bg-black border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F55900] opacity-[0.02] pattern-grid-lg"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
           
           <ImagePlaceholder aspect="aspect-square" icon={ShieldCheck} className="w-32 h-32 md:w-48 md:h-48 rounded-full mb-10 border-4 border-[#F55900]/20 shadow-[0_0_50px_rgba(245,89,0,0.1)]" />

           <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tighter uppercase font-['Montserrat']">
              Sua operação precisa de <br/>
              <span className="text-[#F55900] drop-shadow-[0_0_20px_rgba(245,89,0,0.5)]">Estrutura real.</span>
           </h2>
           <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto font-medium">
             Pare de perder margem de lucro e viva o verdadeiro crescimento escalável. Solicite agora seu diagnóstico estratégico e veja se sua marca qualifica para o ecossistema W3.
           </p>
           
           <ButtonPrimary onClick={handleApplyClick} className="w-full sm:w-auto text-lg py-6 px-12 shadow-[0_0_40px_rgba(245,89,0,0.4)]">
              SOLICITAR DIAGNÓSTICO ESTRATÉGICO <ArrowRight className="w-6 h-6 ml-2" />
           </ButtonPrimary>

           <p className="text-zinc-500 text-xs mt-6 font-bold tracking-widest uppercase"><ShieldCheck className="w-4 h-4 inline mr-1 text-[#F55900]" /> Garantimos uma análise baseada em dados reais da sua operação</p>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#050505] py-12 border-t border-zinc-900 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black tracking-tighter text-white">
            Grupo W3<span className="text-[#F55900]">.</span>
          </div>
          <div className="text-center md:text-right">
             <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
               © {new Date().getFullYear()} Grupo W3. Todos os direitos reservados.
             </p>
             <p className="text-zinc-600 text-xs">Termos de Uso e Políticas de Privacidade.</p>
          </div>
        </div>
      </footer>

      {/* MODAL REACT NATIVO */}
      <ConsultancyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  );
}
