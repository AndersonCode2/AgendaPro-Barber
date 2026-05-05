/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Calendar, DollarSign, Settings, PlusCircle, MessageCircle, X, Trash2, Plus, CheckCircle2, LogOut, Shield, Loader2, UsersRound, Briefcase, ArrowLeft, Star, Lock, QrCode, ChevronRight, Zap, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';
const LOGO_AURUM = 'https://res.cloudinary.com/dnilha8sq/image/upload/f_auto,q_auto/ChatGPT_Image_2_de_abr._de_2026_11_18_14_jbqhl3';

// ==========================================
// 🌍 LANDING PAGE
// ==========================================
function LandingPage({ onGoToAuth }) {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3"><img src={LOGO_AURUM} alt="AURUM" className="w-12 h-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" /><span className="font-['Playfair_Display'] font-bold text-xl tracking-widest text-[#D4AF37]">AURUM</span></div>
        <button onClick={onGoToAuth} className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase border border-[#D4AF37]/50 px-5 py-2 rounded-full hover:bg-[#D4AF37]/10">Entrar</button>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-10 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <img src={LOGO_AURUM} alt="AURUM Premium" className="w-48 md:w-64 h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.3)] mb-4" />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] text-white max-w-4xl leading-tight">O Sistema Definitivo para Salões de <span className="text-[#D4AF37] italic">Alto Padrão</span></h1>
        <p className="text-[#A8A8A8] max-w-2xl text-lg md:text-xl font-light leading-relaxed">Gerencie sua agenda, calcule comissões e controle seu fluxo de caixa com a plataforma mais exclusiva do mercado.</p>
        <button onClick={onGoToAuth} className="bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] px-12 py-5 rounded-full font-bold tracking-widest uppercase text-sm shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-105 transition-all flex items-center gap-3">Testar 1 Mês Grátis <ChevronRight size={18} strokeWidth={3} /></button>
      </main>
      <footer className="border-t border-[#2A2A2A] bg-[#0D0D0D] py-8 text-center mt-12"><p className="text-[#6F6F6F] text-xs">© 2026 AURUM Premium SaaS. Todos os direitos reservados.</p></footer>
    </div>
  );
}

// ==========================================
// 🔐 TELA DE AUTH
// ==========================================
function TelaAuth({ onLogin, onVoltar }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [telefone, setTelefone] = useState(''); const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(false);

  const handleSubmitTradicional = async (e) => {
    e.preventDefault(); setErro(''); setCarregando(true);
    const endpoint = isLogin ? '/login' : '/cadastro';
    const body = isLogin ? { email, senha } : { nome, email, senha, telefone };
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na autenticação');
      onLogin(data.token, data.usuario);
    } catch (err) { console.error(err); setErro(err.message); } finally { setCarregando(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center p-6 relative">
      <button onClick={onVoltar} className="absolute top-6 left-6 text-[#A8A8A8] hover:text-[#D4AF37] flex items-center gap-2 text-sm transition-colors"><ArrowLeft size={18}/> Voltar</button>
      <div className="w-full max-w-sm space-y-8 animate-fade-in"><img src={LOGO_AURUM} alt="AURUM Logo" className="w-40 mx-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.4)] mb-2" />
        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] shadow-2xl">
          <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6 text-center">{isLogin ? 'Acesse seu espaço' : 'Crie sua exclusividade'}</h2>
          {erro && <div className="bg-red-900/20 text-red-200 p-3 rounded-lg text-sm mb-4 text-center">{erro}</div>}
          <form onSubmit={handleSubmitTradicional} className="space-y-4">
            {!isLogin && (<><div><input type="text" required placeholder="Nome do Salão" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div><div><input type="tel" required placeholder="WhatsApp (DDD)" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div></>)}
            <div><input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
            <div><input type="password" required placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" /></div>
            <button type="submit" disabled={carregando} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium tracking-widest uppercase text-sm mt-2 flex justify-center items-center gap-2">{carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Entrar' : 'Cadastrar')}</button>
          </form>
          <div className="mt-8 text-center"><button onClick={() => { setIsLogin(!isLogin); setErro(''); }} className="text-[#A8A8A8] text-sm hover:text-white transition-colors">{isLogin ? 'Criar uma conta gratuita' : 'Já tenho uma conta'}</button></div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 💎 PAINEL PROTEGIDO (CEO)
// ==========================================
function PainelProfissional({ token, usuario, onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('home');
  const [modalAberto, setModalAberto] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [diasRestantes, setDiasRestantes] = useState(30);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [carregandoPix, setCarregandoPix] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [qrCodeCopiaCola, setQrCodeCopiaCola] = useState('');

  const [ganhoDia, setGanhoDia] = useState(0);
  const [qtdAtendimentos, setQtdAtendimentos] = useState(0);
  const [grafico, setGrafico] = useState([]);
  
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [historicoCaixa, setHistoricoCaixa] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [listaClientes, setListaClientes] = useState([]);
  const [meuLogo, setMeuLogo] = useState(null);
  const [meusHorarios, setMeusHorarios] = useState([]);
  const [dadosCeo, setDadosCeo] = useState({ totalEmpresas: 0, faturamentoGlobal: 0, empresas: [] });

  const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '' });
  const [mostrarFormDespesa, setMostrarFormDespesa] = useState(false);
  const [vendaNome, setVendaNome] = useState('');
  const [vendaServico, setVendaServico] = useState(null);
  const [novoServico, setNovoServico] = useState({ nome: '', preco: '', tempo: '' });
  const [mostrarFormServico, setMostrarFormServico] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', comissao: '' });
  const [mostrarFormFuncionario, setMostrarFormFuncionario] = useState(false);
  
  const todosHorarios = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

  const linkCliente = `${window.location.origin}/agendar/${usuario?.id || ''}`;
  const headersAPI = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const carregarTudo = useCallback(async () => {
    try {
      const resAssinatura = await fetch(`${API_URL}/assinatura`, { headers: headersAPI });
      const dAssin = await resAssinatura.json();
      
      // Lógica de Bloqueio/Desbloqueio em Tempo Real
      if (dAssin.status === 'vencido') {
         setBloqueado(true);
         setModalPagamento(true);
      } else {
         setBloqueado(false);
         setModalPagamento(false); // Fecha o modal sozinho se o CEO liberar!
      }
      
      setDiasRestantes(dAssin.dias_restantes || 0);

      // Carregamento de dados (só roda se não estiver bloqueado para economizar recursos)
      if (dAssin.status !== 'vencido') {
        fetch(`${API_URL}/dashboard`, { headers: headersAPI }).then(r=>r.json()).then(d=>{ setGanhoDia(d.ganhoDia||0); setQtdAtendimentos(d.qtdAtendimentos||0); setGrafico(Array.isArray(d.grafico7Dias)?d.grafico7Dias:[]); }).catch(()=>null);
        fetch(`${API_URL}/vendas`, { headers: headersAPI }).then(r=>r.json()).then(d=>setHistoricoCaixa(Array.isArray(d)?d:[])).catch(()=>null);
        fetch(`${API_URL}/despesas`, { headers: headersAPI }).then(r=>r.json()).then(d=>setDespesas(Array.isArray(d)?d:[])).catch(()=>null);
        fetch(`${API_URL}/servicos`, { headers: headersAPI }).then(r=>r.json()).then(d=>setServicos(Array.isArray(d)?d:[])).catch(()=>null);
        fetch(`${API_URL}/funcionarios`, { headers: headersAPI }).then(r=>r.json()).then(d=>setFuncionarios(Array.isArray(d)?d:[])).catch(()=>null);
        fetch(`${API_URL}/clientes`, { headers: headersAPI }).then(r=>r.json()).then(d=>setListaClientes(Array.isArray(d)?d:[])).catch(()=>null);
        fetch(`${API_URL}/configuracoes`, { headers: headersAPI }).then(r=>r.json()).then(d=>{ if(d.horarios_trabalho) setMeusHorarios(d.horarios_trabalho.split(',')); if(d.logo_url) setMeuLogo(d.logo_url); }).catch(()=>null);
        fetch(`${API_URL}/agendamentos`, { headers: headersAPI }).then(r=>r.json()).then(d=>setAgendamentos(Array.isArray(d)?d:[])).catch(()=>null);
      }
      
      if (usuario?.is_ceo) { fetch(`${API_URL}/ceo/dashboard`, { headers: headersAPI }).then(r=>r.json()).then(setDadosCeo).catch(()=>null); }
    } catch (e) { console.error("Erro na sincronização", e); }
  }, [token, usuario]);

  useEffect(() => { carregarTudo(); const i = setInterval(carregarTudo, 30000); return () => clearInterval(i); }, [carregarTudo]);

  const gerarPix = async () => { setCarregandoPix(true); try { const res = await fetch(`${API_URL}/gerar-pix`, { method: 'POST', headers: headersAPI }); const data = await res.json(); if (data.qr_code_base64) { setQrCodeBase64(data.qr_code_base64); setQrCodeCopiaCola(data.qr_code_copia_cola); } } catch (e) { console.error(e); } setCarregandoPix(false); };
  
  const liberarAcessoManual = async (idEmpresa) => { if(!window.confirm("Liberar +30 dias?")) return; try { await fetch(`${API_URL}/ceo/usuarios/${idEmpresa}/renovar`, { method: 'POST', headers: headersAPI }); alert("Acesso liberado!"); carregarTudo(); } catch (e) { console.error(e); } };
  const concluirAtendimento = async (ag) => { await fetch(`${API_URL}/agendamentos/${ag.id}/concluir`, { method: 'POST', headers: headersAPI }); carregarTudo(); window.open(`https://wa.me/55${String(ag.cliente_whatsapp || '').replace(/\D/g, '')}?text=Olá! Passando para agradecer sua visita hoje no ${usuario.nome}. Volte sempre!`, '_blank'); };
  const confirmarVenda = async (e) => { e.preventDefault(); if (!vendaServico) return; await fetch(`${API_URL}/vendas`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ valor: parseFloat(vendaServico.preco || 0) }) }); setVendaNome(''); setVendaServico(null); setModalAberto(false); carregarTudo(); };
  
  const adicionarDespesa = async () => { if(!novaDespesa.descricao || !novaDespesa.valor) return; await fetch(`${API_URL}/despesas`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ descricao: novaDespesa.descricao, valor: parseFloat(String(novaDespesa.valor).replace(',','.')) }) }); setNovaDespesa({ descricao: '', valor: '' }); setMostrarFormDespesa(false); carregarTudo(); };
  const removerDespesa = async (id) => { await fetch(`${API_URL}/despesas/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };
  const adicionarServico = async () => { if (!novoServico.nome || !novoServico.preco) return; await fetch(`${API_URL}/servicos`, { method: 'POST', headers: headersAPI, body: JSON.stringify(novoServico) }); setNovoServico({ nome: '', preco: '', tempo: '' }); setMostrarFormServico(false); carregarTudo(); };
  const removerServico = async (id) => { await fetch(`${API_URL}/servicos/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };
  const adicionarFuncionario = async () => { if (!novoFuncionario.nome) return; await fetch(`${API_URL}/funcionarios`, { method: 'POST', headers: headersAPI, body: JSON.stringify(novoFuncionario) }); setNovoFuncionario({ nome: '', comissao: '' }); setMostrarFormFuncionario(false); carregarTudo(); };
  const removerFuncionario = async (id) => { if(!window.confirm('Deseja excluir?')) return; await fetch(`${API_URL}/funcionarios/${id}`, { method: 'DELETE', headers: headersAPI }); carregarTudo(); };
  const salvarMeusHorarios = async (horaClicada) => { let novosHorarios = [...meusHorarios]; if (novosHorarios.includes(horaClicada)) novosHorarios = novosHorarios.filter(h => h !== horaClicada); else novosHorarios.push(horaClicada); novosHorarios.sort(); setMeusHorarios(novosHorarios); try { await fetch(`${API_URL}/configuracoes`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ horarios: novosHorarios.join(','), logo_url: meuLogo }) }); } catch (e) { console.error(e); } };

  // Cálculos do Caixa
  const safeHistorico = Array.isArray(historicoCaixa) ? historicoCaixa : [];
  const safeDespesas = Array.isArray(despesas) ? despesas : [];
  const safeGrafico = Array.isArray(grafico) ? grafico : [];
  const safeGanhoDia = Number(ganhoDia) || 0;
  const safeQtd = Number(qtdAtendimentos) || 0;

  const totalEntradasHoje = safeHistorico.filter(v => new Date(v?.data_venda || Date.now()).toLocaleDateString() === new Date().toLocaleDateString()).reduce((acc, curr) => acc + (Number(curr?.valor) || 0), 0);
  const totalComissoesHoje = safeHistorico.filter(v => new Date(v?.data_venda || Date.now()).toLocaleDateString() === new Date().toLocaleDateString()).reduce((acc, curr) => acc + (Number(curr?.comissao_valor) || 0), 0);
  const totalDespesasHoje = safeDespesas.filter(d => new Date(d?.data_criacao || Date.now()).toLocaleDateString() === new Date().toLocaleDateString()).reduce((acc, curr) => acc + (Number(curr?.valor) || 0), 0);
  const lucroLiquidoHoje = totalEntradasHoje - totalComissoesHoje - totalDespesasHoje;

  const maxValorGrafico = Math.max(...safeGrafico.map(g => Number(g?.valor) || 0), 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white relative">
      
      {/* MODAL DE PAGAMENTO ATUALIZADO COM BOTÃO SAIR */}
      {modalPagamento && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1A1A1A] w-full max-w-xl rounded-[2.5rem] p-8 border border-[#2A2A2A] shadow-2xl flex flex-col items-center relative">
            
            {/* BOTÃO SAIR DA CONTA (UX ESTRATÉGICA) */}
            <button onClick={onLogout} className="absolute top-6 right-6 text-[#A8A8A8] hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
               Sair <LogOut size={14}/>
            </button>

            <Lock size={48} className={bloqueado ? "text-red-500 mb-4" : "text-[#D4AF37] mb-4"} />
            <h2 className="text-3xl font-['Playfair_Display'] mb-2">{bloqueado ? "Assinatura Vencida" : "Renovar Assinatura"}</h2>
            
            {!qrCodeBase64 ? (
              <button onClick={gerarPix} disabled={carregandoPix} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] p-6 rounded-3xl flex justify-between items-center mt-6 shadow-xl">
                <span className="text-[#0D0D0D] font-bold">AURUM PREMIUM - 30 DIAS</span>
                <span className="text-2xl font-bold text-[#0D0D0D]">R$ 24,99</span>
              </button>
            ) : (
              <div className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#D4AF37] flex flex-col items-center mt-6">
                <img src={`data:image/jpeg;base64,${qrCodeBase64}`} alt="Pix" className="w-48 h-48 mb-6" />
                <button onClick={() => { navigator.clipboard.writeText(qrCodeCopiaCola); alert('Copiado!'); }} className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl flex justify-center gap-2"><QrCode size={18}/> Copiar Pix</button>
              </div>
            )}
            
            {!bloqueado && <button onClick={() => setModalPagamento(false)} className="mt-4 text-[#A8A8A8] uppercase text-xs font-bold tracking-widest">Fechar</button>}
          </div>
        </div>
      )}

      {/* MODAL VENDA EXTRA */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-end z-50 animate-fade-in"><div className="bg-[#1A1A1A] w-full rounded-t-[2.5rem] p-8 border-t border-[#2A2A2A] animate-slide-up"><div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-['Playfair_Display'] text-white">Venda Manual</h2><button onClick={() => setModalAberto(false)} className="text-[#A8A8A8] hover:text-white bg-[#2A2A2A] p-2 rounded-full"><X size={20}/></button></div><form onSubmit={confirmarVenda} className="space-y-6"><div><input type="text" placeholder="Nome do cliente (Opcional)" className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-5 text-white rounded-2xl outline-none" value={vendaNome} onChange={(e) => setVendaNome(e.target.value)} /></div><div><label className="text-xs text-[#A8A8A8] uppercase mb-3 block">Serviço/Produto</label><div className="flex flex-wrap gap-3">{(Array.isArray(servicos)?servicos:[]).map((item) => (<button type="button" key={item.id} onClick={() => setVendaServico(item)} className={`px-5 py-3 rounded-xl border text-sm transition-all ${vendaServico?.id === item.id ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'bg-[#0D0D0D] text-[#A8A8A8] border-[#2A2A2A]'}`}>{item.nome}</button>))}</div></div>{vendaServico && (<div className="bg-[#0D0D0D] p-5 rounded-2xl flex justify-between items-center mt-4"><span className="text-[#A8A8A8]">Valor a receber:</span><span className="text-[#D4AF37] text-2xl">R$ {Number(vendaServico.preco || 0).toFixed(2)}</span></div>)}<button type="submit" disabled={!vendaServico} className={`w-full p-5 flex justify-center gap-3 rounded-2xl transition-all mt-4 ${vendaServico ? 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A] cursor-not-allowed'}`}><CheckCircle2 size={22} /> <span className="font-bold uppercase text-sm">Receber</span></button></form></div></div>
      )}

      <header className="bg-[#1A1A1A] p-6 flex justify-between items-center sticky top-0 z-10 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-4">
          {meuLogo && <img src={meuLogo} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]" />}
          <div>
            <h1 className="text-2xl font-bold font-['Playfair_Display'] text-[#D4AF37]">{usuario?.nome || 'Salão'}</h1>
            <p className="text-[10px] tracking-widest text-[#A8A8A8] uppercase">
              {usuario?.is_ceo ? 'PAINEL MASTER CEO' : `Validade: ${diasRestantes} dias`}
            </p>
          </div>
        </div>
        <button onClick={onLogout} className="w-10 h-10 border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#A8A8A8] hover:text-white transition-colors"><LogOut size={16}/></button>
      </header>

      <main className="flex-1 p-6 pb-36 space-y-8 overflow-y-auto">
        {telaAtiva === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-lg text-center"><span className="text-[#A8A8A8] text-[10px] uppercase block mb-2">Ganhos Hoje</span><span className="text-3xl font-['Playfair_Display'] text-[#E6C76B]">R$ {safeGanhoDia.toFixed(2)}</span></div>
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] shadow-lg text-center"><span className="text-[#A8A8A8] text-[10px] uppercase block mb-2">Atendimentos</span><span className="text-3xl font-['Playfair_Display']">{safeQtd}</span></div>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-6"><TrendingUp size={18} className="text-[#D4AF37]"/><h3 className="text-lg font-['Playfair_Display']">Faturamento (7 Dias)</h3></div>
              <div className="flex items-end justify-between h-40 gap-2">
                {safeGrafico.map((dia, i) => {
                  const valorDia = Number(dia?.valor) || 0;
                  const altura = maxValorGrafico > 0 ? (valorDia / maxValorGrafico) * 100 : 0;
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 group">
                      <div className="w-full bg-[#0D0D0D] rounded-t-md relative flex items-end justify-center h-full"><div className="w-full bg-linear-to-t from-[#D4AF37]/20 to-[#D4AF37] rounded-t-md transition-all duration-1000" style={{ height: `${altura}%` }}></div><span className="absolute -top-6 text-[9px] text-[#A8A8A8] opacity-0 group-hover:opacity-100 transition-opacity">R${valorDia}</span></div>
                      <span className="text-[10px] text-[#6F6F6F] mt-2">{dia?.data || ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setModalAberto(true)} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-8 rounded-4xl font-bold flex flex-col items-center gap-2 shadow-2xl"><PlusCircle size={36}/><span className="uppercase text-sm">Venda Extra</span></button>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Agende no ${usuario?.nome}: ${linkCliente}`)}`} target="_blank" rel="noreferrer" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white py-5 rounded-2xl font-medium flex items-center justify-center gap-3 text-sm"><MessageCircle size={20} className="text-[#D4AF37]" /> Divulgar Link de Agendamento</a>
          </div>
        )}

        {telaAtiva === 'caixa' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-['Playfair_Display'] text-white">Fluxo de Caixa (Hoje)</h2>
            <div className="bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-3xl border border-[#D4AF37]/50 flex flex-col gap-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <div className="flex justify-between items-center text-sm"><span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={16}/> Entradas (Vendas)</span> <span className="font-bold">R$ {totalEntradasHoje.toFixed(2)}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-red-400 flex items-center gap-1"><TrendingDown size={16}/> Saídas (Comissões)</span> <span className="font-bold">- R$ {(totalComissoesHoje + totalDespesasHoje).toFixed(2)}</span></div>
              <div className="border-t border-[#2A2A2A] pt-4 flex justify-between items-center"><span className="text-[#A8A8A8] text-xs uppercase tracking-widest">Lucro Líquido</span> <span className="text-3xl font-['Playfair_Display'] text-[#D4AF37]">R$ {lucroLiquidoHoje.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between items-center mt-8 mb-4"><h3 className="text-xl font-['Playfair_Display']">Despesas Operacionais</h3><button onClick={() => setMostrarFormDespesa(!mostrarFormDespesa)} className="text-[#D4AF37] text-sm uppercase flex items-center gap-1"><Plus size={16}/> Adicionar</button></div>
            {mostrarFormDespesa && (
               <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-red-900/30 mb-6 flex flex-col gap-4"><input type="text" placeholder="Ex: Conta de Luz..." value={novaDespesa.descricao} onChange={e=>setNovaDespesa({...novaDespesa, descricao: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl" /><input type="number" placeholder="Valor (R$)" value={novaDespesa.valor} onChange={e=>setNovaDespesa({...novaDespesa, valor: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl" /><button onClick={adicionarDespesa} className="w-full bg-red-900/40 text-red-200 border border-red-900/50 p-4 rounded-xl font-bold">Lançar Despesa</button></div>
            )}
            <div className="space-y-3">
              {safeDespesas.filter(d => new Date(d?.data_criacao || Date.now()).toLocaleDateString() === new Date().toLocaleDateString()).length === 0 ? <p className="text-[#6F6F6F] text-center text-sm">Nenhuma despesa hoje.</p> : safeDespesas.filter(d => new Date(d?.data_criacao || Date.now()).toLocaleDateString() === new Date().toLocaleDateString()).map(d => (
                 <div key={d.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl flex justify-between items-center"><div className="flex items-center gap-3"><Receipt size={18} className="text-red-400"/> <span>{d.descricao}</span></div><div className="flex items-center gap-3"><span className="text-red-400 font-bold">- R$ {Number(d.valor || 0).toFixed(2)}</span><button onClick={()=>removerDespesa(d.id)} className="text-[#6F6F6F]"><Trash2 size={16}/></button></div></div>
              ))}
            </div>
            <h3 className="text-xl font-['Playfair_Display'] mt-8 mb-4">Histórico de Entradas</h3>
            <div className="space-y-3">
              {safeHistorico.length === 0 ? <p className="text-[#6F6F6F] text-center">Nenhuma movimentação hoje.</p> : safeHistorico.map((item) => (
                 <div key={item.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col gap-2"><div className="flex justify-between items-center"><div><p className="text-sm font-medium text-white">Venda Confirmada</p><p className="text-xs text-[#A8A8A8]">{new Date(item?.data_venda || Date.now()).toLocaleDateString()}</p></div><span className="text-[#D4AF37] text-lg font-bold">+ R$ {Number(item?.valor || 0).toFixed(2)}</span></div>{item?.funcionario_nome && <div className="text-xs text-[#A8A8A8] mt-2 border-t border-[#2A2A2A] pt-2">Profissional: {item.funcionario_nome} | Comissão: <span className="text-red-400">- R$ {Number(item?.comissao_valor || 0).toFixed(2)}</span></div>}</div>
              ))}
            </div>
          </div>
        )}

        {telaAtiva === 'agenda' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-['Playfair_Display'] text-white mb-6">Agenda de Hoje</h2>
             {(Array.isArray(agendamentos)?agendamentos:[]).length === 0 ? <p className="text-[#6F6F6F] text-center py-8">Agenda livre.</p> : (Array.isArray(agendamentos)?agendamentos:[]).map(ag => {
                const horariosArray = ag?.horario ? String(ag.horario).split(',') : [];
                return (
                <div key={ag.id} className="bg-[#1A1A1A] rounded-3xl border border-[#2A2A2A] overflow-hidden"><div className="bg-[#0D0D0D] px-6 py-4 border-b border-[#2A2A2A] flex justify-between items-center"><span className="text-[#D4AF37] text-xl font-bold">{horariosArray[0] || '--:--'}</span><span className="text-xs text-[#6F6F6F]">{ag?.data_reserva || ''}</span></div><div className="p-6"><div className="flex justify-between items-start mb-4"><div><p className="text-lg font-medium">{ag?.cliente_nome}</p><p className="text-[#A8A8A8] text-sm">{ag?.servico_nome}</p></div><span className="text-xl">R$ {Number(ag?.valor || 0).toFixed(2)}</span></div><button onClick={() => concluirAtendimento(ag)} className="w-full bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37] p-3 rounded-xl flex items-center justify-center gap-2"><CheckCircle2/> Finalizar</button></div></div>
              )})}
          </div>
        )}

        {telaAtiva === 'clientes' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-['Playfair_Display'] text-white mb-6">CRM de Clientes</h2>
            <div className="space-y-4">
              {(Array.isArray(listaClientes)?listaClientes:[]).length === 0 ? <p className="text-[#6F6F6F] text-center">Nenhum cliente salvo.</p> : (Array.isArray(listaClientes)?listaClientes:[]).map((cliente, idx) => (
                <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div><p className="font-medium text-lg">{cliente?.nome}</p><p className="text-xs text-[#A8A8A8]">{cliente?.whatsapp}</p></div><span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded text-[10px] font-bold">{cliente?.total_visitas || 0} Visitas</span></div></div>
              ))}
            </div>
          </div>
        )}

        {telaAtiva === 'equipe' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-['Playfair_Display'] text-white">Sua Equipe</h2><button onClick={() => setMostrarFormFuncionario(!mostrarFormFuncionario)} className="text-[#D4AF37] text-sm uppercase"><Plus size={16} className="inline"/> Add</button></div>
            {mostrarFormFuncionario && (
               <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] mb-6"><input type="text" placeholder="Nome" value={novoFuncionario.nome} onChange={e=>setNovoFuncionario({...novoFuncionario, nome: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl mb-4" /><input type="number" placeholder="Comissão %" value={novoFuncionario.comissao} onChange={e=>setNovoFuncionario({...novoFuncionario, comissao: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl mb-4" /><button onClick={adicionarFuncionario} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-bold">Salvar</button></div>
            )}
            <div className="space-y-4">
              {(Array.isArray(funcionarios)?funcionarios:[]).map(func => (
                <div key={func.id} className="bg-[#1A1A1A] p-5 rounded-2xl flex justify-between items-center border border-[#2A2A2A]"><div><p className="font-medium text-lg">{func?.nome}</p><p className="text-sm text-[#A8A8A8]">Comissão: <span className="text-[#D4AF37]">{func?.comissao || 0}%</span></p></div><button onClick={() => removerFuncionario(func.id)} className="text-[#6F6F6F]"><Trash2 size={18}/></button></div>
              ))}
            </div>
          </div>
        )}

        {telaAtiva === 'config' && (
          <div className="space-y-8 animate-fade-in">
             <h2 className="text-2xl font-['Playfair_Display'] text-white">Configurações</h2>
             {!usuario?.is_ceo && ( <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] flex justify-between items-center"><div><p className="text-white">Plano Premium</p><p className="text-sm text-[#A8A8A8]">Vence em {diasRestantes} dias</p></div><button onClick={() => setModalPagamento(true)} className="bg-[#D4AF37] text-[#0D0D0D] px-4 py-2 rounded-xl text-xs font-bold uppercase">Renovar</button></div> )}
             <div className="border-t border-[#2A2A2A] pt-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-['Playfair_Display']">Serviços</h3><button onClick={() => setMostrarFormServico(!mostrarFormServico)} className="text-[#D4AF37] text-sm uppercase"><Plus size={16} className="inline"/></button></div>
                {mostrarFormServico && ( <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] mb-6 space-y-4"><input type="text" placeholder="Nome" value={novoServico.nome} onChange={e=>setNovoServico({...novoServico, nome: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl" /><div className="flex gap-4"><input type="text" placeholder="Preço" value={novoServico.preco} onChange={e=>setNovoServico({...novoServico, preco: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#D4AF37] rounded-xl" /><input type="text" placeholder="Tempo" value={novoServico.tempo} onChange={e=>setNovoServico({...novoServico, tempo: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl" /></div><button onClick={adicionarServico} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-bold">Salvar Serviço</button></div> )}
                <div className="space-y-3">{(Array.isArray(servicos)?servicos:[]).map(serv => (<div key={serv.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl flex justify-between items-center"><div><p>{serv?.nome}</p><p className="text-xs text-[#A8A8A8]">{serv?.tempo}</p></div><div className="flex items-center gap-4"><span className="text-[#D4AF37]">R$ {Number(serv?.preco || 0).toFixed(2)}</span><button onClick={() => removerServico(serv.id)} className="text-[#6F6F6F]"><Trash2 size={16}/></button></div></div>))}</div>
             </div>
             <div className="border-t border-[#2A2A2A] pt-6">
                <h3 className="text-xl font-['Playfair_Display'] mb-4">Grade de Horários</h3>
                <div className="grid grid-cols-3 gap-3">{todosHorarios.map(hora => { const atende = (Array.isArray(meusHorarios)?meusHorarios:[]).includes(hora); return (<button key={hora} onClick={() => salvarMeusHorarios(hora)} className={`py-3 rounded-xl border text-sm ${atende ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'bg-[#0D0D0D] text-[#4A4A4A] border-[#2A2A2A] line-through'}`}>{hora}</button>); })}</div>
             </div>
          </div>
        )}

        {telaAtiva === 'ceo' && usuario?.is_ceo && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-['Playfair_Display'] text-[#D4AF37] text-center">Gestão de Licenças</h2>
            <div className="grid grid-cols-2 gap-4"><div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A]"><span className="text-xs text-[#A8A8A8] block">Salões</span><span className="text-3xl font-bold">{dadosCeo?.totalEmpresas || 0}</span></div><div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF37]/30"><span className="text-xs text-[#A8A8A8] block">Giro Global</span><span className="text-2xl font-bold text-[#E6C76B]">R$ {Number(dadosCeo?.faturamentoGlobal || 0).toFixed(2)}</span></div></div>
            <div className="space-y-4">
              {(Array.isArray(dadosCeo?.empresas)?dadosCeo.empresas:[]).map((emp) => {
                 const venc = new Date(emp?.data_vencimento || Date.now()); const status = new Date() > venc && emp?.status_assinatura !== 'pago' ? 'Vencido' : 'Ativo';
                 return (
                   <div key={emp.id} className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] space-y-4"><div className="flex justify-between items-start"><div><p className="text-xl font-bold">{emp?.nome}</p><p className="text-xs text-[#6F6F6F]">{emp?.telefone} | ID: {emp.id}</p></div><span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{status}</span></div><div className="flex justify-between items-center text-xs text-[#A8A8A8] bg-[#0D0D0D] p-3 rounded-xl"><span>Vencimento: <strong className="text-white">{venc.toLocaleDateString('pt-BR')}</strong></span><span>Total: <strong className="text-[#D4AF37]">R$ {Number(emp?.faturamento_total || 0).toFixed(2)}</strong></span></div><div className="flex gap-2"><button onClick={() => liberarAcessoManual(emp.id)} className="flex-1 bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-widest"><Zap size={14}/> Liberar Acesso</button><button onClick={() => { if(window.confirm("Excluir?")) fetch(`${API_URL}/ceo/usuarios/${emp.id}`, { method: 'DELETE', headers: headersAPI }).then(carregarTudo).catch(e => console.error(e)); }} className="bg-[#2A2A2A] text-white p-3 rounded-xl"><Trash2 size={18}/></button></div></div>
                 );
              })}
            </div>
          </div>
        )}
      </main>

      <nav className="bg-[#1A1A1A] border-t border-[#2A2A2A] fixed bottom-0 w-full flex justify-around p-3 pb-8 z-10">
        <NavBtn icon={<Home/>} active={telaAtiva === 'home'} onClick={()=>setTelaAtiva('home')} title="Início"/>
        <NavBtn icon={<Calendar/>} active={telaAtiva === 'agenda'} onClick={()=>setTelaAtiva('agenda')} title="Agenda"/>
        <NavBtn icon={<DollarSign/>} active={telaAtiva === 'caixa'} onClick={()=>setTelaAtiva('caixa')} title="Caixa"/>
        <NavBtn icon={<UsersRound/>} active={telaAtiva === 'clientes'} onClick={()=>setTelaAtiva('clientes')} title="Clientes"/>
        <NavBtn icon={<Briefcase/>} active={telaAtiva === 'equipe'} onClick={()=>setTelaAtiva('equipe')} title="Equipe"/>
        <NavBtn icon={<Settings/>} active={telaAtiva === 'config'} onClick={()=>setTelaAtiva('config')} title="Ajustes"/>
        {usuario?.is_ceo && <NavBtn icon={<Shield/>} active={telaAtiva === 'ceo'} onClick={()=>setTelaAtiva('ceo')} title="Admin" isMaster={true}/>}
      </nav>
    </div>
  );
}

function NavBtn({ icon, active, onClick, title, isMaster }) {
  return (<button onClick={onClick} className={`flex flex-col items-center justify-center p-2 transition-colors ${active ? (isMaster ? 'text-red-500' : 'text-[#D4AF37]') : 'text-[#6F6F6F] hover:text-[#A8A8A8]'}`}>{icon}<span className="text-[9px] mt-1 uppercase font-bold tracking-widest">{title}</span></button>);
}

function HomePublica({ onLogin }) {
  const [mostrarAuth, setMostrarAuth] = useState(false);
  if (mostrarAuth) return <TelaAuth onLogin={onLogin} onVoltar={() => setMostrarAuth(false)} />;
  return <LandingPage onGoToAuth={() => setMostrarAuth(true)} />;
}

// ==========================================
// 🚀 INICIALIZADOR SEGURO
// ==========================================
export default function App() {
  const [t, setT] = useState(null); 
  const [u, setU] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const tokenSalvo = localStorage.getItem('aurum_token');
      const usuarioSalvo = localStorage.getItem('aurum_usuario');
      if (tokenSalvo && tokenSalvo !== 'undefined') setT(tokenSalvo);
      if (usuarioSalvo && usuarioSalvo !== 'undefined') setU(JSON.parse(usuarioSalvo));
    } catch (erro) {
      console.error('Limpando cache corrompido:', erro);
      localStorage.clear();
    } finally {
      setCarregando(false);
    }
  }, []);

  if (carregando) return <div className="min-h-screen bg-[#080808] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>;
  if (t && u) return <PainelProfissional token={t} usuario={u} onLogout={() => { localStorage.clear(); window.location.reload(); }} />;
  return <HomePublica onLogin={(nt, nu) => { localStorage.setItem('aurum_token', nt); localStorage.setItem('aurum_usuario', JSON.stringify(nu)); setT(nt); setU(nu); }} />;
}