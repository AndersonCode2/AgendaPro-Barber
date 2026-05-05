import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, Scissors, Loader2, Calendar as CalendarIcon, User, Phone, ArrowLeft } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

export default function PaginaCliente() {
  const { id_profissional } = useParams();
  const [carregando, setCarregando] = useState(true);
  const [salao, setSalao] = useState({ nome: '', logo_url: '' });
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  
  const [passo, setPasso] = useState(1);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${API_URL}/public/profissional/${id_profissional}`);
        const data = await res.json();
        setSalao({ nome: data.nome, logo_url: data.logo_url });
        setServicos(data.servicos || []);
        setFuncionarios(data.funcionarios || []);
      } catch (e) { console.error(e); }
      finally { setCarregando(false); }
    }
    carregar();
  }, [id_profissional]);

  const toggleServico = (s) => {
    const existe = servicosSelecionados.find(item => item.id === s.id);
    if (existe) setServicosSelecionados(servicosSelecionados.filter(i => i.id !== s.id));
    else setServicosSelecionados([...servicosSelecionados, s]);
  };

  const calcularTotal = () => servicosSelecionados.reduce((acc, s) => acc + parseFloat(s.preco), 0);

  const finalizar = async () => {
    setEnviando(true);
    const payload = {
      id_profissional, nome, whatsapp,
      servico_nome: servicosSelecionados.map(s => s.nome).join(', '),
      valor: calcularTotal(),
      data_reserva: dataSelecionada, horario: horarioSelecionado,
      funcionario_id: funcionarioSelecionado?.id, funcionario_nome: funcionarioSelecionado?.nome
    };
    try {
      const res = await fetch(`${API_URL}/public/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) setSucesso(true);
    } finally { setEnviando(false); }
  };

  if (carregando) return <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]"><Loader2 className="animate-spin" /></div>;
  if (sucesso) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-6 animate-fade-in"><CheckCircle2 size={60} className="text-[#D4AF37] mb-4" /><h2 className="text-2xl font-serif">Confirmado!</h2></div>;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="p-8 border-b border-[#2A2A2A] text-center flex flex-col items-center bg-[#0D0D0D]">
        {salao.logo_url ? <img src={salao.logo_url} className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-[#D4AF37]" alt="logo" /> : <Scissors className="text-[#D4AF37] mb-2" />}
        <h1 className="text-[#D4AF37] text-2xl font-serif uppercase tracking-widest">{salao.nome}</h1>
      </header>

      <main className="p-4 max-w-md mx-auto pb-40">
        {passo === 1 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-serif mb-4 text-gray-400">Escolha os serviços:</h2>
            {servicos.map((s) => {
              const sel = servicosSelecionados.find(i => i.id === s.id);
              return (
                <button key={s.id} onClick={() => toggleServico(s)} className={`w-full p-4 rounded-3xl border transition-all flex justify-between items-center ${sel ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#2A2A2A] bg-[#121212]'}`}>
                  <div className="flex flex-col items-start pr-4 flex-1 overflow-hidden">
                    <span className="font-bold text-white text-left wrap-break-word w-full leading-tight">{s.nome}</span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase"><Clock size={10} className="inline mr-1" /> {s.tempo} min</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-[#D4AF37]">R$ {s.preco}</span>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${sel ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-600'}`}>{sel && <CheckCircle2 size={14} className="text-black" />}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {passo === 2 && (
          <div className="space-y-4 animate-fade-in text-center">
            <h2 className="text-xl font-serif mb-6">Escolha o Barbeiro</h2>
            <div className="grid grid-cols-2 gap-3">
              {funcionarios.map(f => (
                <button key={f.id} onClick={() => {setFuncionarioSelecionado(f); setPasso(3);}} className={`p-4 rounded-3xl border transition-all ${funcionarioSelecionado?.id === f.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#2A2A2A]'}`}>
                   <User className="mx-auto mb-2 text-[#D4AF37]" size={24}/>
                   <p className="text-xs font-bold uppercase">{f.nome}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {passo === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-serif flex items-center gap-2"><CalendarIcon className="text-[#D4AF37]" size={20}/> Data e Hora</h2>
            <input type="date" className="w-full bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A] text-white" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)} />
            <div className="grid grid-cols-3 gap-2 mt-4">
               {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(h => (
                 <button key={h} onClick={() => setHorarioSelecionado(h)} className={`p-3 rounded-xl border text-xs font-bold transition-all ${horarioSelecionado === h ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-[#2A2A2A] text-gray-400 bg-[#121212]'}`}>{h}</button>
               ))}
            </div>
          </div>
        )}

        {passo === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-serif">Seus Dados</h2>
            <input type="text" placeholder="Nome Completo" className="w-full bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A] text-white" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="tel" placeholder="WhatsApp" className="w-full bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A] text-white" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
          </div>
        )}

        <div className="fixed bottom-0 left-0 w-full p-4 bg-linear-to-t from-black via-black/80 to-transparent">
          <div className="max-w-md mx-auto">
            {servicosSelecionados.length > 0 && passo === 1 && (
              <div className="bg-[#D4AF37] text-black p-4 rounded-2xl mb-4 flex justify-between items-center font-bold animate-slide-up">
                <span className="text-xs uppercase">Total: {servicosSelecionados.length} itens</span>
                <span className="text-2xl italic">R$ {calcularTotal().toFixed(2)}</span>
              </div>
            )}
            <div className="flex gap-2">
              {passo > 1 && <button onClick={() => setPasso(passo-1)} className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A]"><ArrowLeft size={20}/></button>}
              <button 
                disabled={((passo === 1 && servicosSelecionados.length === 0) || (passo === 2 && !funcionarioSelecionado) || (passo === 3 && !horarioSelecionado) || (passo === 4 && (!nome || !whatsapp)) || enviando)}
                onClick={() => { if(passo < 4) setPasso(passo + 1); else finalizar(); }}
                className="flex-1 bg-[#D4AF37] text-black py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
              >
                {enviando ? <Loader2 className="animate-spin" /> : (passo === 4 ? 'Finalizar Reserva' : 'Próximo Passo')} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}