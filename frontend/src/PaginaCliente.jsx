import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2, ArrowLeft, Phone, Gift, Star } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

const gerarDiasDisponiveis = () => {
  const dias = [];
  for(let i=0; i<7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    let label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    if(i === 0) label = 'Hoje'; if(i === 1) label = 'Amanhã';
    dias.push({ label, valor: d.toLocaleDateString('pt-BR') });
  }
  return dias;
};

export default function PaginaCliente() {
  const { id_profissional } = useParams();
  const [etapa, setEtapa] = useState(1);
  const [nome, setNome] = useState(''); const [whatsapp, setWhatsapp] = useState(''); const [nascimento, setNascimento] = useState('');
  const [servicosEscolhidos, setServicosEscolhidos] = useState([]);
  const [dadosProfissional, setDadosProfissional] = useState(null);
  const [diasDisponiveis] = useState(gerarDiasDisponiveis());
  const [dataEscolhida, setDataEscolhida] = useState(diasDisponiveis[0].valor); 
  const [horarioEscolhido, setHorarioEscolhido] = useState('');
  const [servicos, setServicos] = useState([]);
  const [ultimoServico, setUltimoServico] = useState(null); 
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  
  // Lista oficial puxada do banco do profissional
  const [horariosDoProfissional, setHorariosDoProfissional] = useState([]);

  useEffect(() => {
    if (!id_profissional) return;
    fetch(`${API_URL}/public/profissional/${id_profissional}`).then(res => res.json()).then(data => {
      setDadosProfissional(data);
      if(data.horarios_trabalho) setHorariosDoProfissional(data.horarios_trabalho.split(','));
    });
    fetch(`${API_URL}/public/servicos/${id_profissional}`).then(res => res.json()).then(data => setServicos(data));
  }, [id_profissional]);

  useEffect(() => {
    if (!id_profissional || !dataEscolhida) return;
    fetch(`${API_URL}/public/horarios-ocupados/${id_profissional}?data=${encodeURIComponent(dataEscolhida)}`)
      .then(res => res.json()).then(data => setHorariosOcupados(data));
  }, [id_profissional, dataEscolhida]);

  const avancarParaServicos = async () => {
    if (!podeContinuar) return;
    try { const data = await (await fetch(`${API_URL}/public/historico/${id_profissional}/${whatsapp}`)).json(); setUltimoServico(data.ultimoServico || null); } catch (e) {}
    setEtapa(2);
  };

  const toggleServico = (servico) => {
    const jaEscolhido = servicosEscolhidos.find(s => s.id === servico.id);
    if (jaEscolhido) setServicosEscolhidos(servicosEscolhidos.filter(s => s.id !== servico.id));
    else setServicosEscolhidos([...servicosEscolhidos, servico]);
  };

  const valorTotal = servicosEscolhidos.reduce((acc, curr) => acc + parseFloat(curr.preco), 0);
  const nomesServicosCombinados = servicosEscolhidos.map(s => s.nome).join(' + ');

  // 🌟 LÓGICA INTELIGENTE DE TEMPO
  const calcularBlocosDeHorario = (horarioInicial) => {
    let minutosTotais = 0;
    servicosEscolhidos.forEach(s => {
      let t = s.tempo.toLowerCase().replace(/\s/g, '');
      let min = 0;
      if (t.includes('h')) {
        let p = t.split('h'); min += parseInt(p[0]) * 60;
        if (p[1] && p[1].includes('min')) min += parseInt(p[1].replace('min', ''));
      } else if (t.includes('min')) { min += parseInt(t.replace('min', '')); }
      minutosTotais += min || 60; // Se errar, cobra 1h
    });

    let blocosNecessarios = Math.ceil(minutosTotais / 60); // Se deu 2h30, vai usar 3 blocos (Ex: 8h, 9h, 10h)
    let index = horariosDoProfissional.indexOf(horarioInicial);
    let horariosParaBloquear = [];
    for(let i = 0; i < blocosNecessarios; i++) {
       if(horariosDoProfissional[index + i]) horariosParaBloquear.push(horariosDoProfissional[index + i]);
    }
    return horariosParaBloquear.join(','); // Manda "08:00,09:00,10:00" pro banco
  };

  const finalizarAgendamento = async () => {
    try {
      const horariosReais = calcularBlocosDeHorario(horarioEscolhido);
      await fetch(`${API_URL}/public/agendamentos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_profissional, nome, whatsapp, nascimento, servico_nome: nomesServicosCombinados, data_reserva: dataEscolhida, horario: horariosReais, valor: valorTotal })
      });
      const num = dadosProfissional?.telefone?.replace(/\D/g, '') || '';
      window.open(`https://wa.me/55${num}?text=${encodeURIComponent(`✨ *Nova Reserva VIP* ✨\n\n*Cliente:* ${nome}\n*Contato:* ${whatsapp}\n*Serviços:* ${nomesServicosCombinados}\n*Data:* ${dataEscolhida}\n*Início:* ${horarioEscolhido}\n*Total:* R$ ${valorTotal.toFixed(2).replace('.', ',')}`)}`, '_blank');
    } catch (error) { alert("Houve um erro."); }
  };

  const podeContinuar = nome.trim() !== '' && whatsapp.trim().length >= 10;

  return (
    <div className="min-h-screen bg-[#080808] flex justify-center text-white font-['Inter']">
      <div className="w-full max-w-md bg-[#0D0D0D] min-h-screen relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <header className="p-6 text-center border-b border-[#2A2A2A] bg-[#0D0D0D]/90 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => etapa > 1 ? setEtapa(etapa - 1) : window.history.back()} className="absolute left-6 top-7 text-[#A8A8A8] hover:text-[#D4AF37] flex items-center gap-2 text-sm"><ArrowLeft size={16} /> {etapa > 1 ? 'Voltar' : 'Sair'}</button>
          <h1 className="text-2xl font-['Playfair_Display'] tracking-widest text-[#D4AF37] uppercase">{dadosProfissional?.nome || 'AURUM'}</h1>
        </header>

        <main className="flex-1 p-6 w-full flex flex-col justify-start animate-fade-in pb-36 relative">
          {etapa === 1 && (
            <div className="space-y-10 animate-slide-up mt-8">
              <div className="text-center space-y-3"><h2 className="text-4xl font-normal font-['Playfair_Display'] text-white">Bem-vindo(a).</h2></div>
              <div className="space-y-6">
                <input type="text" placeholder="Nome completo" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 text-white rounded-xl focus:border-[#D4AF37] outline-none" value={nome} onChange={(e) => setNome(e.target.value)}/>
                <input type="tel" placeholder="Seu WhatsApp (com DDD)" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 text-white rounded-xl focus:border-[#D4AF37] outline-none" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}/>
              </div>
              <button onClick={avancarParaServicos} className={`w-full p-5 flex items-center justify-between rounded-xl mt-8 ${podeContinuar ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#6F6F6F]'}`}><span>Continuar</span> <ChevronRight size={20} /></button>
            </div>
          )}

          {etapa === 2 && (
            <div className="space-y-6 animate-slide-up h-full">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-center">Quais serviços deseja?</h2>
              <div className="space-y-4">
                {servicos.map((servico) => {
                  const isSelecionado = servicosEscolhidos.some(s => s.id === servico.id);
                  return (
                    <button key={servico.id} onClick={() => toggleServico(servico)} className={`w-full text-left p-6 rounded-xl flex justify-between items-center border-2 ${isSelecionado ? 'bg-[#1A1A1A] border-[#D4AF37]' : 'bg-[#1A1A1A] border-[#2A2A2A]'}`}>
                      <div><h3 className={`text-lg font-light ${isSelecionado ? 'text-[#D4AF37]' : 'text-white'}`}>{servico.nome}</h3><p className="text-sm text-[#A8A8A8] mt-2 flex items-center gap-2"><Clock size={14} /> {servico.tempo}</p></div>
                      <div className="flex items-center gap-4"><span className="text-xl">R$ {parseFloat(servico.preco).toFixed(2).replace('.', ',')}</span>{isSelecionado && <CheckCircle2 size={20} className="text-[#D4AF37]" />}</div>
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-32 opacity-0"></div>
              <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 bg-linear-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent z-20">
                <button onClick={() => setEtapa(3)} disabled={servicosEscolhidos.length === 0} className={`w-full max-w-md p-5 flex items-center justify-between rounded-xl ${servicosEscolhidos.length > 0 ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#6F6F6F]'}`}><div className="flex flex-col text-left"><span className="text-[10px] uppercase font-bold">Total</span><span className="text-xl">R$ {valorTotal.toFixed(2).replace('.', ',')}</span></div><div><span className="font-medium uppercase text-sm">Agendar</span></div></button>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="space-y-6 animate-slide-up h-full">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-center">Escolha data e horário</h2>
              <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] mb-8">
                 <div className="flex overflow-x-auto gap-3 pb-6 mb-6 border-b border-[#2A2A2A] no-scrollbar">
                   {diasDisponiveis.map((dia) => (
                     <button key={dia.valor} onClick={() => { setDataEscolhida(dia.valor); setHorarioEscolhido(''); }} className={`shrink-0 px-4 py-2 rounded-lg border ${dataEscolhida === dia.valor ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D]' : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A8A8A8]'}`}>{dia.label}</button>
                   ))}
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   {horariosDoProfissional.length > 0 ? horariosDoProfissional.map((hora) => {
                     const isOcupado = horariosOcupados.includes(hora);
                     if (isOcupado) return <button key={hora} disabled className="py-3 rounded-xl border bg-[#0D0D0D] border-[#1A1A1A] text-[#4A4A4A] line-through">{hora}</button>;
                     return <button key={hora} onClick={() => setHorarioEscolhido(hora)} className={`py-3 rounded-xl border ${horarioEscolhido === hora ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D]' : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A8A8A8]'}`}>{hora}</button>;
                   }) : <p className="text-xs text-[#6F6F6F] col-span-3 text-center">O salão não configurou os horários.</p>}
                 </div>
              </div>
              <div className="w-full h-32 opacity-0"></div>
              <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 bg-linear-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent z-20">
                <button onClick={finalizarAgendamento} disabled={!horarioEscolhido} className={`w-full max-w-md p-5 flex items-center justify-center gap-3 rounded-xl ${horarioEscolhido ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#6F6F6F]'}`}><CheckCircle2 size={20} /> <span className="uppercase text-sm">Confirmar Reserva</span></button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}