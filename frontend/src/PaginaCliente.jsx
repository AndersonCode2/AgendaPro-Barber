// frontend/src/PaginaCliente.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2, ArrowLeft, Phone, Gift, Star } from 'lucide-react';

// 🚀 AQUI TAMBÉM VAI A CONEXÃO COM O SEU SERVIDOR NA NUVEM!
const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

const gerarDiasDisponiveis = () => {
  const dias = [];
  for(let i=0; i<7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    let label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    if(i === 0) label = 'Hoje';
    if(i === 1) label = 'Amanhã';
    dias.push({ label, valor: d.toLocaleDateString('pt-BR') });
  }
  return dias;
};

export default function PaginaCliente() {
  const { id_profissional } = useParams();

  const [etapa, setEtapa] = useState(1);
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nascimento, setNascimento] = useState('');
  
  const [servicosEscolhidos, setServicosEscolhidos] = useState([]);
  
  const [dadosProfissional, setDadosProfissional] = useState(null);
  const [diasDisponiveis] = useState(gerarDiasDisponiveis());
  const [dataEscolhida, setDataEscolhida] = useState(diasDisponiveis[0].valor); 
  const [horarioEscolhido, setHorarioEscolhido] = useState('');
  const [servicos, setServicos] = useState([]);
  const [ultimoServico, setUltimoServico] = useState(null); 

  const horarios = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

  useEffect(() => {
    if (!id_profissional) return;
    fetch(`${API_URL}/public/profissional/${id_profissional}`)
      .then(res => res.json())
      .then(data => setDadosProfissional(data))
      .catch(err => console.error(err));

    fetch(`${API_URL}/public/servicos/${id_profissional}`)
      .then(res => res.json())
      .then(data => setServicos(data))
      .catch(err => console.error(err));
  }, [id_profissional]);

  const avancarParaServicos = async () => {
    if (!podeContinuar) return;
    try {
      const res = await fetch(`${API_URL}/public/historico/${id_profissional}/${whatsapp}`);
      const data = await res.json();
      setUltimoServico(data.ultimoServico || null);
    } catch (error) { console.error(error); }
    setEtapa(2);
  };

  const toggleServico = (servico) => {
    const jaEscolhido = servicosEscolhidos.find(s => s.id === servico.id);
    if (jaEscolhido) {
      setServicosEscolhidos(servicosEscolhidos.filter(s => s.id !== servico.id));
    } else {
      setServicosEscolhidos([...servicosEscolhidos, servico]);
    }
  };

  const valorTotal = servicosEscolhidos.reduce((acc, curr) => acc + parseFloat(curr.preco), 0);
  const nomesServicosCombinados = servicosEscolhidos.map(s => s.nome).join(' + ');

  const finalizarAgendamento = async () => {
    try {
      await fetch(`${API_URL}/public/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_profissional,
          nome, 
          whatsapp, 
          nascimento,
          servico_nome: nomesServicosCombinados,
          data_reserva: dataEscolhida,
          horario: horarioEscolhido,
          valor: valorTotal
        })
      });

      const numeroProfissional = dadosProfissional?.telefone?.replace(/\D/g, '') || '99999999999';
      
      const texto = `✨ *Nova Reserva VIP* ✨%0A%0A*Cliente:* ${nome}%0A*Contato:* ${whatsapp}%0A*Serviços:* ${nomesServicosCombinados}%0A*Data:* ${dataEscolhida}%0A*Horário:* ${horarioEscolhido}%0A*Total:* R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
      window.open(`https://wa.me/55${numeroProfissional}?text=${texto}`, '_blank');
      
    } catch (error) { 
      console.error(error); alert("Houve um erro ao realizar a reserva."); 
    }
  };

  const podeContinuar = nome.trim() !== '' && whatsapp.trim().length >= 10;

  const lidarComVoltar = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex justify-center text-white font-['Inter']">
      <div className="w-full max-w-md bg-[#0D0D0D] min-h-screen relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <header className="p-6 text-center border-b border-[#2A2A2A] bg-[#0D0D0D]/90 backdrop-blur-md sticky top-0 z-10">
          <button onClick={lidarComVoltar} className="absolute left-6 top-7 text-[#A8A8A8] hover:text-[#D4AF37] transition-colors flex items-center gap-2 text-sm tracking-wide">
            <ArrowLeft size={16} strokeWidth={1.5} /> {etapa > 1 ? 'Voltar' : 'Sair'}
          </button>
          <h1 className="text-2xl font-['Playfair_Display'] tracking-widest text-[#D4AF37] uppercase">{dadosProfissional?.nome || 'AURUM'}</h1>
          <p className="text-[10px] tracking-[0.2em] text-[#A8A8A8] mt-1 uppercase">Experiência Premium</p>
        </header>

        <main className="flex-1 p-6 w-full flex flex-col justify-start animate-fade-in pb-28">
          
          {/* ETAPA 1 */}
          {etapa === 1 && (
            <div className="space-y-10 animate-slide-up mt-8">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-normal font-['Playfair_Display'] text-white">Seja bem-vindo(a).</h2>
                <p className="text-[#A8A8A8] font-light tracking-wide">Por favor, insira seus dados para a reserva.</p>
              </div>
              <div className="space-y-6">
                <div className="relative"><input type="text" placeholder="Nome completo" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 text-white font-light focus:outline-none focus:border-[#D4AF37] rounded-xl" value={nome} onChange={(e) => setNome(e.target.value)}/></div>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Phone size={18} className="text-[#A8A8A8]"/></div><input type="tel" placeholder="Seu WhatsApp (com DDD)" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 pl-12 text-white font-light focus:outline-none focus:border-[#D4AF37] rounded-xl" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}/></div>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Gift size={18} className="text-[#A8A8A8]"/></div><input type="text" placeholder="Data de Nascimento (Opcional)" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 pl-12 text-white font-light focus:outline-none focus:border-[#D4AF37] rounded-xl" value={nascimento} onChange={(e) => setNascimento(e.target.value)}/></div>
              </div>
              <button onClick={avancarParaServicos} className={`w-full p-5 flex items-center justify-between rounded-xl transition-all duration-500 mt-8 ${podeContinuar ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:bg-[#E6C76B]' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#6F6F6F] cursor-not-allowed'}`}><span className="font-medium tracking-widest uppercase text-sm">Continuar</span> <ChevronRight size={20} /></button>
            </div>
          )}

          {/* ETAPA 2: MÚLTIPLA ESCOLHA */}
          {etapa === 2 && (
            <div className="space-y-6 animate-slide-up mt-4">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-center text-white mb-8 leading-snug">Olá, <span className="text-[#D4AF37] italic">{nome.split(' ')[0]}</span>.<br/>Quais serviços deseja hoje?</h2>
              
              <p className="text-center text-xs text-[#A8A8A8] uppercase tracking-widest mb-4">Você pode selecionar mais de um</p>

              <div className="space-y-4">
                {servicos.length === 0 ? <p className="text-[#A8A8A8] text-center text-sm py-4">Nenhum serviço cadastrado.</p> : servicos.map((servico) => {
                  const isUltimo = ultimoServico && ultimoServico.includes(servico.nome);
                  const isSelecionado = servicosEscolhidos.some(s => s.id === servico.id);

                  return (
                    <button 
                      key={servico.id} 
                      onClick={() => toggleServico(servico)} 
                      className={`w-full text-left p-6 transition-all rounded-xl group flex flex-col justify-center relative overflow-hidden ${isSelecionado ? 'bg-[#1A1A1A] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-[#1A1A1A] border-2 border-[#2A2A2A] hover:border-[#6F6F6F]'}`}
                    >
                      {isUltimo && !isSelecionado && (<div className="absolute top-0 left-0 w-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold text-center py-1 flex justify-center items-center gap-1"><Star size={10} /> Seu último pedido</div>)}
                      
                      <div className={`flex justify-between items-center w-full ${isUltimo && !isSelecionado ? 'mt-4' : ''}`}>
                        <div>
                          <h3 className={`text-lg font-light transition-colors duration-300 ${isSelecionado ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37]'}`}>{servico.nome}</h3>
                          <p className="text-sm text-[#A8A8A8] mt-2 flex items-center gap-2"><Clock size={14} className={isSelecionado ? "text-[#D4AF37]/70" : "text-[#6F6F6F]"} /> {servico.tempo}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`${isSelecionado ? "text-[#D4AF37]" : "text-white"} font-['Playfair_Display'] text-xl`}>R$ {parseFloat(servico.preco).toFixed(2).replace('.', ',')}</span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelecionado ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#6F6F6F]'}`}>
                            {isSelecionado && <CheckCircle2 size={14} className="text-[#0D0D0D]" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="fixed bottom-0 left-0 w-full flex justify-center p-4 bg-linear-to-t from-[#0D0D0D] via-[#0D0D0D] to-transparent z-20">
                <div className="w-full max-w-md">
                   <button 
                     onClick={() => setEtapa(3)} 
                     disabled={servicosEscolhidos.length === 0} 
                     className={`w-full p-5 flex items-center justify-between rounded-xl transition-all duration-500 shadow-2xl ${servicosEscolhidos.length > 0 ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:bg-[#E6C76B]' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#6F6F6F] cursor-not-allowed opacity-90'}`}
                   >
                     <div className="flex flex-col text-left">
                       <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Total</span>
                       <span className="font-['Playfair_Display'] text-xl">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="font-medium tracking-widest uppercase text-sm">Agendar</span> <ChevronRight size={20} />
                     </div>
                   </button>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3 */}
          {etapa === 3 && (
            <div className="space-y-6 animate-slide-up mt-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-normal font-['Playfair_Display'] text-white">Escolha data e horário</h2>
                <p className="text-[#D4AF37] text-sm mt-2 font-light tracking-wide px-4 leading-relaxed">{nomesServicosCombinados}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] mb-8 shadow-lg">
                 
                 <div className="flex overflow-x-auto gap-3 pb-6 mb-6 border-b border-[#2A2A2A] no-scrollbar">
                   {diasDisponiveis.map((dia) => (
                     <button key={dia.valor} onClick={() => setDataEscolhida(dia.valor)} className={`shrink-0 px-4 py-2 rounded-lg text-sm border transition-all whitespace-nowrap ${dataEscolhida === dia.valor ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] font-medium' : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A8A8A8] hover:border-[#6F6F6F]'}`}>
                       {dia.label}
                     </button>
                   ))}
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                   {horarios.map((hora) => (
                     <button key={hora} onClick={() => setHorarioEscolhido(hora)} className={`py-3 rounded-xl text-sm font-medium transition-all border ${horarioEscolhido === hora ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A8A8A8] hover:border-[#6F6F6F] hover:text-white'}`}>{hora}</button>
                   ))}
                 </div>
              </div>
              <button onClick={finalizarAgendamento} disabled={!horarioEscolhido} className={`w-full p-5 flex items-center justify-center gap-3 rounded-xl transition-all ${horarioEscolhido ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_4px_25px_rgba(212,175,55,0.25)] hover:bg-[#E6C76B]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A] cursor-not-allowed'}`}><CheckCircle2 size={20} /> <span className="font-medium tracking-widest uppercase text-sm">Confirmar Reserva</span></button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}