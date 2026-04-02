/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Calendar, DollarSign, Settings, PlusCircle, MessageCircle, X, Trash2, Plus, CheckCircle2, LogOut, Shield, Loader2, LifeBuoy, BellRing, Briefcase, UsersRound, UploadCloud, ArrowLeft, Star, TrendingUp } from 'lucide-react';
import PaginaCliente from './PaginaCliente';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';
const LOGO_AURUM = 'https://res.cloudinary.com/dnilha8sq/image/upload/f_auto,q_auto/ChatGPT_Image_1_de_abr._de_2026_17_35_15_fanupb';

// ==========================================
// 🌍 MÁQUINA DE VENDAS (LANDING PAGE)
// ==========================================
function LandingPage({ onGoToAuth }) {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* 🌟 CABEÇALHO */}
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full animate-fade-in">
        <div className="flex items-center gap-3">
          <img src={LOGO_AURUM} alt="AURUM" className="w-10 h-10 rounded-xl border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
          <span className="font-['Playfair_Display'] font-bold text-xl tracking-widest text-[#D4AF37]">AURUM</span>
        </div>
        <button onClick={onGoToAuth} className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase hover:text-white transition-colors border border-[#D4AF37]/50 px-5 py-2 rounded-full hover:bg-[#D4AF37]/10">Entrar</button>
      </header>

      {/* 🌟 HERO SECTION (TOPO) */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-10 animate-slide-up relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <img src={LOGO_AURUM} alt="AURUM Premium" className="w-40 h-40 md:w-56 md:h-56 rounded-[2rem] shadow-[0_0_80px_rgba(212,175,55,0.3)] border border-[#D4AF37]/20" />
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] text-white max-w-4xl leading-tight">
          O Sistema Definitivo para Salões de <span className="text-[#D4AF37] italic">Alto Padrão</span>
        </h1>
        
        <p className="text-[#A8A8A8] max-w-2xl text-lg md:text-xl font-light leading-relaxed">
          Esqueça as agendas de papel e sistemas feios. Gerencie sua agenda, calcule comissões, controle seu fluxo de caixa e fidelize seus clientes com a plataforma mais exclusiva do mercado.
        </p>
        
        <button onClick={onGoToAuth} className="bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] px-12 py-5 rounded-full font-bold tracking-widest uppercase text-sm shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-105 transition-all flex items-center gap-3">
          Testar Grátis Agora <ChevronRight size={18} strokeWidth={3} />
        </button>
      </main>

      {/* 🌟 BENEFÍCIOS */}
      <section className="bg-[#1A1A1A] py-24 border-y border-[#2A2A2A] relative z-0">
        <div className="max-w-6xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#D4AF37]">A Experiência AURUM</h2>
             <p className="text-[#A8A8A8] font-light">Tudo o que você precisa para escalar o seu negócio.</p>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-colors group">
               <Calendar size={32} className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-medium text-white mb-3">Agenda Inteligente</h3>
               <p className="text-[#6F6F6F] text-sm leading-relaxed">Link VIP com a sua logo para clientes agendarem sozinhos 24h por dia.</p>
             </div>
             <div className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-colors group">
               <DollarSign size={32} className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-medium text-white mb-3">Fluxo de Caixa</h3>
               <p className="text-[#6F6F6F] text-sm leading-relaxed">Acompanhe seus ganhos diários e o faturamento bruto em tempo real.</p>
             </div>
             <div className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-colors group">
               <Briefcase size={32} className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-medium text-white mb-3">Gestão de Equipe</h3>
               <p className="text-[#6F6F6F] text-sm leading-relaxed">Cadastre profissionais e deixe o sistema calcular as comissões automaticamente.</p>
             </div>
             <div className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-colors group">
               <UsersRound size={32} className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-medium text-white mb-3">CRM de Clientes</h3>
               <p className="text-[#6F6F6F] text-sm leading-relaxed">Lista completa dos seus clientes e botão para enviar promoções pelo WhatsApp.</p>
             </div>
           </div>
        </div>
      </section>

      {/* 🌟 PREÇOS (OS PLANOS) */}
      <section className="py-24 max-w-5xl mx-auto px-6 relative">
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
         <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-white">Escolha sua Exclusividade</h2>
            <p className="text-[#A8A8A8] font-light">Sem taxas escondidas. Sem fidelidade.</p>
         </div>
         
         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PLANO AUTÔNOMO */}
            <div className="bg-[#1A1A1A] p-8 md:p-10 rounded-[2.5rem] border border-[#2A2A2A] flex flex-col hover:border-[#D4AF37]/30 transition-all">
               <div className="mb-8">
                 <span className="text-[#A8A8A8] text-[10px] font-bold tracking-widest uppercase mb-2 block">Para Profissionais Individuais</span>
                 <h3 className="text-3xl font-['Playfair_Display'] text-white mb-4">Plano Autônomo</h3>
                 <div className="flex items-end gap-1 mb-2">
                   <span className="text-lg text-[#6F6F6F] font-bold pb-2">R$</span>
                   <span className="text-5xl font-bold text-[#D4AF37]">19,90</span>
                   <span className="text-sm text-[#6F6F6F] pb-2">/mês</span>
                 </div>
               </div>
               <div className="flex-1 space-y-4 mb-10">
                 <p className="flex items-center gap-3 text-sm text-[#A8A8A8]"><CheckCircle2 size={18} className="text-[#D4AF37]"/> Link VIP de Agendamento</p>
                 <p className="flex items-center gap-3 text-sm text-[#A8A8A8]"><CheckCircle2 size={18} className="text-[#D4AF37]"/> Sua Logo no Aplicativo</p>
                 <p className="flex items-center gap-3 text-sm text-[#A8A8A8]"><CheckCircle2 size={18} className="text-[#D4AF37]"/> Controle de Caixa Diário</p>
                 <p className="flex items-center gap-3 text-sm text-[#A8A8A8]"><CheckCircle2 size={18} className="text-[#D4AF37]"/> CRM (Lista de Clientes)</p>
               </div>
               <button onClick={onGoToAuth} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-xs hover:border-[#D4AF37] transition-all">Assinar Autônomo</button>
            </div>

            {/* PLANO SALÃO (DESTAQUE) */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-8 md:p-10 rounded-[2.5rem] border-2 border-[#D4AF37] flex flex-col relative shadow-[0_0_40px_rgba(212,175,55,0.15)] transform md:-translate-y-4">
               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-lg">
                 <Star size={12} className="fill-[#0D0D0D]" /> Mais Escolhido
               </div>
               <div className="mb-8">
                 <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-2 block">Para Salões e Barbearias</span>
                 <h3 className="text-3xl font-['Playfair_Display'] text-white mb-4">Plano Equipe VIP</h3>
                 <div className="flex items-end gap-1 mb-2">
                   <span className="text-lg text-[#D4AF37] font-bold pb-2 opacity-80">R$</span>
                   <span className="text-5xl font-bold text-[#E6C76B]">24,99</span>
                   <span className="text-sm text-[#A8A8A8] pb-2">/mês</span>
                 </div>
               </div>
               <div className="flex-1 space-y-4 mb-10">
                 <p className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={18} className="text-[#D4AF37]"/> Tudo do Plano Autônomo</p>
                 <p className="flex items-center gap-3 text-sm text-white"><TrendingUp size={18} className="text-[#D4AF37]"/> Cadastro de Profissionais Ilimitado</p>
                 <p className="flex items-center gap-3 text-sm text-white"><TrendingUp size={18} className="text-[#D4AF37]"/> Cliente escolhe quem vai atender</p>
                 <p className="flex items-center gap-3 text-sm text-white"><TrendingUp size={18} className="text-[#D4AF37]"/> Cálculo Automático de Comissões</p>
               </div>
               <button onClick={onGoToAuth} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-4 rounded-2xl font-bold tracking-widest uppercase text-xs hover:scale-105 transition-transform shadow-lg">Assinar Equipe VIP</button>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2A2A2A] bg-[#0D0D0D] py-8 text-center">
        <img src={LOGO_AURUM} alt="AURUM" className="w-8 h-8 rounded-lg mx-auto mb-4 opacity-50 grayscale" />
        <p className="text-[#6F6F6F] text-xs">© 2026 AURUM Premium SaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}


// ==========================================
// 🔐 TELA DE AUTENTICAÇÃO
// ==========================================
function TelaAuth({ onLogin, onVoltar }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); 
  const [telefone, setTelefone] = useState(''); const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(false);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (tel) => tel.replace(/\D/g, '').length >= 10;

  const handleSubmitTradicional = async (e) => {
    e.preventDefault(); setErro('');
    if (!validarEmail(email)) return setErro('Por favor, insira um e-mail válido.');
    if (senha.length < 6) return setErro('⚠️ Segurança: A senha deve ter no mínimo 6 caracteres.');
    if (!isLogin && !validarTelefone(telefone)) return setErro('Por favor, insira um WhatsApp válido.');

    setCarregando(true);
    const endpoint = isLogin ? '/login' : '/cadastro';
    const body = isLogin ? { email, senha } : { nome, email, senha, telefone };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na autenticação');
      onLogin(data.token, data.usuario);
    } catch (err) { setErro(err.message === 'Failed to fetch' ? 'Servidor acordando, aguarde uns segundos...' : err.message); } 
    finally { setCarregando(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center p-6 font-['Inter'] relative">
      <button onClick={onVoltar} className="absolute top-6 left-6 text-[#A8A8A8] hover:text-[#D4AF37] flex items-center gap-2 text-sm transition-colors"><ArrowLeft size={18}/> Voltar</button>
      
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={LOGO_AURUM} alt="AURUM Logo" className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover shadow-[0_0_50px_rgba(212,175,55,0.25)] mb-4 border border-[#D4AF37]/30" />
        </div>

        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6 text-center">{isLogin ? 'Acesse seu espaço' : 'Crie sua exclusividade'}</h2>
          {erro && <div className="bg-red-900/20 text-red-200 p-3 rounded-lg text-sm mb-4 text-center animate-fade-in">{erro}</div>}
          <form onSubmit={handleSubmitTradicional} className="space-y-4">
            {!isLogin && (
              <>
                <div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">Nome do Profissional / Salão</label><input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
                <div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">WhatsApp (Com DDD)</label><input type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
              </>
            )}
            <div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
            <div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">Senha Segura</label><input type="password" required placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
            <button type="submit" disabled={carregando} className={`w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium tracking-widest uppercase text-sm mt-2 flex justify-center items-center gap-2 ${carregando ? 'opacity-70 cursor-wait' : 'hover:bg-[#E6C76B]'}`}>
              {carregando ? <><Loader2 className="w-4 h-4 animate-spin text-[#0D0D0D]" /> Conectando...</> : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>
          </form>
          <div className="mt-8 text-center"><button onClick={() => { setIsLogin(!isLogin); setErro(''); setSenha(''); }} className="text-[#A8A8A8] text-sm hover:text-white transition-colors">{isLogin ? 'Não tem uma conta? Crie aqui.' : 'Já tem uma conta? Faça login.'}</button></div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🛡️ CONTROLADOR PÚBLICO (LANDING OU AUTH)
// ==========================================
function HomePublica({ onLogin }) {
  const [mostrarAuth, setMostrarAuth] = useState(false);
  if (mostrarAuth) {
    return <TelaAuth onLogin={onLogin} onVoltar={() => setMostrarAuth(false)} />;
  }
  return <LandingPage onGoToAuth={() => setMostrarAuth(true)} />;
}

// ==========================================
// 💎 PAINEL PROTEGIDO (PROFISSIONAL E CEO)
// ==========================================
function PainelProfissional({ token, usuario, onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('home');
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarFormServico, setMostrarFormServico] = useState(false);

  const [ganhoDia, setGanhoDia] = useState(0);
  const [qtdAtendimentos, setQtdAtendimentos] = useState(0);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [historicoCaixa, setHistoricoCaixa] = useState([]);
  const [dadosCeo, setDadosCeo] = useState({ totalEmpresas: 0, faturamentoGlobal: 0, empresas: [] });

  const [ticketsSuporte, setTicketsSuporte] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [mostrarFormFuncionario, setMostrarFormFuncionario] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', comissao: '' });
  const [listaClientes, setListaClientes] = useState([]);

  const [novoServico, setNovoServico] = useState({ nome: '', preco: '', tempo: '' });
  const [vendaNome, setVendaNome] = useState('');
  const [vendaServico, setVendaServico] = useState(null);

  const [modalSuporte, setModalSuporte] = useState(false);
  const [textoSuporte, setTextoSuporte] = useState('');
  const [notificacao, setNotificacao] = useState(null);
  const [qtdAnteriorAgendamentos, setQtdAnteriorAgendamentos] = useState(0);
  
  const todosHorarios = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  const [meusHorarios, setMeusHorarios] = useState([]);
  
  const [meuLogo, setMeuLogo] = useState(null);
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  const linkBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const linkCliente = `${linkBase}/agendar/${usuario.id}`;
  const mensagemPromo = encodeURIComponent(`✨ Exclusividade e sofisticação. Agende sua experiência premium com ${usuario.nome}: ${linkCliente}`);

  const headersAPI = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const carregarTudo = useCallback(async () => {
    try {
      fetch(`${API_URL}/dashboard`, { headers: headersAPI }).then(r=>r.ok?r.json():null).then(d=>{ if(d && !d.error){ setGanhoDia(d.ganhoDia||0); setQtdAtendimentos(d.qtdAtendimentos||0); }});
      fetch(`${API_URL}/servicos`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setServicos(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/vendas`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setHistoricoCaixa(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/funcionarios`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setFuncionarios(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/clientes`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setListaClientes(Array.isArray(d) ? d : []));
      
      fetch(`${API_URL}/configuracoes`, { headers: headersAPI }).then(r=>r.ok?r.json():null).then(d=>{ 
        if(d && !d.error) {
          if(d.horarios_trabalho) setMeusHorarios(d.horarios_trabalho.split(','));
          if(d.logo_url) setMeuLogo(d.logo_url);
        }
      });

      if (usuario.is_ceo) {
        fetch(`${API_URL}/ceo/dashboard`, { headers: headersAPI }).then(r=>r.ok?r.json():null).then(d=>{ if(d && !d.error) setDadosCeo(d); });
        fetch(`${API_URL}/ceo/tickets`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setTicketsSuporte(Array.isArray(d) ? d : []));
      }

      fetch(`${API_URL}/agendamentos`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d => {
        if(Array.isArray(d)) {
          if (d.length > qtdAnteriorAgendamentos && qtdAnteriorAgendamentos !== 0) {
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(e=>console.log(e));
            setNotificacao('Cliente Confirmado!'); setTimeout(() => setNotificacao(null), 5000); 
          }
          setAgendamentos(d); setQtdAnteriorAgendamentos(d.length);
        }
      });
    } catch (errorLog) { console.error("Erro geral no fetch:", errorLog); }
  }, [token, qtdAnteriorAgendamentos, usuario.is_ceo]);

  useEffect(() => { carregarTudo(); const intervalo = setInterval(carregarTudo, 30000); return () => clearInterval(intervalo); }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250; const MAX_HEIGHT = 250;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
        else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setMeuLogo(dataUrl);
      }
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const salvarMeusHorarios = async (horaClicada) => {
    let novosHorarios = [...meusHorarios];
    if (novosHorarios.includes(horaClicada)) novosHorarios = novosHorarios.filter(h => h !== horaClicada); else novosHorarios.push(horaClicada);
    novosHorarios.sort(); setMeusHorarios(novosHorarios);
    setSalvandoConfig(true);
    try { await fetch(`${API_URL}/configuracoes`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ horarios: novosHorarios.join(','), logo_url: meuLogo }) }); } catch (e) { console.error(e); alert("Erro ao salvar."); }
    setSalvandoConfig(false);
  };

  const salvarApenasLogo = async () => {
    setSalvandoConfig(true);
    try { 
      await fetch(`${API_URL}/configuracoes`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ horarios: meusHorarios.join(','), logo_url: meuLogo }) }); 
      alert("Logo atualizada com sucesso!");
    } catch (e) { console.error(e); alert("Erro ao salvar a logo."); }
    setSalvandoConfig(false);
  }

  const adicionarServico = async () => {
    if (!novoServico.nome || !novoServico.preco) return;
    await fetch(`${API_URL}/servicos`, { method: 'POST', headers: headersAPI, body: JSON.stringify(novoServico) });
    setNovoServico({ nome: '', preco: '', tempo: '' }); setMostrarFormServico(false); carregarTudo();
  };
  const removerServico = async (id) => { await fetch(`${API_URL}/servicos/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };

  const adicionarFuncionario = async () => {
    if (!novoFuncionario.nome) return;
    await fetch(`${API_URL}/funcionarios`, { method: 'POST', headers: headersAPI, body: JSON.stringify(novoFuncionario) });
    setNovoFuncionario({ nome: '', comissao: '' }); setMostrarFormFuncionario(false); carregarTudo();
  };
  const removerFuncionario = async (id) => {
    if(!window.confirm('Deseja excluir este profissional da equipe?')) return;
    await fetch(`${API_URL}/funcionarios/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo();
  };

  const confirmarVenda = async (e) => {
    e.preventDefault(); if (!vendaServico) return;
    console.log("Venda avulsa registrada para:", vendaNome || "Sem nome");
    await fetch(`${API_URL}/vendas`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ valor: parseFloat(vendaServico.preco) }) });
    setVendaNome(''); setVendaServico(null); setModalAberto(false); carregarTudo();
  };

  const concluirAtendimento = async (agendamento) => {
    await fetch(`${API_URL}/agendamentos/${agendamento.id}/concluir`, { method: 'POST', headers: headersAPI });
    carregarTudo();
    if (agendamento.cliente_whatsapp) {
      const num = agendamento.cliente_whatsapp.replace(/\D/g, '');
      const txt = `✨ Olá, ${agendamento.cliente_nome.split(' ')[0]}! Aqui é do ${usuario.nome}.\n\nPassando para agradecer imensamente pela sua visita e confiança no nosso trabalho hoje! Esperamos que tenha tido uma experiência premium.\n\nVolte sempre! 🤝`;
      window.open(`https://wa.me/55${num}?text=${encodeURIComponent(txt)}`, '_blank');
    }
  };

  const excluirEmpresa = async (id, nomeEmpresa) => {
    if (!window.confirm(`⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente o salão "${nomeEmpresa}"?\nTodos os dados, serviços e faturamento deles serão apagados.`)) return;
    const res = await fetch(`${API_URL}/ceo/usuarios/${id}`, { method: 'DELETE', headers: headersAPI });
    if (res.ok) { alert("Removido com sucesso."); carregarTudo(); } else { alert("Erro ao excluir."); }
  };

  const enviarSuporteParaCEO = async (e) => {
    e.preventDefault();
    try { await fetch(`${API_URL}/tickets`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ mensagem: textoSuporte }) }); } catch(err) { console.error("Falha ao salvar ticket", err); }
    window.open(`https://wa.me/5573998055316?text=${encodeURIComponent(`💡 *Novo Ticket de Suporte*\n\n*Assinante:* ${usuario.nome}\n*ID da Conta:* ${usuario.id}\n\n*Mensagem:*\n"${textoSuporte}"`)}`, '_blank');
    setModalSuporte(false); setTextoSuporte('');
  };

  const resolverTicket = async (id) => { await fetch(`${API_URL}/ceo/tickets/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] font-['Inter'] text-white relative overflow-hidden">
      {notificacao && (<div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] px-6 py-3.5 rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.6)] font-bold text-sm z-50 animate-slide-down flex items-center gap-3"><BellRing size={18} className="animate-bounce" /> {notificacao}</div>)}
      <header className="bg-[#1A1A1A] p-6 shadow-[0_1px_0_rgba(42,42,42,1)] flex justify-between items-center sticky top-0 z-10 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-4">
          {meuLogo && <img src={meuLogo} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]" />}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold font-['Playfair_Display'] tracking-wide text-[#D4AF37]">{usuario.nome}</h1>
            <p className="text-[10px] tracking-widest text-[#A8A8A8] mt-1 uppercase">{usuario.is_ceo ? '⚡ PAINEL MASTER' : `SISTEMA AURUM`}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-10 h-10 border border-[#2A2A2A] bg-[#0D0D0D] text-[#A8A8A8] hover:text-[#ff4d4d] hover:border-[#ff4d4d] transition-colors rounded-full flex items-center justify-center"><LogOut size={16} /></button>
      </header>

      <main className="flex-1 p-6 pb-36 overflow-y-auto space-y-8">
        {telaAtiva === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center pt-2 pb-2"><h2 className="text-3xl font-normal font-['Playfair_Display'] text-white">Visão Geral</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-[0_4px_20px_rgba(212,175,55,0.1)] relative overflow-hidden"><span className="text-[#A8A8A8] text-[10px] font-bold tracking-widest uppercase block mb-2">Ganhos Hoje</span><span className="text-3xl font-normal font-['Playfair_Display'] text-[#E6C76B] block leading-none">R$ {ganhoDia.toFixed(2).replace('.', ',')}</span></div>
              <div className="bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-3xl border border-[#2A2A2A] shadow-lg"><span className="text-[#A8A8A8] text-[10px] font-bold tracking-widest uppercase block mb-2">Atendimentos</span><span className="text-3xl font-normal font-['Playfair_Display'] text-white block leading-none">{qtdAtendimentos}</span></div>
            </div>
            <div className="pt-4 space-y-4">
              <button onClick={() => setModalAberto(true)} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-7 rounded-4xl font-bold flex flex-col items-center justify-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform"><PlusCircle size={36} strokeWidth={2} /><span className="text-sm tracking-widest uppercase mt-1">Adicionar Venda Extra</span></button>
              <a href={`https://wa.me/?text=${mensagemPromo}`} target="_blank" rel="noreferrer" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white py-5 rounded-2xl font-medium flex items-center justify-center gap-3 text-sm hover:border-[#D4AF37] transition-all"><MessageCircle size={20} className="text-[#D4AF37]" /> Divulgar Link de Agendamento</a>
            </div>
          </div>
        )}

        {telaAtiva === 'agenda' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-normal font-['Playfair_Display'] text-white mb-6">Sua Agenda</h2>
            <div className="space-y-5">
              {agendamentos.length === 0 ? <p className="text-center text-[#6F6F6F] py-12 font-light border border-dashed border-[#2A2A2A] rounded-3xl">Sua agenda está livre.</p> : agendamentos.map((ag) => (
                  <div key={ag.id} className="bg-[#1A1A1A] p-0 rounded-3xl border border-[#2A2A2A] flex flex-col overflow-hidden group hover:border-[#D4AF37]/50 transition-colors shadow-lg">
                    <div className="bg-[#0D0D0D] px-6 py-4 border-b border-[#2A2A2A] flex justify-between items-center"><div className="flex items-center gap-3"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span><span className="text-[#D4AF37] font-['Playfair_Display'] text-xl">{ag.horario ? ag.horario.split(',')[0] : '--:--'}</span><span className="text-[#6F6F6F] text-xs ml-2 border-l border-[#2A2A2A] pl-3">{ag.data_reserva}</span></div><span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[9px] uppercase tracking-widest font-bold border border-emerald-500/20">Confirmado</span></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4"><div><p className="text-white font-medium text-lg">{ag.cliente_nome}</p><p className="text-[#A8A8A8] text-sm mt-1">{ag.servico_nome}</p></div><span className="text-white font-['Playfair_Display'] text-xl">R$ {parseFloat(ag.valor).toFixed(2).replace('.', ',')}</span></div>
                      {ag.funcionario_nome && (<div className="mb-6 inline-block bg-[#2A2A2A] text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium">Profissional: {ag.funcionario_nome}</div>)}
                      <button onClick={() => concluirAtendimento(ag)} className="w-full bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37] p-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-colors"><CheckCircle2 size={18} /> Finalizar & Agradecer</button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {telaAtiva === 'caixa' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end mb-6"><h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Fluxo de Caixa</h2><span className="text-[#D4AF37] font-['Playfair_Display'] text-xl">R$ {ganhoDia.toFixed(2).replace('.', ',')} <span className="text-[10px] text-[#A8A8A8] font-['Inter'] font-light uppercase tracking-widest block text-right">Hoje</span></span></div>
            <div className="space-y-3">
              {historicoCaixa.length === 0 ? <p className="text-center text-[#6F6F6F] py-8 font-light border border-dashed border-[#2A2A2A] rounded-3xl">Nenhuma movimentação.</p> : historicoCaixa.map((item) => {
                  const dataObj = new Date(item.data_venda);
                  return (
                    <div key={item.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col gap-3 hover:border-[#D4AF37]/30 transition-colors">
                      <div className="flex justify-between items-center"><div className="flex items-center gap-4"><div className="bg-[#0D0D0D] p-3 rounded-xl border border-[#2A2A2A] text-[#D4AF37]"><DollarSign size={20} strokeWidth={1.5} /></div><div><p className="text-white font-medium text-sm">Entrada Recebida</p><p className="text-[#A8A8A8] text-xs mt-1 font-light">{dataObj.toLocaleDateString('pt-BR')} às {dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p></div></div><span className="text-[#D4AF37] font-['Playfair_Display'] text-lg">+ R$ {parseFloat(item.valor).toFixed(2).replace('.', ',')}</span></div>
                      {item.funcionario_nome && (<div className="bg-[#0D0D0D] rounded-lg p-3 flex justify-between items-center text-xs mt-2 border border-[#2A2A2A]"><span className="text-[#A8A8A8]">Profissional: <span className="text-white">{item.funcionario_nome}</span></span><span className="text-red-400">Comissão: - R$ {parseFloat(item.comissao_valor).toFixed(2).replace('.', ',')}</span></div>)}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {telaAtiva === 'clientes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Meus Clientes</h2><span className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium">{listaClientes.length} Total</span></div>
            <div className="space-y-4">
              {listaClientes.length === 0 ? <p className="text-center text-[#6F6F6F] py-8 font-light border border-dashed border-[#2A2A2A] rounded-3xl">Sua lista de clientes está vazia.</p> : listaClientes.map((cliente, idx) => {
                  const dataUltimaVisita = cliente.ultima_visita ? new Date(cliente.ultima_visita).toLocaleDateString('pt-BR') : 'Nunca';
                  const numeroFormatado = cliente.whatsapp?.replace(/\D/g, '');
                  const saudacao = encodeURIComponent(`Olá ${cliente.nome.split(' ')[0]}! Tudo bem? Faz um tempinho que não te vemos no ${usuario.nome}. Que tal agendar um horário hoje? ✨`);
                  return (
                    <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl flex flex-col gap-4 shadow-md hover:border-[#D4AF37]/30 transition-colors">
                      <div className="flex justify-between items-start"><div><p className="text-white font-medium text-lg">{cliente.nome}</p><p className="text-[#A8A8A8] text-xs mt-1">{cliente.whatsapp}</p></div><div className="text-right"><span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">{cliente.total_visitas} Visitas</span></div></div>
                      <div className="bg-[#0D0D0D] p-3 rounded-xl border border-[#2A2A2A] flex justify-between items-center"><span className="text-xs text-[#6F6F6F]">Última visita: <span className="text-white">{dataUltimaVisita}</span></span><a href={`https://wa.me/55${numeroFormatado}?text=${saudacao}`} target="_blank" rel="noreferrer" className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Enviar Promoção</a></div>
                    </div>
                  );
              })}
            </div>
          </div>
        )}

        {telaAtiva === 'equipe' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Sua Equipe</h2><button onClick={() => setMostrarFormFuncionario(!mostrarFormFuncionario)} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-wider font-medium">{mostrarFormFuncionario ? 'Cancelar' : <><Plus size={16}/> Adicionar</>}</button></div>
            {mostrarFormFuncionario && (
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] space-y-4 animate-slide-up mb-8 shadow-lg">
                <div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Nome</label><input type="text" value={novoFuncionario.nome} onChange={(e) => setNovoFuncionario({...novoFuncionario, nome: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"/></div>
                <div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Comissão (%)</label><input type="number" value={novoFuncionario.comissao} onChange={(e) => setNovoFuncionario({...novoFuncionario, comissao: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#D4AF37] rounded-xl focus:border-[#D4AF37] outline-none"/></div>
                <button onClick={adicionarFuncionario} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium mt-2">Salvar Profissional</button>
              </div>
            )}
            <div className="space-y-4">
              {funcionarios.length === 0 ? <p className="text-center text-[#6F6F6F] py-8 font-light border border-dashed border-[#2A2A2A] rounded-3xl">Nenhum profissional cadastrado.</p> : funcionarios.map((func) => (
                  <div key={func.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl flex justify-between items-center"><div className="flex flex-col gap-1"><p className="text-white font-medium text-lg flex items-center gap-2"><Briefcase size={16} className="text-[#D4AF37]" /> {func.nome}</p><p className="text-[#A8A8A8] text-sm">Comissão: <span className="text-[#D4AF37]">{func.comissao}%</span></p></div><button onClick={() => removerFuncionario(func.id)} className="text-[#6F6F6F] hover:text-[#ff4d4d] bg-[#0D0D0D] p-3 rounded-lg border border-[#2A2A2A] transition-colors"><Trash2 size={18} /></button></div>
              ))}
            </div>
          </div>
        )}
        
        {telaAtiva === 'config' && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-10 pb-8 border-b border-[#2A2A2A]">
               <h2 className="text-2xl font-normal font-['Playfair_Display'] text-white mb-2">Sua Marca</h2>
               <p className="text-xs text-[#A8A8A8] mb-6 font-light">Faça upload da logo do seu salão para ela aparecer na tela de agendamento dos seus clientes.</p>
               <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#D4AF37]/50 flex items-center justify-center bg-[#0D0D0D] overflow-hidden">
                   {meuLogo ? <img src={meuLogo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-xs text-[#6F6F6F]">Sem Logo</span>}
                 </div>
                 <div className="flex-1">
                   <label className="bg-[#1A1A1A] border border-[#2A2A2A] text-white px-4 py-3 rounded-xl text-sm cursor-pointer hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-2 max-w-50">
                      <UploadCloud size={18} className="text-[#D4AF37]"/> Escolher Imagem
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </label>
                   {meuLogo && (
                     <button onClick={salvarApenasLogo} disabled={salvandoConfig} className="mt-3 text-sm text-[#D4AF37] font-bold tracking-widest uppercase">
                       {salvandoConfig ? 'Salvando...' : 'Salvar Logo'}
                     </button>
                   )}
                 </div>
               </div>
            </div>

            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Menu de Experiências</h2><button onClick={() => setMostrarFormServico(!mostrarFormServico)} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-wider font-medium">{mostrarFormServico ? 'Cancelar' : <><Plus size={16}/> Adicionar</>}</button></div>
            {mostrarFormServico && (
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] space-y-4 animate-slide-up mb-8 shadow-lg">
                <div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Nome da Experiência</label><input type="text" value={novoServico.nome} onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"/></div>
                <div className="flex gap-4"><div className="flex-1"><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Valor (R$)</label><input type="text" value={novoServico.preco} onChange={(e) => setNovoServico({...novoServico, preco: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#D4AF37] rounded-xl focus:border-[#D4AF37] outline-none"/></div><div className="flex-1"><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Tempo</label><input type="text" value={novoServico.tempo} onChange={(e) => setNovoServico({...novoServico, tempo: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"/></div></div>
                <button onClick={adicionarServico} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium mt-2">Salvar Experiência</button>
              </div>
            )}
            <div className="space-y-4">
              {servicos.map((servico) => (
                  <div key={servico.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex justify-between items-center group"><div><p className="text-white font-medium text-lg">{servico.nome}</p><p className="text-[#A8A8A8] text-sm mt-1">{servico.tempo}</p></div><div className="flex items-center gap-5"><span className="text-[#D4AF37] text-xl font-['Playfair_Display']">R$ {parseFloat(servico.preco).toFixed(2).replace('.', ',')}</span><button onClick={() => removerServico(servico.id)} className="text-[#6F6F6F] hover:text-[#ff4d4d] p-2"><Trash2 size={18} /></button></div></div>
              ))}
            </div>
            <div className="pt-8 border-t border-[#2A2A2A] mt-8"><h2 className="text-xl font-normal font-['Playfair_Display'] text-white mb-2">Grade de Horários</h2><p className="text-xs text-[#A8A8A8] mb-6 font-light">Desmarque os horários de almoço ou pausas.</p><div className="grid grid-cols-3 gap-3">{todosHorarios.map(hora => { const atende = meusHorarios.includes(hora); return (<button key={hora} onClick={() => salvarMeusHorarios(hora)} className={`py-3.5 rounded-xl border text-sm font-medium transition-colors ${atende ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'bg-[#0D0D0D] text-[#4A4A4A] border-[#2A2A2A] line-through'}`}>{hora}</button>); })}</div></div>
          </div>
        )}

        {telaAtiva === 'ceo' && usuario.is_ceo && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10"><h2 className="text-3xl font-normal font-['Playfair_Display'] text-[#D4AF37]">Central de Comando</h2></div>
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-lg"><span className="text-[#A8A8A8] text-[10px] font-bold tracking-widest uppercase block mb-2">Empresas Ativas</span><span className="text-4xl font-normal font-['Playfair_Display'] text-white block leading-none">{dadosCeo.totalEmpresas}</span></div>
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-lg"><span className="text-[#A8A8A8] text-[10px] font-bold tracking-widest uppercase block mb-2">Giro Global</span><span className="text-3xl font-normal font-['Playfair_Display'] text-[#E6C76B] block leading-none">R$ {dadosCeo.faturamentoGlobal?.toFixed(2).replace('.', ',')}</span></div>
            </div>
            
            <div className="mt-10"><h3 className="text-xl font-normal font-['Playfair_Display'] text-white mb-6">Gestão de Assinantes</h3><div className="space-y-4">
                {dadosCeo.empresas?.map((empresa) => (
                    <div key={empresa.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl flex justify-between items-center"><div className="flex-1"><p className="text-white font-medium text-lg">{empresa.nome}</p><div className="text-[#A8A8A8] text-xs mt-3 flex flex-col gap-2"><span className="flex items-center gap-2"><span className="bg-[#2A2A2A] text-white px-2 py-0.5 rounded text-[10px] font-bold">ID: {empresa.id}</span> {empresa.telefone}</span><span className="text-[#6F6F6F]">✉️ {empresa.email}</span></div></div><div className="text-right mr-5"><span className="text-[10px] text-[#6F6F6F] font-bold uppercase tracking-widest block">Faturamento</span><span className="text-lg text-[#D4AF37] font-['Playfair_Display'] block mt-1">R$ {parseFloat(empresa.faturamento_total).toFixed(2).replace('.', ',')}</span></div><button onClick={() => excluirEmpresa(empresa.id, empresa.nome)} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] text-[#6F6F6F] rounded-xl hover:text-red-500 transition-all"><Trash2 size={18} /></button></div>
                ))}
              </div></div>

            <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
              <h3 className="text-xl font-normal font-['Playfair_Display'] text-white mb-6 flex items-center gap-3">
                Tickets de Suporte {ticketsSuporte.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{ticketsSuporte.length}</span>}
              </h3>
              <div className="space-y-4">
                {ticketsSuporte.length === 0 ? (
                  <p className="text-[#6F6F6F] font-light text-center py-6 border border-dashed border-[#2A2A2A] rounded-3xl">Nenhum chamado aberto. Tudo tranquilo!</p>
                ) : (
                  ticketsSuporte.map(ticket => {
                    const dataObj = new Date(ticket.data_criacao);
                    return (
                    <div key={ticket.id} className="bg-[#1A1A1A] border border-red-900/30 p-6 rounded-2xl flex flex-col gap-4 shadow-lg relative">
                       <div className="flex justify-between items-start">
                         <div>
                           <p className="text-white font-medium text-lg">{ticket.salao_nome}</p>
                           <p className="text-[#A8A8A8] text-xs mt-1">{dataObj.toLocaleDateString('pt-BR')} às {dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                         <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-[9px] uppercase tracking-widest font-bold border border-red-500/20">Pendente</span>
                       </div>
                       <div className="bg-[#0D0D0D] p-4 rounded-xl border border-[#2A2A2A]">
                         <p className="text-sm text-[#A8A8A8] italic">"{ticket.mensagem}"</p>
                       </div>
                       <div className="flex gap-3 mt-2">
                         <a href={`https://wa.me/55${ticket.salao_whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${ticket.salao_nome}, vi que você abriu um ticket de suporte no sistema AURUM. Como posso ajudar?`)}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#2A2A2A] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-[#3A3A3A] transition-colors">WhatsApp</a>
                         <button onClick={() => resolverTicket(ticket.id)} className="flex-1 bg-emerald-500/10 text-emerald-500 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">Resolvido</button>
                       </div>
                    </div>
                  )})
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <nav className="bg-[#1A1A1A] border-t border-[#2A2A2A] fixed bottom-0 w-full flex justify-around p-3 pb-safe z-10">
        <NavButton icone={<Home />} texto="Início" ativo={telaAtiva === 'home'} onClick={() => setTelaAtiva('home')} />
        <NavButton icone={<Calendar />} texto="Agenda" ativo={telaAtiva === 'agenda'} onClick={() => setTelaAtiva('agenda')} />
        <NavButton icone={<DollarSign />} texto="Caixa" ativo={telaAtiva === 'caixa'} onClick={() => setTelaAtiva('caixa')} />
        <NavButton icone={<UsersRound />} texto="Clientes" ativo={telaAtiva === 'clientes'} onClick={() => setTelaAtiva('clientes')} />
        <NavButton icone={<Briefcase />} texto="Equipe" ativo={telaAtiva === 'equipe'} onClick={() => setTelaAtiva('equipe')} />
        <NavButton icone={<Settings />} texto="Ajustes" ativo={telaAtiva === 'config'} onClick={() => setTelaAtiva('config')} />
        {usuario.is_ceo && <NavButton icone={<Shield />} texto="Admin" ativo={telaAtiva === 'ceo'} onClick={() => setTelaAtiva('ceo')} isDestaque={true} />}
      </nav>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-end z-50 animate-fade-in"><div className="bg-[#1A1A1A] w-full rounded-t-[2.5rem] p-8 border-t border-[#2A2A2A] animate-slide-up"><div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-normal font-['Playfair_Display'] text-white">Venda Manual</h2><button onClick={() => setModalAberto(false)} className="text-[#A8A8A8] hover:text-white p-2 bg-[#2A2A2A] rounded-full transition-colors"><X size={20}/></button></div><form onSubmit={confirmarVenda} className="space-y-6"><div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Cliente (Opcional)</label><input type="text" placeholder="Nome do cliente" className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-5 text-white rounded-2xl focus:border-[#D4AF37] outline-none" value={vendaNome} onChange={(e) => setVendaNome(e.target.value)} /></div><div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-3 block">Selecione a Experiência</label><div className="flex flex-wrap gap-3">{servicos.map((item) => (<button type="button" key={item.id} onClick={() => setVendaServico(item)} className={`px-5 py-3.5 rounded-xl border text-sm font-medium transition-all ${vendaServico?.id === item.id ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'bg-[#0D0D0D] text-[#A8A8A8] border-[#2A2A2A]'}`}>{item.nome}</button>))}</div></div>{vendaServico && (<div className="bg-[#0D0D0D] border border-[#D4AF37]/30 p-5 rounded-2xl flex justify-between items-center mt-4"><span className="text-[#A8A8A8] font-light">Valor a receber:</span><span className="text-[#D4AF37] text-3xl font-['Playfair_Display']">R$ {parseFloat(vendaServico.preco).toFixed(2).replace('.', ',')}</span></div>)}<button type="submit" disabled={!vendaServico} className={`w-full p-5 flex justify-center gap-3 rounded-2xl transition-all mt-4 ${vendaServico ? 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A] cursor-not-allowed'}`}><CheckCircle2 size={22} /> <span className="font-bold tracking-widest uppercase text-sm">Receber Dinheiro</span></button></form></div></div>
      )}
      {!usuario.is_ceo && (<button onClick={() => setModalSuporte(true)} className="fixed bottom-24 right-4 bg-[#1A1A1A] text-[#D4AF37] border border-[#2A2A2A] p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-colors z-40"><LifeBuoy size={24} /></button>)}
      {modalSuporte && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 animate-fade-in"><div className="bg-[#1A1A1A] w-full max-w-sm rounded-3xl p-8 border border-[#2A2A2A] animate-slide-up relative shadow-lg"><button onClick={() => setModalSuporte(false)} className="absolute top-6 right-6 text-[#A8A8A8] hover:text-white bg-[#2A2A2A] p-2 rounded-full"><X size={18}/></button><div className="mb-8 mt-2"><h2 className="text-3xl font-['Playfair_Display'] text-white">Ajuda</h2><p className="text-[10px] text-[#D4AF37] mt-1 font-bold tracking-widest uppercase">Suporte Técnico AURUM</p></div><form onSubmit={enviarSuporteParaCEO}><textarea required rows="4" placeholder="Descreva sua solicitação..." className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-5 text-white rounded-2xl focus:border-[#D4AF37] outline-none resize-none text-sm mb-5" value={textoSuporte} onChange={(e) => setTextoSuporte(e.target.value)}></textarea><button type="submit" className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] p-4 rounded-2xl font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2"><LifeBuoy size={18} strokeWidth={2.5} /> Abrir Ticket</button></form></div></div>
      )}
    </div>
  );
}

function NavButton({ icone, texto, ativo, onClick, isDestaque }) {
  return (<button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors pt-2 ${ativo ? (isDestaque ? 'text-red-500' : 'text-[#D4AF37]') : 'text-[#6F6F6F] hover:text-[#A8A8A8]'}`}>{React.cloneElement(icone, { size: 24, strokeWidth: ativo ? 2 : 1.5 })}<span className="text-[10px] mt-1.5 font-bold tracking-widest uppercase">{texto}</span></button>);
}

export default function App() {
  const [t, setT] = useState(localStorage.getItem('aurum_token')); const [u, setU] = useState(JSON.parse(localStorage.getItem('aurum_usuario')));
  const l = (nt, nu) => { localStorage.setItem('aurum_token', nt); localStorage.setItem('aurum_usuario', JSON.stringify(nu)); setT(nt); setU(nu); };
  const out = () => { localStorage.clear(); setT(null); setU(null); };
  return <BrowserRouter><Routes><Route path="/" element={t && u ? <PainelProfissional token={t} usuario={u} onLogout={out} /> : <HomePublica onLogin={l} />} /><Route path="/agendar/:id_profissional" element={<PaginaCliente />} /></Routes></BrowserRouter>;
}