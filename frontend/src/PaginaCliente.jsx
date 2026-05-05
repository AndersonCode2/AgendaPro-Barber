import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle2, ChevronRight, ArrowLeft, Loader2, Scissors, X } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

export default function PaginaCliente({ id }) {
  const idSalao = id || window.location.pathname.split('/').filter(Boolean).pop();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salao, setSalao] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [etapa, setEtapa] = useState(1);
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [servicoEscolhido, setServicoEscolhido] = useState(null);
  const [data, setData] = useState('');
  const [horarioEscolhido, setHorarioEscolhido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregarDadosDoSalao() {
      if (!idSalao || idSalao === 'agendar') {
        setErro('Link inválido. Peça o link correto ao salão.');
        setCarregando(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/publico/empresa/${idSalao}`);
        if (!res.ok) throw new Error('Salão não encontrado ou indisponível.');
        
        const dataJson = await res.json();
        setSalao({ nome: dataJson.nome, logo_url: dataJson.logo_url });
        setServicos(Array.isArray(dataJson.servicos) ? dataJson.servicos : []);
        setHorarios(dataJson.horarios_trabalho ? dataJson.horarios_trabalho.split(',') : []);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarDadosDoSalao();
  }, [idSalao]);

  const finalizarAgendamento = async () => {
    if (!nome || !whatsapp || !servicoEscolhido || !data || !horarioEscolhido) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/publico/agendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa_id: idSalao,
          cliente_nome: nome,
          cliente_whatsapp: whatsapp,
          servico_id: servicoEscolhido.id,
          data_reserva: data,
          horario: horarioEscolhido,
          valor: servicoEscolhido.preco
        })
      });
      if (!res.ok) throw new Error('Erro ao registrar agendamento.');
      setSucesso(true);
    } catch (err) {
      console.error(err);
      alert('Ops! Tivemos um problema. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) return <div className="min-h-screen bg-[#080808] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" /></div>;
  if (erro) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
      <X size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-['Playfair_Display'] text-white mb-2">Ops!</h2>
      <p className="text-[#A8A8A8]">{erro}</p>
    </div>
  );
  if (sucesso) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={48} className="text-[#D4AF37]" /></div>
      <h2 className="text-3xl font-['Playfair_Display'] text-white mb-4">Confirmado!</h2>
      <p className="text-[#A8A8A8] mb-8 max-w-sm">Olá, <strong className="text-white">{nome.split(' ')[0]}</strong>! Seu horário para <strong className="text-white">{servicoEscolhido.nome}</strong> está marcado.</p>
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-sm mb-8 text-left space-y-3">
        <div className="flex justify-between"><span className="text-[#6F6F6F]">Data:</span> <span className="text-white font-medium">{data.split('-').reverse().join('/')}</span></div>
        <div className="flex justify-between"><span className="text-[#6F6F6F]">Horário:</span> <span className="text-[#D4AF37] font-bold">{horarioEscolhido}</span></div>
        <div className="flex justify-between"><span className="text-[#6F6F6F]">Local:</span> <span className="text-white font-medium">{salao?.nome}</span></div>
      </div>
      <a href={`https://wa.me/?text=Olá! Confirmei meu agendamento no ${salao?.nome} para ${data.split('-').reverse().join('/')} às ${horarioEscolhido}.`} target="_blank" rel="noreferrer" className="bg-[#D4AF37] text-[#0D0D0D] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Avisar no WhatsApp</a>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-['Inter'] pb-24">
      <header className="bg-[#1A1A1A] p-6 border-b border-[#2A2A2A] flex flex-col items-center justify-center sticky top-0 z-10 shadow-lg">
        {salao?.logo_url ? <img src={salao.logo_url} alt="Logo" className="w-16 h-16 rounded-full border border-[#D4AF37] mb-3 object-cover shadow-[0_0_15px_rgba(212,175,55,0.2)]" /> : <div className="w-16 h-16 rounded-full border border-[#D4AF37] mb-3 flex items-center justify-center bg-[#0D0D0D]"><Scissors className="text-[#D4AF37]" size={24} /></div>}
        <h1 className="text-2xl font-['Playfair_Display'] text-[#D4AF37]">{salao?.nome || 'Salão'}</h1>
        <p className="text-[10px] tracking-widest text-[#A8A8A8] uppercase mt-1">Agendamento Exclusivo</p>
      </header>
      <main className="max-w-md mx-auto p-6 mt-4">
        <div className="flex justify-between items-center mb-8 px-2 relative">
           <div className="absolute top-1/2 left-0 w-full h-px bg-[#2A2A2A] -z-10 transform -translate-y-1/2"></div>
           {[1, 2, 3].map(step => <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${etapa >= step ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A]'}`}>{etapa > step ? <CheckCircle2 size={14} /> : step}</div>)}
        </div>
        {etapa === 1 && (
          <div className="space-y-6 animate-slide-up"><h2 className="text-xl font-['Playfair_Display'] mb-6">Quem é você?</h2><div><label className="text-xs text-[#A8A8A8] uppercase tracking-widest block mb-2">Nome Completo</label><div className="relative"><User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6F6F6F]" size={18} /><input type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-4 pl-12 text-white rounded-2xl outline-none focus:border-[#D4AF37]" /></div></div><div><label className="text-xs text-[#A8A8A8] uppercase tracking-widest block mb-2">WhatsApp</label><div className="relative"><Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6F6F6F]" size={18} /><input type="tel" placeholder="(00) 00000-0000" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-4 pl-12 text-white rounded-2xl outline-none focus:border-[#D4AF37]" /></div></div><button onClick={() => setEtapa(2)} disabled={nome.length < 3 || whatsapp.length < 10} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] p-5 rounded-2xl font-bold uppercase tracking-widest text-sm mt-8 flex justify-between items-center disabled:opacity-50">Próximo Passo <ChevronRight size={18} /></button></div>
        )}
        {etapa === 2 && (
          <div className="space-y-4 animate-slide-up"><div className="flex items-center gap-3 mb-6"><button onClick={() => setEtapa(1)} className="text-[#A8A8A8] hover:text-[#D4AF37]"><ArrowLeft size={20}/></button><h2 className="text-xl font-['Playfair_Display']">Escolha o Serviço</h2></div>{servicos.length === 0 ? <p className="text-center text-[#6F6F6F] py-8 border border-[#2A2A2A] rounded-2xl bg-[#1A1A1A]">Nenhum serviço cadastrado.</p> : servicos.map(servico => (<button key={servico.id} onClick={() => setServicoEscolhido(servico)} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex justify-between items-center ${servicoEscolhido?.id === servico.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#6F6F6F]'}`}><div><h3 className={`font-bold text-lg ${servicoEscolhido?.id === servico.id ? 'text-[#D4AF37]' : 'text-white'}`}>{servico.nome}</h3><p className="text-xs text-[#A8A8A8] mt-1"><Clock size={12} className="inline mr-1"/> {servico.tempo}</p></div><span className={`text-xl ${servicoEscolhido?.id === servico.id ? 'text-[#D4AF37]' : 'text-white'}`}>R$ {Number(servico.preco).toFixed(2)}</span></button>))}<button onClick={() => setEtapa(3)} disabled={!servicoEscolhido} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] p-5 rounded-2xl font-bold uppercase tracking-widest text-sm mt-8 flex justify-between items-center disabled:opacity-50">Próximo Passo <ChevronRight size={18} /></button></div>
        )}
        {etapa === 3 && (
          <div className="space-y-6 animate-slide-up"><div className="flex items-center gap-3 mb-6"><button onClick={() => setEtapa(2)} className="text-[#A8A8A8] hover:text-[#D4AF37]"><ArrowLeft size={20}/></button><h2 className="text-xl font-['Playfair_Display']">Data e Horário</h2></div><div><label className="text-xs text-[#A8A8A8] uppercase tracking-widest block mb-2">Selecione o Dia</label><div className="relative"><Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]" size={18} /><input type="date" min={new Date().toISOString().split('T')[0]} value={data} onChange={e => { setData(e.target.value); setHorarioEscolhido(''); }} className="w-full bg-[#1A1A1A] border border-[#D4AF37]/50 p-4 pl-12 text-white rounded-2xl outline-none appearance-none" style={{ colorScheme: 'dark' }} /></div></div>{data && (<div className="animate-fade-in"><label className="text-xs text-[#A8A8A8] uppercase tracking-widest block mb-3 mt-6">Horários Disponíveis</label><div className="grid grid-cols-3 gap-3">{horarios.length === 0 ? <div className="col-span-3 text-center text-[#6F6F6F] text-sm py-4">Nenhum horário configurado.</div> : horarios.map(hora => (<button key={hora} onClick={() => setHorarioEscolhido(hora)} className={`py-4 rounded-xl border text-sm font-bold transition-all ${horarioEscolhido === hora ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] scale-105' : 'bg-[#1A1A1A] text-white border-[#2A2A2A]'}`}>{hora}</button>))}</div></div>)}<button onClick={finalizarAgendamento} disabled={!data || !horarioEscolhido || enviando} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] p-5 rounded-2xl font-bold uppercase tracking-widest text-sm mt-8 flex justify-center items-center gap-3 disabled:opacity-50">{enviando ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle2 size={20} /> Confirmar Reserva</>}</button></div>
        )}
      </main>
    </div>
  );
}