/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle2, ChevronRight, ArrowLeft, Loader2, Scissors, X } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

export default function PaginaCliente({ id }) {
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
    async function carregarDados() {
      try {
        const res = await fetch(`${API_URL}/publico/empresa/${id}`);
        if (!res.ok) throw new Error('Salão não encontrado.');
        const dataJson = await res.json();
        setSalao(dataJson);
        setServicos(dataJson.servicos || []);
        setHorarios(dataJson.horarios_trabalho ? dataJson.horarios_trabalho.split(',') : []);
      } catch (err) { setErro(err.message); }
      finally { setCarregando(false); }
    }
    carregarDados();
  }, [id]);

  const finalizarAgendamento = async () => {
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/publico/agendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa_id: id, cliente_nome: nome, cliente_whatsapp: whatsapp,
          servico_id: servicoEscolhido.id, data_reserva: data, 
          horario: horarioEscolhido, valor: servicoEscolhido.preco
        })
      });
      if (res.ok) setSucesso(true);
    } catch (e) { alert('Erro ao processar agendamento.'); }
    finally { setEnviando(false); }
  };

  if (carregando) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#D4AF37]" size={40} /></div>;
  if (erro) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center"><X className="text-red-500 mb-4" size={50} /><h2 className="text-xl">Ops! {erro}</h2></div>;
  if (sucesso) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in"><CheckCircle2 className="text-[#D4AF37] mb-6" size={80} /><h2 className="text-3xl font-serif mb-2">Confirmado!</h2><p className="text-gray-400">Obrigado, {nome}. Seu horário foi reservado.</p></div>;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-['Inter']">
      <header className="p-8 border-b border-[#2A2A2A] text-center">
        <h1 className="text-[#D4AF37] font-serif text-3xl tracking-widest uppercase">{salao?.nome}</h1>
        <p className="text-xs text-gray-500 mt-2">AGENDAMENTO EXCLUSIVO</p>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {etapa === 1 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-xl font-serif border-l-2 border-[#D4AF37] pl-4">Seus Dados</h2>
            <input type="text" placeholder="Seu Nome Completo" className="w-full bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A] outline-none focus:border-[#D4AF37]" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="tel" placeholder="WhatsApp com DDD" className="w-full bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A] outline-none focus:border-[#D4AF37]" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            <button onClick={() => setEtapa(2)} disabled={nome.length < 3} className="w-full bg-[#D4AF37] text-black p-5 rounded-2xl font-bold uppercase tracking-widest disabled:opacity-50">Continuar</button>
          </div>
        )}

        {etapa === 2 && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-3 mb-6"><button onClick={() => setEtapa(1)} className="text-gray-500"><ArrowLeft size={20}/></button><h2 className="text-xl font-serif">Escolha o Serviço</h2></div>
            {servicos.map(s => (
              <button key={s.id} onClick={() => {setServicoEscolhido(s); setEtapa(3)}} className="w-full bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] flex justify-between items-center hover:border-[#D4AF37] transition-all">
                <div className="text-left"><p className="font-bold">{s.nome}</p><p className="text-xs text-gray-500">{s.tempo}</p></div>
                <span className="text-[#D4AF37] font-bold">R$ {Number(s.preco).toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}

        {etapa === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6"><button onClick={() => setEtapa(2)} className="text-gray-500"><ArrowLeft size={20}/></button><h2 className="text-xl font-serif">Data e Horário</h2></div>
            <input type="date" className="w-full bg-[#1A1A1A] p-5 rounded-2xl text-white border border-[#2A2A2A]" value={data} onChange={e => setData(e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              {horarios.map(h => (
                <button key={h} onClick={() => setHorarioEscolhido(h)} className={`p-3 border rounded-xl text-sm font-bold transition-all ${horarioEscolhido === h ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-[#2A2A2A] text-gray-400'}`}>{h}</button>
              ))}
            </div>
            <button onClick={finalizarAgendamento} disabled={!data || !horarioEscolhido || enviando} className="w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-black p-5 rounded-2xl font-bold uppercase tracking-widest mt-8 flex justify-center items-center">
              {enviando ? <Loader2 className="animate-spin" /> : 'FINALIZAR AGENDAMENTO'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}