// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Calendar, DollarSign, Settings, PlusCircle, MessageCircle, X, Trash2, Plus, CheckCircle2, LogOut, Shield } from 'lucide-react';
import PaginaCliente from './PaginaCliente';

// 🚀 CONEXÃO COM O SERVIDOR NA NUVEM!
const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

// ==========================================
// 🔐 TELA DE AUTENTICAÇÃO
// ==========================================
function TelaAuth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  const [fluxoGoogle, setFluxoGoogle] = useState(null); 

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (tel) => tel.replace(/\D/g, '').length >= 10;

  const handleSubmitTradicional = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validarEmail(email)) return setErro('Por favor, insira um e-mail válido.');
    if (senha.length < 6) return setErro('A senha deve ter no mínimo 6 caracteres de segurança.');
    if (!isLogin && !validarTelefone(telefone)) return setErro('Por favor, insira um WhatsApp válido com DDD.');

    const endpoint = isLogin ? '/login' : '/cadastro';
    const body = isLogin ? { email, senha } : { nome, email, senha, telefone };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na autenticação');
      
      onLogin(data.token, data.usuario);
    } catch (err) { setErro(err.message); }
  };

  const handleGoogleClick = async () => {
    setErro('');
    const mockEmail = `cabeleireiro${Math.floor(Math.random() * 1000)}@gmail.com`;
    const mockNome = "Salão " + Math.floor(Math.random() * 100);

    try {
      const res = await fetch(`${API_URL}/google/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, nome: mockNome })
      });
      const data = await res.json();
      
      if (data.action === 'login') {
        onLogin(data.token, data.usuario);
      } else if (data.action === 'register_needed') {
        setFluxoGoogle({ email: data.email, nome: data.nome });
        setNome(data.nome);
        setEmail(data.email);
      }
    } catch (err) { 
      console.error(err); 
      setErro('Erro ao conectar com Google.'); 
    }
  };

  const handleCompletarGoogle = async (e) => {
    e.preventDefault();
    setErro('');
    if (!validarTelefone(telefone)) return setErro('Por favor, insira um WhatsApp válido com DDD.');

    try {
      const res = await fetch(`${API_URL}/google/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email: fluxoGoogle.email, telefone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao finalizar cadastro');
      
      onLogin(data.token, data.usuario);
    } catch (err) { setErro(err.message); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center p-6 font-['Inter']">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-normal font-['Playfair_Display'] text-[#D4AF37] tracking-widest">AURUM</h1>
        </div>

        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] shadow-2xl relative overflow-hidden">
          
          {fluxoGoogle ? (
             <div className="animate-slide-up">
                <h2 className="text-2xl text-[#D4AF37] font-['Playfair_Display'] mb-2 text-center">Falta pouco!</h2>
                <p className="text-xs text-[#A8A8A8] text-center mb-6 font-light leading-relaxed">
                  Para o sistema de agendamento funcionar, precisamos do seu número de WhatsApp.
                </p>
                {erro && <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded-lg text-sm mb-4 text-center">{erro}</div>}
                
                <form onSubmit={handleCompletarGoogle} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-[#A8A8A8] uppercase tracking-wider mb-2 block">Nome do Salão</label>
                    <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A8A8A8] uppercase tracking-wider mb-2 block">WhatsApp (Com DDD)</label>
                    <input type="tel" required placeholder="Ex: 11999999999" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#D4AF37] rounded-xl focus:border-[#D4AF37] outline-none text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium tracking-widest uppercase text-sm mt-4 hover:bg-[#E6C76B] transition-colors">
                    Finalizar Cadastro
                  </button>
                </form>
             </div>
          ) : (
            <div>
              <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6 text-center">{isLogin ? 'Acesse seu espaço' : 'Crie sua exclusividade'}</h2>
              {erro && <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded-lg text-sm mb-4 text-center animate-fade-in">{erro}</div>}
              <form onSubmit={handleSubmitTradicional} className="space-y-4">
                {!isLogin && (
                  <>
                    <div><label className="text-[10px] text-[#A8A8A8] uppercase tracking-wider mb-2 block">Nome do Profissional / Salão</label><input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors text-sm" /></div>
                    <div><label className="text-[10px] text-[#A8A8A8] uppercase tracking-wider mb-2 block">WhatsApp (Com DDD)</label><input type="tel" required placeholder="Ex: 11999999999" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors text-sm" /></div>
                  </>
                )}
                <div><label className="text-[10px] text-[#A8A8A8] uppercase tracking-wider mb-2 block">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors text-sm" /></div>
                <div><label className="text-[10px] text-[#A8A8A8] uppercase tracking-wider mb-2 block">Senha Segura</label><input type="password" required placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors text-sm" /></div>
                <button type="submit" className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium tracking-widest uppercase text-sm hover:bg-[#E6C76B] transition-colors mt-2">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
              </form>
              
              <div className="relative flex items-center py-6"><div className="grow border-t border-[#2A2A2A]"></div><span className="shrink-0 mx-4 text-[#6F6F6F] text-xs font-light">OU</span><div className="grow border-t border-[#2A2A2A]"></div></div>
              
              <button type="button" onClick={handleGoogleClick} className="w-full bg-white text-black p-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Entrar com Google
              </button>
              
              <div className="mt-8 text-center"><button onClick={() => { setIsLogin(!isLogin); setErro(''); setSenha(''); }} className="text-[#A8A8A8] text-sm hover:text-white transition-colors">{isLogin ? 'Não tem uma conta? Crie aqui.' : 'Já tem uma conta? Faça login.'}</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

  const [novoServico, setNovoServico] = useState({ nome: '', preco: '', tempo: '' });
  const [vendaNome, setVendaNome] = useState('');
  const [vendaServico, setVendaServico] = useState(null);

  const linkBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const linkCliente = `${linkBase}/agendar/${usuario.id}`;
  
  const mensagemPromo = encodeURIComponent(`✨ Exclusividade e sofisticação. Agende sua experiência premium com ${usuario.nome}: ${linkCliente}`);

  const headersAPI = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const carregarDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`, { headers: headersAPI });
      const data = await res.json();
      if(res.ok) { setGanhoDia(data.ganhoDia || 0); setQtdAtendimentos(data.qtdAtendimentos || 0); }
    } catch (error) { console.error(error); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const carregarServicos = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/servicos`, { headers: headersAPI });
      if(res.ok) setServicos(await res.json());
    } catch (error) { console.error(error); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const carregarAgenda = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/agendamentos`, { headers: headersAPI });
      if(res.ok) setAgendamentos(await res.json());
    } catch (error) { console.error(error); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const carregarCaixa = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/vendas`, { headers: headersAPI });
      if(res.ok) setHistoricoCaixa(await res.json());
    } catch (error) { console.error(error); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const carregarDadosCeo = useCallback(async () => {
    if (!usuario.is_ceo) return;
    try {
      const res = await fetch(`${API_URL}/ceo/dashboard`, { headers: headersAPI });
      if(res.ok) setDadosCeo(await res.json());
    } catch (error) { console.error(error); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, usuario.is_ceo]);

  useEffect(() => {
    const iniciar = async () => {
      await carregarDashboard(); await carregarServicos(); await carregarAgenda(); await carregarCaixa(); await carregarDadosCeo();
    };
    iniciar();
  }, [carregarDashboard, carregarServicos, carregarAgenda, carregarCaixa, carregarDadosCeo]);

  const adicionarServico = async () => {
    if (!novoServico.nome || !novoServico.preco) return;
    try {
      await fetch(`${API_URL}/servicos`, { method: 'POST', headers: headersAPI, body: JSON.stringify(novoServico) });
      setNovoServico({ nome: '', preco: '', tempo: '' }); setMostrarFormServico(false); carregarServicos();
    } catch (error) { console.error(error); }
  };
  
  const removerServico = async (id) => {
    try { await fetch(`${API_URL}/servicos/${id}`, { method: 'DELETE', headers: headersAPI }); carregarServicos(); } catch (error) { console.error(error); }
  };

  const confirmarVenda = async (e) => {
    e.preventDefault();
    if (!vendaServico) return;
    try {
      await fetch(`${API_URL}/vendas`, { method: 'POST', headers: headersAPI, body: JSON.stringify({ valor: parseFloat(vendaServico.preco) }) });
      setVendaNome(''); setVendaServico(null); setModalAberto(false);
      carregarDashboard(); carregarCaixa(); carregarDadosCeo();
    } catch (error) { console.error(error); }
  };

  const concluirAtendimento = async (id) => {
    try {
      await fetch(`${API_URL}/agendamentos/${id}/concluir`, { method: 'POST', headers: headersAPI });
      carregarAgenda(); carregarDashboard(); carregarCaixa(); carregarDadosCeo();
    } catch (error) { console.error("Erro ao concluir", error); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] font-['Inter'] text-white">
      <header className="bg-[#1A1A1A] p-5 shadow-[0_1px_0_rgba(42,42,42,1)] flex justify-between items-center sticky top-0 z-10 border-b border-[#2A2A2A]">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-['Playfair_Display'] tracking-tight text-[#D4AF37]">AURUM</h1>
          <p className="text-[10px] tracking-widest text-[#A8A8A8] mt-1 uppercase">
            {usuario.is_ceo ? '⚡ PAINEL MASTER' : `OLÁ, ${usuario.nome.split(' ')[0]}`}
          </p>
        </div>
        <button onClick={onLogout} className="w-9 h-9 border border-[#2A2A2A] text-[#A8A8A8] hover:text-[#ff4d4d] hover:border-[#ff4d4d] transition-colors rounded-full flex items-center justify-center" title="Sair">
          <LogOut size={16} />
        </button>
      </header>

      <main className="flex-1 p-6 pb-28 overflow-y-auto space-y-8">
        
        {telaAtiva === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A]">
                <span className="text-[#A8A8A8] text-sm font-light">Ganhos de Hoje</span>
                <span className="text-3xl font-normal font-['Playfair_Display'] text-[#E6C76B] block mt-2">R$ {ganhoDia.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A]">
                <span className="text-[#A8A8A8] text-sm font-light">Atendimentos</span>
                <span className="text-3xl font-normal font-['Playfair_Display'] text-white block mt-2">{qtdAtendimentos}</span>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={() => setModalAberto(true)} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-5 rounded-xl font-medium flex items-center justify-center gap-3 text-lg shadow-[0_4px_20px_rgba(212,175,55,0.2)]"><PlusCircle size={22} strokeWidth={2} /> Novo Registro</button>
              <a href={`https://wa.me/?text=${mensagemPromo}`} target="_blank" rel="noreferrer" className="w-full bg-[#1A1A1A] text-[#D4AF37] border border-[#2A2A2A] hover:border-[#D4AF37] p-5 rounded-xl font-medium flex items-center justify-center gap-3 text-lg transition-all"><MessageCircle size={22} strokeWidth={1.5} /> Divulgar Link VIP</a>
              <button onClick={() => { navigator.clipboard.writeText(linkCliente); alert("Link do seu Salão copiado! Cole no seu Instagram."); }} className="w-full text-center text-[#A8A8A8] hover:text-white pt-4 text-xs tracking-wider block transition-colors uppercase">Copiar Meu Link Exclusivo</button>
            </div>
          </div>
        )}

        {telaAtiva === 'agenda' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-normal font-['Playfair_Display'] text-white mb-6">Próximos Agendamentos</h2>
            <div className="space-y-4">
              {agendamentos.length === 0 ? <p className="text-center text-[#6F6F6F] py-8 font-light">Nenhuma reserva pendente.</p> : agendamentos.map((ag) => (
                  <div key={ag.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col gap-4 group hover:border-[#D4AF37]/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[#D4AF37] font-['Playfair_Display'] text-xl block mb-1">{ag.data_reserva} às {ag.horario}</span>
                        <p className="text-white font-medium">{ag.cliente_nome}</p>
                        <p className="text-[#A8A8A8] text-sm mt-1">{ag.servico_nome}</p>
                      </div>
                      <span className="text-white font-['Playfair_Display'] text-lg">R$ {parseFloat(ag.valor).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button onClick={() => concluirAtendimento(ag.id)} className="w-full bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37] p-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-colors"><CheckCircle2 size={18} /> Concluir Atendimento</button>
                  </div>
              ))}
            </div>
          </div>
        )}

        {telaAtiva === 'caixa' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Fluxo de Caixa</h2>
              <span className="text-[#D4AF37] font-['Playfair_Display'] text-xl">R$ {ganhoDia.toFixed(2).replace('.', ',')} <span className="text-[10px] text-[#A8A8A8] font-['Inter'] font-light uppercase tracking-widest block text-right">Hoje</span></span>
            </div>
            <div className="space-y-3">
              {historicoCaixa.length === 0 ? <p className="text-center text-[#6F6F6F] py-8 font-light">Nenhuma movimentação.</p> : historicoCaixa.map((item) => {
                  const dataObj = new Date(item.data_venda);
                  return (
                    <div key={item.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl flex justify-between items-center hover:border-[#D4AF37]/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#0D0D0D] p-3 rounded-xl border border-[#2A2A2A] text-[#D4AF37]"><DollarSign size={20} strokeWidth={1.5} /></div>
                        <div><p className="text-white font-medium text-sm">Entrada Recebida</p><p className="text-[#A8A8A8] text-xs mt-1 font-light">{dataObj.toLocaleDateString('pt-BR')} às {dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p></div>
                      </div>
                      <span className="text-[#D4AF37] font-['Playfair_Display'] text-lg">+ R$ {parseFloat(item.valor).toFixed(2).replace('.', ',')}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {telaAtiva === 'config' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Menu de Experiências</h2>
              <button onClick={() => setMostrarFormServico(!mostrarFormServico)} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-wider font-medium">{mostrarFormServico ? 'Cancelar' : <><Plus size={16}/> Adicionar</>}</button>
            </div>
            {mostrarFormServico && (
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] space-y-4 animate-slide-up mb-8">
                <div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Nome da Experiência</label><input type="text" value={novoServico.nome} onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"/></div>
                <div className="flex gap-4">
                  <div className="flex-1"><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Valor (R$)</label><input type="text" value={novoServico.preco} onChange={(e) => setNovoServico({...novoServico, preco: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#D4AF37] rounded-xl focus:border-[#D4AF37] outline-none"/></div>
                  <div className="flex-1"><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Tempo</label><input type="text" value={novoServico.tempo} onChange={(e) => setNovoServico({...novoServico, tempo: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none"/></div>
                </div>
                <button onClick={adicionarServico} className="w-full bg-[#D4AF37] text-[#0D0D0D] p-4 rounded-xl font-medium mt-2">Salvar Experiência</button>
              </div>
            )}
            <div className="space-y-4">
              {servicos.map((servico) => (
                  <div key={servico.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex justify-between items-center group">
                    <div><p className="text-white font-light text-lg">{servico.nome}</p><p className="text-[#A8A8A8] text-sm mt-1">{servico.tempo}</p></div>
                    <div className="flex items-center gap-5"><span className="text-[#D4AF37] text-xl">R$ {parseFloat(servico.preco).toFixed(2).replace('.', ',')}</span><button onClick={() => removerServico(servico.id)} className="text-[#6F6F6F] hover:text-[#ff4d4d] p-2"><Trash2 size={18} /></button></div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TELA SECRETA DO CEO --- */}
        {telaAtiva === 'ceo' && usuario.is_ceo && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-[#D4AF37]">Painel Oculto</h2>
              <p className="text-[#A8A8A8] text-sm mt-2 font-light">Visão global da plataforma AURUM</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <span className="text-[#A8A8A8] text-sm font-light uppercase tracking-wider">Empresas Ativas</span>
                <span className="text-4xl font-normal font-['Playfair_Display'] text-white block mt-3">{dadosCeo.totalEmpresas}</span>
              </div>
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <span className="text-[#A8A8A8] text-sm font-light uppercase tracking-wider">Faturamento Global</span>
                <span className="text-3xl font-normal font-['Playfair_Display'] text-[#E6C76B] block mt-3">R$ {dadosCeo.faturamentoGlobal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-normal font-['Playfair_Display'] text-white mb-4">Últimos Assinantes</h3>
              <div className="space-y-3">
                {dadosCeo.empresas.length === 0 ? (
                  <p className="text-[#6F6F6F] font-light">Nenhuma empresa cadastrada ainda.</p>
                ) : (
                  dadosCeo.empresas.map((empresa) => (
                    <div key={empresa.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{empresa.nome}</p>
                        <p className="text-[#A8A8A8] text-xs mt-1">{empresa.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#6F6F6F] font-light block">ID: {empresa.id}</span>
                        <span className="text-xs text-[#D4AF37] font-medium block mt-1">{empresa.telefone}</span>
                      </div>
                    </div>
                  ))
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
        <NavButton icone={<Settings />} texto="Ajustes" ativo={telaAtiva === 'config'} onClick={() => setTelaAtiva('config')} />
        {usuario.is_ceo && (
          <NavButton icone={<Shield />} texto="Admin" ativo={telaAtiva === 'ceo'} onClick={() => setTelaAtiva('ceo')} isDestaque={true} />
        )}
      </nav>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-end z-50 animate-fade-in">
          <div className="bg-[#1A1A1A] w-full rounded-t-3xl p-7 border-t border-[#2A2A2A] animate-slide-up">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-normal font-['Playfair_Display'] text-white">Novo Atendimento</h2><button onClick={() => setModalAberto(false)} className="text-[#A8A8A8] hover:text-white p-2 bg-[#2A2A2A] rounded-full"><X size={20}/></button></div>
            <form onSubmit={confirmarVenda} className="space-y-6">
              <div><label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-2 block">Cliente (Opcional)</label><input type="text" placeholder="Nome do cliente" className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-white rounded-xl focus:border-[#D4AF37] outline-none" value={vendaNome} onChange={(e) => setVendaNome(e.target.value)} /></div>
              <div>
                <label className="text-xs text-[#A8A8A8] uppercase tracking-wider mb-3 block">Selecione a Experiência</label>
                <div className="flex flex-wrap gap-3">
                  {servicos.map((item) => (
                    <button type="button" key={item.id} onClick={() => setVendaServico(item)} className={`px-5 py-3 rounded-xl border text-sm font-light transition-all ${vendaServico?.id === item.id ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'bg-[#0D0D0D] text-[#A8A8A8] border-[#2A2A2A]'}`}>{item.nome}</button>
                  ))}
                </div>
              </div>
              {vendaServico && (<div className="bg-[#0D0D0D] border border-[#D4AF37]/30 p-4 rounded-xl flex justify-between items-center"><span className="text-[#A8A8A8] font-light">Valor a receber:</span><span className="text-[#D4AF37] text-2xl">R$ {parseFloat(vendaServico.preco).toFixed(2).replace('.', ',')}</span></div>)}
              <button type="submit" disabled={!vendaServico} className={`w-full p-5 flex justify-center gap-3 rounded-xl transition-all ${vendaServico ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A] cursor-not-allowed'}`}><CheckCircle2 size={22} /> <span className="font-medium tracking-widest uppercase text-sm">Confirmar & Receber</span></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ icone, texto, ativo, onClick, isDestaque }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors pt-2 ${ativo ? (isDestaque ? 'text-red-500' : 'text-[#D4AF37]') : 'text-[#6F6F6F] hover:text-[#A8A8A8]'}`}>
      {React.cloneElement(icone, { size: 22, strokeWidth: ativo ? 2 : 1.5 })}
      <span className="text-[10px] mt-1.5 font-medium tracking-widest uppercase">{texto}</span>
    </button>
  );
}

// ==========================================
// 🚀 ROTEADOR
// ==========================================
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('aurum_token'));
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('aurum_usuario')));

  const handleLogin = (newToken, user) => {
    localStorage.setItem('aurum_token', newToken);
    localStorage.setItem('aurum_usuario', JSON.stringify(user));
    setToken(newToken);
    setUsuario(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('aurum_token');
    localStorage.removeItem('aurum_usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token && usuario ? <PainelProfissional token={token} usuario={usuario} onLogout={handleLogout} /> : <TelaAuth onLogin={handleLogin} />} />
        <Route path="/agendar/:id_profissional" element={<PaginaCliente />} />
      </Routes>
    </BrowserRouter>
  );
}