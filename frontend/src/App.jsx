/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Calendar, DollarSign, Settings, PlusCircle, MessageCircle, X, Trash2, Plus, CheckCircle2, LogOut, Shield, Loader2, LifeBuoy, BellRing, Briefcase, UsersRound, UploadCloud, ArrowLeft, Star, TrendingUp, Lock, QrCode, ChevronRight, CreditCard } from 'lucide-react';
import PaginaCliente from './PaginaCliente';
import AgendaTimeline from './components/AgendaTimeline';
import ClienteCard from './components/ClienteCard';
import ClienteHistoricoModal from './components/ClienteHistoricoModal';
import ReagendarClienteModal from './components/ReagendarClienteModal';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';
const LOGO_AURUM = 'https://res.cloudinary.com/dnilha8sq/image/upload/f_auto,q_auto/ChatGPT_Image_2_de_abr._de_2026_11_18_14_jbqhl3';

function LandingPage({ onGoToAuth }) {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full animate-fade-in">
        <div className="flex items-center gap-3">
          <img src={LOGO_AURUM} alt="AURUM" className="w-12 h-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
          <span className="font-['Playfair_Display'] font-bold text-xl tracking-widest text-[#D4AF37]">AURUM</span>
        </div>
        <button onClick={onGoToAuth} className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase hover:text-white transition-colors border border-[#D4AF37]/50 px-5 py-2 rounded-full hover:bg-[#D4AF37]/10">Entrar</button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-10 animate-slide-up relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <img src={LOGO_AURUM} alt="AURUM Premium" className="w-48 md:w-64 h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.3)] mb-4" />
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] text-white max-w-4xl leading-tight">
          O Sistema Definitivo para Salões de <span className="text-[#D4AF37] italic">Alto Padrão</span>
        </h1>
        
        <p className="text-[#A8A8A8] max-w-2xl text-lg md:text-xl font-light leading-relaxed">
          Esqueça as agendas de papel e sistemas feios. Gerencie sua agenda, calcule comissões, controle seu fluxo de caixa e fidelize seus clientes com a plataforma mais exclusiva do mercado.
        </p>
        
        <button onClick={onGoToAuth} className="bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] px-12 py-5 rounded-full font-bold tracking-widest uppercase text-sm shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-105 transition-all flex items-center gap-3">
          Testar 1 Mês Grátis <ChevronRight size={18} strokeWidth={3} />
        </button>
      </main>

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

      <section className="py-24 max-w-5xl mx-auto px-6 relative">
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-200 h-75 bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
         <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-white">Assinatura Exclusiva</h2>
            <p className="text-[#A8A8A8] font-light">Todas as ferramentas liberadas. Sem taxas escondidas. Sem fidelidade.</p>
         </div>
         
         <div className="max-w-md mx-auto">
            <div className="bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] p-8 md:p-10 rounded-[2.5rem] border border-[#D4AF37]/50 flex flex-col relative shadow-[0_0_50px_rgba(212,175,55,0.15)]">
               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] px-6 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-lg">
                 <Star size={12} className="fill-[#0D0D0D]" /> Acesso Total
               </div>
               <div className="mb-8 text-center mt-2">
                 <h3 className="text-3xl font-['Playfair_Display'] text-white mb-4">AURUM Premium</h3>
                 <div className="flex items-end justify-center gap-1 mb-2">
                   <span className="text-xl text-[#D4AF37] font-bold pb-2 opacity-80">R$</span>
                   <span className="text-6xl font-bold text-[#E6C76B]">24,99</span>
                   <span className="text-sm text-[#A8A8A8] pb-2">/mês</span>
                 </div>
               </div>
               <div className="flex-1 space-y-5 mb-10">
                 <p className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={20} className="text-[#D4AF37]"/> Link VIP de Agendamento</p>
                 <p className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={20} className="text-[#D4AF37]"/> Cadastro de Profissionais Ilimitado</p>
                 <p className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={20} className="text-[#D4AF37]"/> Cálculo Automático de Comissões</p>
                 <p className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={20} className="text-[#D4AF37]"/> Fluxo de Caixa e CRM de Clientes</p>
               </div>
               <button onClick={onGoToAuth} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-5 rounded-2xl font-bold tracking-widest uppercase text-sm hover:scale-105 transition-transform shadow-lg">Começar 1 Mês Grátis</button>
            </div>
         </div>
      </section>

      <footer className="border-t border-[#2A2A2A] bg-[#0D0D0D] py-8 text-center">
        <img src={LOGO_AURUM} alt="AURUM" className="w-16 h-auto mx-auto mb-4 opacity-50 grayscale drop-shadow-md" />
        <p className="text-[#6F6F6F] text-xs">© 2026 AURUM Premium SaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

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
    } catch (err) { setErro(err.message === 'Failed to fetch' ? 'Servidor acordando...' : err.message); } 
    finally { setCarregando(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center p-6 font-['Inter'] relative">
      <button onClick={onVoltar} className="absolute top-6 left-6 text-[#A8A8A8] hover:text-[#D4AF37] flex items-center gap-2 text-sm transition-colors"><ArrowLeft size={18}/> Voltar</button>
      
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center mb-4 flex flex-col items-center">
          <img src={LOGO_AURUM} alt="AURUM Logo" className="w-40 md:w-48 drop-shadow-[0_0_40px_rgba(212,175,55,0.4)] mb-2" />
        </div>

        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6 text-center">{isLogin ? 'Acesse seu espaço' : 'Crie sua exclusividade'}</h2>
          {erro && <div className="bg-red-900/20 text-red-200 p-3 rounded-lg text-sm mb-4 text-center animate-fade-in">{erro}</div>}
          <form onSubmit={handleSubmitTradicional} className="space-y-4">
            {!isLogin && (<><div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">Nome do Salão</label><input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div><div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">WhatsApp (Com DDD)</label><input type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div></>)}
            <div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
            <div><label className="text-[10px] text-[#A8A8A8] uppercase mb-2 block">Senha Segura</label><input type="password" required placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
            <button type="submit" disabled={carregando} className={`w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium tracking-widest uppercase text-sm mt-2 flex justify-center items-center gap-2 ${carregando ? 'opacity-70 cursor-wait' : 'hover:bg-[#E6C76B]'}`}>{carregando ? <><Loader2 className="w-4 h-4 animate-spin text-[#0D0D0D]" /> Conectando...</> : (isLogin ? 'Entrar' : 'Cadastrar')}</button>
          </form>
          <div className="mt-8 text-center"><button onClick={() => { setIsLogin(!isLogin); setErro(''); setSenha(''); }} className="text-[#A8A8A8] text-sm hover:text-white transition-colors">{isLogin ? 'Não tem uma conta? Crie aqui.' : 'Já tem uma conta? Faça login.'}</button></div>
        </div>
      </div>
    </div>
  );
}

function HomePublica({ onLogin }) {
  const [mostrarAuth, setMostrarAuth] = useState(false);
  if (mostrarAuth) return <TelaAuth onLogin={onLogin} onVoltar={() => setMostrarAuth(false)} />;
  return <LandingPage onGoToAuth={() => setMostrarAuth(true)} />;
}

function PainelProfissional({ token, usuario, onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('home');
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarFormServico, setMostrarFormServico] = useState(false);

  const [bloqueado, setBloqueado] = useState(false);
  const [diasRestantes, setDiasRestantes] = useState(30);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [carregandoPix, setCarregandoPix] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [qrCodeCopiaCola, setQrCodeCopiaCola] = useState('');

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

  const [clienteHistoricoAberto, setClienteHistoricoAberto] = useState(false);
  const [clienteSelecionadoHistorico, setClienteSelecionadoHistorico] = useState(null);
  const [clienteReagendarAberto, setClienteReagendarAberto] = useState(false);
  const [clienteSelecionadoReagendar, setClienteSelecionadoReagendar] = useState(null);

  const [novoServico, setNovoServico] = useState({ nome: '', preco: '', tempo: '30 min' });
  const [vendaNome, setVendaNome] = useState('');
  const [vendaServico, setVendaServico] = useState(null);

  const [modalSuporte, setModalSuporte] = useState(false);
  const [textoSuporte, setTextoSuporte] = useState('');
  const [notificacao, setNotificacao] = useState(null);
  const [qtdAnteriorAgendamentos, setQtdAnteriorAgendamentos] = useState(0);
  
  const todosHorarios = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  const opcoesDuracaoServico = [
    '15 min',
    '20 min',
    '30 min',
    '40 min',
    '45 min',
    '1h',
    '1h 30min',
    '2h',
    '2h 30min',
    '3h',
    '3h 30min',
    '4h',
    '5h',
    '6h'
  ];
  const [meusHorarios, setMeusHorarios] = useState([]);
  const [meuLogo, setMeuLogo] = useState(null);
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  const linkBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const linkCliente = `${linkBase}/agendar/${usuario.id}`;
  const mensagemPromo = encodeURIComponent(`✨ Exclusividade e sofisticação. Agende sua experiência premium com ${usuario.nome}: ${linkCliente}`);

  const headersAPI = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const carregarTudo = useCallback(async () => {
    try {
      const resAssinatura = await fetch(`${API_URL}/assinatura`, { headers: headersAPI });
      const dadosAssinatura = await resAssinatura.json();
      
      if (dadosAssinatura.status === 'vencido') {
        setBloqueado(true);
        setModalPagamento(true);
        return; 
      } else {
        setDiasRestantes(dadosAssinatura.dias_restantes);
      }

      fetch(`${API_URL}/dashboard`, { headers: headersAPI }).then(r=>r.ok?r.json():null).then(d=>{ if(d && !d.error){ setGanhoDia(d.ganhoDia||0); setQtdAtendimentos(d.qtdAtendimentos||0); }});
      fetch(`${API_URL}/servicos`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setServicos(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/vendas`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setHistoricoCaixa(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/funcionarios`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setFuncionarios(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/clientes`, { headers: headersAPI }).then(r=>r.ok?r.json():[]).then(d=>setListaClientes(Array.isArray(d) ? d : []));
      fetch(`${API_URL}/configuracoes`, { headers: headersAPI }).then(r=>r.ok?r.json():null).then(d=>{ if(d && !d.error) { if(d.horarios_trabalho) setMeusHorarios(d.horarios_trabalho.split(',')); if(d.logo_url) setMeuLogo(d.logo_url); } });

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

  const gerarPix = async () => {
    setCarregandoPix(true);
    try {
      const res = await fetch(`${API_URL}/gerar-pix`, { method: 'POST', headers: headersAPI, body: JSON.stringify({}) });
      const data = await res.json();
      if (data.erro_mp) {
        // MENSAGEM ATUALIZADA PARA O SEU ERRO!
        alert("O Mercado Pago recusou a geração do Pix. Verifique se o seu Access Token no backend está correto (O código longo).");
      } else {
        setQrCodeBase64(data.qr_code_base64); setQrCodeCopiaCola(data.qr_code_copia_cola);
      }
    } catch (error) { console.error(error); alert("Erro ao comunicar com o Mercado Pago."); }
    setCarregandoPix(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas'); const MAX_WIDTH = 250; const MAX_HEIGHT = 250;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
        setMeuLogo(canvas.toDataURL('image/jpeg', 0.8));
      }
      img.src = event.target.result;
    }; reader.readAsDataURL(file);
  };

  const salvarMeusHorarios = async (horaClicada) => {
    let novosHorarios = [...meusHorarios]; if (novosHorarios.includes(horaClicada)) novosHorarios = novosHorarios.filter(h => h !== horaClicada); else novosHorarios.push(horaClicada);
    novosHorarios.sort(); setMeusHorarios(novosHorarios); setSalvandoConfig(true);
    try { await fetch(`${API_URL}/configuracoes`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ horarios: novosHorarios.join(','), logo_url: meuLogo }) }); } catch (e) { console.error(e); alert("Erro ao salvar."); }
    setSalvandoConfig(false);
  };

  const salvarApenasLogo = async () => {
    setSalvandoConfig(true);
    try { await fetch(`${API_URL}/configuracoes`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ horarios: meusHorarios.join(','), logo_url: meuLogo }) }); alert("Logo atualizada com sucesso!"); } catch (e) { console.error(e); alert("Erro ao salvar a logo."); }
    setSalvandoConfig(false);
  }

  const adicionarServico = async () => {
    if (!novoServico.nome || !novoServico.preco || !novoServico.tempo) return;

    const servicoFormatado = {
      ...novoServico,
      nome: novoServico.nome.trim(),
      preco: novoServico.preco,
      tempo: novoServico.tempo
    };

    await fetch(`${API_URL}/servicos`, {
      method: 'POST',
      headers: headersAPI,
      body: JSON.stringify(servicoFormatado)
    });

    setNovoServico({ nome: '', preco: '', tempo: '30 min' });
    setMostrarFormServico(false);
    carregarTudo();
  };
  const removerServico = async (id) => { await fetch(`${API_URL}/servicos/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };
  const adicionarFuncionario = async () => { if (!novoFuncionario.nome) return; await fetch(`${API_URL}/funcionarios`, { method: 'POST', headers: headersAPI, body: JSON.stringify(novoFuncionario) }); setNovoFuncionario({ nome: '', comissao: '' }); setMostrarFormFuncionario(false); carregarTudo(); };
  const removerFuncionario = async (id) => { if(!window.confirm('Deseja excluir este profissional da equipe?')) return; await fetch(`${API_URL}/funcionarios/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };
  const confirmarVenda = async (e) => { e.preventDefault(); if (!vendaServico) return; await fetch(`${API_URL}/vendas`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ valor: parseFloat(vendaServico.preco) }) }); setVendaNome(''); setVendaServico(null); setModalAberto(false); carregarTudo(); };
  
  const concluirAtendimento = async (agendamento) => {
    await fetch(`${API_URL}/agendamentos/${agendamento.id}/concluir`, { method: 'POST', headers: headersAPI }); carregarTudo();
    if (agendamento.cliente_whatsapp) {
      const num = agendamento.cliente_whatsapp.replace(/\D/g, ''); const txt = `✨ Olá, ${agendamento.cliente_nome.split(' ')[0]}! Aqui é do ${usuario.nome}.\n\nPassando para agradecer imensamente pela sua visita e confiança no nosso trabalho hoje! Esperamos que tenha tido uma experiência premium.\n\nVolte sempre! 🤝`;
      window.open(`https://wa.me/55${num}?text=${encodeURIComponent(txt)}`, '_blank');
    }
  };

  const excluirEmpresa = async (id, nomeEmpresa) => { if (!window.confirm(`⚠️ ATENÇÃO: Tem certeza que deseja excluir o salão "${nomeEmpresa}"?`)) return; const res = await fetch(`${API_URL}/ceo/usuarios/${id}`, { method: 'DELETE', headers: headersAPI }); if (res.ok) { alert("Removido."); carregarTudo(); } else { alert("Erro ao excluir."); } };
  const enviarSuporteParaCEO = async (e) => { e.preventDefault(); try { await fetch(`${API_URL}/tickets`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ mensagem: textoSuporte }) }); } catch(err) { console.error(err); } window.open(`https://wa.me/5573998055316?text=${encodeURIComponent(`💡 *Novo Ticket de Suporte*\n\n*Assinante:* ${usuario.nome}\n*ID da Conta:* ${usuario.id}\n\n*Mensagem:*\n"${textoSuporte}"`)}`, '_blank'); setModalSuporte(false); setTextoSuporte(''); };
  const abrirHistoricoCliente = (cliente) => {
    setClienteSelecionadoHistorico(cliente);
    setClienteHistoricoAberto(true);
  };

  const abrirReagendarCliente = (cliente) => {
    setClienteSelecionadoReagendar(cliente);
    setClienteReagendarAberto(true);
  };

  const confirmarReagendamentoCliente = async ({
    cliente,
    data,
    horario,
    servico,
    funcionario,
    duracao_minutos
  }) => {
    const valorServico = Number(servico?.preco || 0);

    const payload = {
      id_profissional: usuario.id,
      nome: cliente.nome,
      whatsapp: cliente.whatsapp,
      nascimento: cliente.nascimento || '',
      servico_nome: servico.nome,
      data_reserva: data.split('-').reverse().join('/'),
      horario,
      valor: valorServico,
      funcionario_id: funcionario?.id || null,
      funcionario_nome: funcionario?.nome || null,
      duracao_minutos: duracao_minutos || 60
    };

    const res = await fetch(`${API_URL}/public/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Erro ao reagendar cliente.');
    }

    await carregarTudo();

    if (cliente.whatsapp) {
      const numero = cliente.whatsapp.replace(/\D/g, '');
      const mensagem = `Olá ${cliente.nome.split(' ')[0]}! ✨\n\nSeu novo horário foi agendado com sucesso no ${usuario.nome}.\n\n📅 Data: ${payload.data_reserva}\n⏰ Horário: ${horario}\n💎 Serviço: ${servico.nome}\n👤 Profissional: ${funcionario?.nome || 'Equipe'}\n\nEsperamos você!`;

      window.open(
        `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`,
        '_blank'
      );
    }
  };

  const resolverTicket = async (id) => { await fetch(`${API_URL}/ceo/tickets/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };

  const renderModalPagamento = () => (
    <div className={`fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4 ${bloqueado ? 'animate-fade-in' : 'animate-slide-up'}`}>
      <div className="bg-[#1A1A1A] w-full max-w-xl rounded-[2.5rem] p-8 border border-[#2A2A2A] shadow-2xl relative flex flex-col items-center">
        {!bloqueado && (
          <button onClick={() => { setModalPagamento(false); setQrCodeBase64(null); }} className="absolute top-6 right-6 text-[#A8A8A8] hover:text-white bg-[#2A2A2A] p-2 rounded-full transition-colors"><X size={18}/></button>
        )}
        
        {bloqueado ? <Lock size={48} className="text-red-500 mb-4" /> : <CreditCard size={48} className="text-[#D4AF37] mb-4" />}
        
        <h2 className="text-3xl font-['Playfair_Display'] text-white mb-2 text-center">
          {bloqueado ? "Sua assinatura venceu." : "Renovar Assinatura"}
        </h2>
        <p className="text-[#A8A8A8] text-sm mb-8 text-center max-w-md">Garanta seu acesso ininterrupto à plataforma AURUM Premium.</p>

        {!qrCodeBase64 ? (
           <div className="w-full">
              <button onClick={() => gerarPix()} disabled={carregandoPix} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] p-6 rounded-3xl flex justify-between items-center transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] text-left">
                <div>
                  <span className="text-[#0D0D0D] text-[10px] font-bold tracking-widest uppercase block mb-1">Acesso Total Semanal/Mensal</span>
                  <span className="text-2xl font-['Playfair_Display'] text-[#0D0D0D] font-bold block">AURUM Premium</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#0D0D0D]">R$ 24,99</span>
                  <span className="text-xs text-[#0D0D0D] opacity-80 block">no Pix</span>
                </div>
              </button>
           </div>
         ) : (
           <div className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#D4AF37] w-full flex flex-col items-center">
              <h3 className="text-xl font-['Playfair_Display'] text-[#D4AF37] mb-2">Escaneie para Pagar</h3>
              <p className="text-xs text-[#A8A8A8] mb-6 text-center">O sistema será renovado por 30 dias na hora!</p>
              <div className="bg-white p-4 rounded-xl mb-6"><img src={`data:image/jpeg;base64,${qrCodeBase64}`} alt="QR Code PIX" className="w-48 h-48" /></div>
              <button onClick={() => { navigator.clipboard.writeText(qrCodeCopiaCola); alert('Código Pix copiado!'); }} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white py-4 rounded-xl text-sm hover:border-[#D4AF37] transition-colors flex justify-center items-center gap-2"><QrCode size={18} /> Copiar Pix (Copia e Cola)</button>
              <button onClick={() => { setQrCodeBase64(null); setQrCodeCopiaCola(''); }} className="mt-4 text-xs text-[#6F6F6F] hover:text-white">Voltar</button>
           </div>
         )}
         {carregandoPix && <p className="text-[#D4AF37] text-xs flex items-center justify-center gap-2 mt-6"><Loader2 className="animate-spin" size={16}/> Gerando PIX seguro...</p>}
         {bloqueado && <button onClick={onLogout} className="mt-8 text-[#6F6F6F] text-xs hover:text-red-500">Sair da Conta</button>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] font-['Inter'] text-white relative overflow-hidden">
      {modalPagamento && renderModalPagamento()}
      
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

      {!usuario.is_ceo && diasRestantes <= 3 && diasRestantes >= 0 && !bloqueado && (
         <div className="bg-red-900/40 text-red-200 p-3 text-xs text-center border-b border-red-900/50 flex justify-center items-center gap-3">
           <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
           Sua assinatura vence em {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}. 
           <button onClick={() => setModalPagamento(true)} className="bg-red-600 text-white px-3 py-1 rounded-full font-bold hover:bg-red-500 transition-colors shadow-md">Pagar Agora</button>
         </div>
      )}

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
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-2">
              <div>
                <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Agenda Profissional</p>
                <h2 className="text-3xl font-normal font-['Playfair_Display'] text-white">Timeline Premium</h2>
                <p className="text-[#8A8A8A] text-sm mt-2 font-light">
                  Visualize seus horários por profissional, com duração real, valor e status do atendimento.
                </p>
              </div>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-5 py-4 min-w-[180px]">
                <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest mb-1">Link do cliente</p>
                <a
                  href={linkCliente}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D4AF37] text-xs font-bold hover:text-white transition-colors break-all"
                >
                  Abrir agenda online
                </a>
              </div>
            </div>

            <AgendaTimeline
              agendamentos={agendamentos}
              funcionarios={funcionarios}
              onConcluir={concluirAtendimento}
            />

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-5">
              <p className="text-[#A8A8A8] text-xs leading-relaxed">
                A timeline usa a duração real salva no agendamento. Serviços longos aparecem ocupando várias faixas de horário, ajudando a evitar conflitos e deixando a gestão mais visual.
              </p>
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
                  CRM Premium
                </p>

                <h2 className="text-3xl font-normal font-['Playfair_Display'] text-white">
                  Clientes
                </h2>

                <p className="text-[#8A8A8A] text-sm mt-2">
                  Gerencie relacionamento, retenção e histórico dos seus clientes.
                </p>
              </div>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl px-6 py-5 min-w-[180px]">
                <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest mb-2">
                  Total de Clientes
                </p>

                <p className="text-white text-3xl font-bold">
                  {listaClientes.length}
                </p>
              </div>
            </div>

            {listaClientes.length === 0 ? (
              <div className="bg-[#1A1A1A] border border-dashed border-[#2A2A2A] rounded-4xl p-14 text-center">
                <UsersRound size={42} className="text-[#D4AF37] mx-auto mb-4 opacity-70" />

                <h3 className="text-white text-2xl font-['Playfair_Display'] mb-3">
                  Nenhum cliente encontrado
                </h3>

                <p className="text-[#8A8A8A] text-sm">
                  Seus clientes aparecerão automaticamente após os agendamentos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">

                {listaClientes.map((cliente, idx) => (

                  <ClienteCard
                    key={cliente.id || idx}
                    cliente={cliente}
                    usuario={usuario}
                    onHistorico={(clienteSelecionado) => {
                      abrirHistoricoCliente(clienteSelecionado);
                    }}
                    onReagendar={(clienteSelecionado) => {
                      abrirReagendarCliente(clienteSelecionado);
                    }}
                  />

                ))}

              </div>
            )}

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
            
            {!usuario.is_ceo && (
              <div className="mb-10 pb-8 border-b border-[#2A2A2A]">
                 <h2 className="text-2xl font-normal font-['Playfair_Display'] text-white mb-2">Sua Assinatura</h2>
                 <p className="text-xs text-[#A8A8A8] mb-6 font-light">Acesso Premium à plataforma AURUM.</p>
                 <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] flex justify-between items-center">
                   <div>
                     <p className="text-white font-medium text-lg">Status: <span className={diasRestantes > 0 ? "text-emerald-500" : "text-red-500"}>{diasRestantes > 0 ? 'Ativo' : 'Vencido'}</span></p>
                     <p className="text-sm text-[#A8A8A8] mt-1">Vence em: {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}</p>
                   </div>
                   <button onClick={() => setModalPagamento(true)} className="bg-[#D4AF37] text-[#0D0D0D] px-5 py-3 rounded-xl font-bold tracking-widest uppercase text-[10px] md:text-xs shadow-lg hover:scale-105 transition-transform">
                     Renovar
                   </button>
                 </div>
              </div>
            )}

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
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] space-y-5 animate-slide-up mb-8 shadow-lg">
                <div>
                  <label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Nome da Experiência</label>
                  <input
                    type="text"
                    value={novoServico.nome}
                    onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})}
                    placeholder="Ex: Corte masculino, Luzes, Barba"
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Valor (R$)</label>
                    <input
                      type="text"
                      value={novoServico.preco}
                      onChange={(e) => setNovoServico({...novoServico, preco: e.target.value})}
                      placeholder="Ex: 80,00"
                      className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#D4AF37] rounded-xl focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Duração do Serviço</label>
                    <select
                      value={novoServico.tempo}
                      onChange={(e) => setNovoServico({...novoServico, tempo: e.target.value})}
                      className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"
                    >
                      {opcoesDuracaoServico.map((tempo) => (
                        <option key={tempo} value={tempo} className="bg-[#0D0D0D] text-white">
                          {tempo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4">
                  <p className="text-[#A8A8A8] text-xs leading-relaxed">
                    A duração agora é padronizada pelo sistema. Isso evita erro de digitação como <strong className="text-white">3hr</strong> e melhora o bloqueio automático da agenda.
                  </p>
                </div>

                <button onClick={adicionarServico} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium mt-2">
                  Salvar Experiência
                </button>
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

      
      <ClienteHistoricoModal
        aberto={clienteHistoricoAberto}
        onClose={() => setClienteHistoricoAberto(false)}
        cliente={clienteSelecionadoHistorico}
        historico={
          Array.isArray(agendamentos)
            ? agendamentos.filter(
                (ag) =>
                  ag.cliente_id === clienteSelecionadoHistorico?.id
              )
            : []
        }
      />

      <ReagendarClienteModal
        aberto={clienteReagendarAberto}
        onClose={() => setClienteReagendarAberto(false)}
        cliente={clienteSelecionadoReagendar}
        funcionarios={funcionarios}
        servicos={servicos}
        agendamentos={agendamentos}
        horariosBase={meusHorarios}
        onConfirmar={confirmarReagendamentoCliente}
      />

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