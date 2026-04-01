import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, Clock, CheckCircle2, ArrowLeft, Star, User } from 'lucide-react';

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
  
  // 🌟 CONTROLE DE ETAPAS INTELIGENTE
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
  
  const [horariosDoProfissional, setHorariosDoProfissional] = useState([]);

  // 🌟 ESTADOS DA EQUIPE
  const [equipe, setEquipe] = useState([]);
  const [funcionarioEscolhido, setFuncionarioEscolhido] = useState(null); // Pode ser {id, nome} ou "padrao"

  useEffect(() => {
    if (!id_profissional) return;
    fetch(`${API_URL}/public/profissional/${id_profissional}`)
      .then(res => res.json())
      .then(data => {
        setDadosProfissional(data);
        if(data.horarios_trabalho) setHorariosDoProfissional(data.horarios_trabalho.split(','));
      })
      .catch(err => console.error("Erro prof:", err));

    fetch(`${API_URL}/public/servicos/${id_profissional}`)
      .then(res => res.json())
      .then(data => setServicos(data))
      .catch(err => console.error("Erro serv:", err));

    // 🌟 PUXA A EQUIPE CADASTRADA PELO DONO DO SALÃO
    fetch(`${API_URL}/public/funcionarios/${id_profissional}`)
      .then(res => res.json())
      .then(data => setEquipe(data || []))
      .catch(err => console.error("Erro equipe:", err));
  }, [id_profissional]);

  useEffect(() => {
    if (!id_profissional || !dataEscolhida) return;
    
    // 🌟 FILTRA OS HORÁRIOS OCUPADOS BASEADO NO FUNCIONÁRIO ESCOLHIDO
    let url = `${API_URL}/public/horarios-ocupados/${id_profissional}?data=${encodeURIComponent(dataEscolhida)}`;
    if (funcionarioEscolhido && funcionarioEscolhido.id) {
      url += `&funcionario_id=${funcionarioEscolhido.id}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setHorariosOcupados(data))
      .catch(err => console.error("Erro ocupados:", err));
  }, [id_profissional, dataEscolhida, funcionarioEscolhido]);

  const avancarEtapa = async () => {
    if (etapa === 1) {
      if (!podeContinuar) return;
      try { 
          const res = await fetch(`${API_URL}/public/historico/${id_profissional}/${whatsapp}`);
          const data = await res.json();
          setUltimoServico(data.ultimoServico || null); 
      } catch (erroHistorico) { console.error("Sem histórico anterior:", erroHistorico); }
      
      // Se tiver equipe, vai para a tela de escolha de barbeiro. Se não, pula para serviços.
      setEtapa(equipe.length > 0 ? 2 : 3);
    } else if (etapa === 2) {
      setEtapa(3);
    } else if (etapa === 3) {
      setEtapa(4);
    }
  };

  const voltarEtapa = () => {
    if (etapa === 4) setEtapa(3);
    else if (etapa === 3) setEtapa(equipe.length > 0 ? 2 : 1);
    else if (etapa === 2) setEtapa(1);
    else window.history.back();
  };

  const toggleServico = (servico) => {
    const jaEscolhido = servicosEscolhidos.find(s => s.id === servico.id);
    if (jaEscolhido) setServicosEscolhidos(servicosEscolhidos.filter(s => s.id !== servico.id));
    else setServicosEscolhidos([...servicosEscolhidos, servico]);
  };

  const valorTotal = servicosEscolhidos.reduce((acc, curr) => acc + parseFloat(curr.preco), 0);
  const nomesServicosCombinados = servicosEscolhidos.map(s => s.nome).join(' + ');

  const calcularBlocosDeHorario = (horarioInicial) => {
    let minutosTotais = 0;
    servicosEscolhidos.forEach(s => {
      let t = s.tempo.toLowerCase().replace(/\s/g, '');
      let min = 0;
      if (t.includes('h')) {
        let p = t.split('h'); min += parseInt(p[0]) * 60;
        if (p[1] && p[1].includes('min')) min += parseInt(p[1].replace('min', ''));
      } else if (t.includes('min')) { min += parseInt(t.replace('min', '')); }
      minutosTotais += min || 60; 
    });

    let blocosNecessarios = Math.ceil(minutosTotais / 60); 
    let index = horariosDoProfissional.indexOf(horarioInicial);
    let horariosParaBloquear = [];
    for(let i = 0; i < blocosNecessarios; i++) {
       if(horariosDoProfissional[index + i]) horariosParaBloquear.push(horariosDoProfissional[index + i]);
    }
    return horariosParaBloquear.join(','); 
  };

  const finalizarAgendamento = async () => {
    try {
      const horariosReais = calcularBlocosDeHorario(horarioEscolhido);
      
      const payload = {
        id_profissional, nome, whatsapp, nascimento, 
        servico_nome: nomesServicosCombinados, 
        data_reserva: dataEscolhida, 
        horario: horariosReais, 
        valor: valorTotal,
        funcionario_id: funcionarioEscolhido?.id || null,
        funcionario_nome: funcionarioEscolhido?.nome || null
      };

      await fetch(`${API_URL}/public/agendamentos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const num = dadosProfissional?.telefone?.replace(/\D/g, '') || '';
      const profTexto = funcionarioEscolhido?.nome ? `\n*Especialista:* ${funcionarioEscolhido.nome}` : '';
      
      window.open(`https://wa.me/55${num}?text=${encodeURIComponent(`✨ *Nova Reserva VIP* ✨\n\n*Cliente:* ${nome}\n*Contato:* ${whatsapp}${profTexto}\n*Serviços:* ${nomesServicosCombinados}\n*Data:* ${dataEscolhida}\n*Início:* ${horarioEscolhido}\n*Total:* R$ ${valorTotal.toFixed(2).replace('.', ',')}`)}`, '_blank');
    } catch (erroAgendar) { 
        console.error("Erro na reserva:", erroAgendar);
        alert("Houve um erro ao tentar agendar. Tente novamente."); 
    }
  };

  const podeContinuar = nome.trim() !== '' && whatsapp.trim().length >= 10;

  return (
    <div className="min-h-screen bg-[#080808] flex justify-center text-white font-['Inter']">
      <div className="w-full max-w-md bg-[#0D0D0D] min-h-screen relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <header className="p-6 text-center border-b border-[#2A2A2A] bg-[#0D0D0D]/90 backdrop-blur-md sticky top-0 z-10">
          <button onClick={voltarEtapa} className="absolute left-6 top-7 text-[#A8A8A8] hover:text-[#D4AF37] flex items-center gap-2 text-sm transition-colors"><ArrowLeft size={16} /> {etapa > 1 ? 'Voltar' : 'Sair'}</button>
          <h1 className="text-2xl font-['Playfair_Display'] tracking-widest text-[#D4AF37] uppercase">{dadosProfissional?.nome || 'AURUM'}</h1>
        </header>

        <main className="flex-1 p-6 w-full flex flex-col justify-start animate-fade-in pb-36 relative">
          
          {/* ETAPA 1: DADOS DO CLIENTE */}
          {etapa === 1 && (
            <div className="space-y-10 animate-slide-up mt-8">
              <div className="text-center space-y-3"><h2 className="text-4xl font-normal font-['Playfair_Display'] text-white">Bem-vindo(a).</h2></div>
              
              <div className="space-y-4">
                <input type="text" placeholder="Nome completo" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 text-white rounded-2xl focus:border-[#D4AF37] outline-none transition-colors" value={nome} onChange={(e) => setNome(e.target.value)}/>
                <input type="tel" placeholder="Seu WhatsApp (com DDD)" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 text-white rounded-2xl focus:border-[#D4AF37] outline-none transition-colors" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}/>
                <input type="text" placeholder="Nascimento (Opcional - Ex: 15/05)" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 text-white rounded-2xl focus:border-[#D4AF37] outline-none transition-colors" value={nascimento} onChange={(e) => setNascimento(e.target.value)}/>
              </div>

              <button onClick={avancarEtapa} className={`w-full p-5 flex items-center justify-between rounded-2xl mt-8 transition-all ${podeContinuar ? 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:scale-[1.02]' : 'bg-[#1A1A1A] text-[#6F6F6F] cursor-not-allowed border border-[#2A2A2A]'}`}>
                <span className="font-bold tracking-widest uppercase text-sm">Continuar</span> <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* ETAPA 2: ESCOLHA DA EQUIPE (SÓ APARECE SE O SALÃO TIVER FUNCIONÁRIOS) */}
          {etapa === 2 && (
            <div className="space-y-6 animate-slide-up h-full">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-center">Quem vai te atender?</h2>
              <div className="space-y-4 mt-8">
                
                {/* OPÇÃO: QUALQUER PROFISSIONAL */}
                <button onClick={() => setFuncionarioEscolhido({ id: null, nome: 'Sem Preferência' })} className={`w-full text-left p-6 rounded-2xl flex items-center gap-4 border-2 transition-all ${funcionarioEscolhido?.nome === 'Sem Preferência' ? 'bg-[#1A1A1A] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#6F6F6F]'}`}>
                   <div className={`p-3 rounded-full ${funcionarioEscolhido?.nome === 'Sem Preferência' ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#0D0D0D] text-[#A8A8A8] border border-[#2A2A2A]'}`}><User size={24} /></div>
                   <div><h3 className={`text-lg font-medium ${funcionarioEscolhido?.nome === 'Sem Preferência' ? 'text-[#D4AF37]' : 'text-white'}`}>Sem preferência</h3><p className="text-sm text-[#A8A8A8] mt-1 font-light">Primeiro horário disponível</p></div>
                   {funcionarioEscolhido?.nome === 'Sem Preferência' && <CheckCircle2 size={24} className="text-[#D4AF37] ml-auto" />}
                </button>

                {/* LISTA DA EQUIPE */}
                {equipe.map((func) => {
                  const isSelecionado = funcionarioEscolhido?.id === func.id;
                  return (
                    <button key={func.id} onClick={() => setFuncionarioEscolhido(func)} className={`w-full text-left p-6 rounded-2xl flex items-center gap-4 border-2 transition-all ${isSelecionado ? 'bg-[#1A1A1A] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#6F6F6F]'}`}>
                      <div className={`p-3 rounded-full ${isSelecionado ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#0D0D0D] text-[#A8A8A8] border border-[#2A2A2A]'}`}><User size={24} /></div>
                      <div><h3 className={`text-lg font-medium ${isSelecionado ? 'text-[#D4AF37]' : 'text-white'}`}>{func.nome}</h3><p className="text-sm text-[#A8A8A8] mt-1 font-light">Especialista Premium</p></div>
                      {isSelecionado && <CheckCircle2 size={24} className="text-[#D4AF37] ml-auto" />}
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-32 opacity-0"></div>
              <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 bg-linear-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent z-20">
                <button onClick={avancarEtapa} disabled={!funcionarioEscolhido} className={`w-full max-w-md p-5 flex items-center justify-center gap-2 rounded-2xl transition-all ${funcionarioEscolhido ? 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:scale-[1.02]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A]'}`}>
                  <span className="font-bold uppercase tracking-widest text-sm">Avançar</span> <ChevronRight size={20}/>
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: SERVIÇOS */}
          {etapa === 3 && (
            <div className="space-y-6 animate-slide-up h-full">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-center">Quais serviços deseja?</h2>
              <div className="space-y-4">
                {servicos.map((servico) => {
                  const isUltimo = ultimoServico && ultimoServico.includes(servico.nome);
                  const isSelecionado = servicosEscolhidos.some(s => s.id === servico.id);
                  return (
                    <button key={servico.id} onClick={() => toggleServico(servico)} className={`w-full text-left p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden border-2 transition-all ${isSelecionado ? 'bg-[#1A1A1A] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#6F6F6F]'}`}>
                      {isUltimo && !isSelecionado && (<div className="absolute top-0 left-0 w-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold text-center py-1.5 flex justify-center items-center gap-1"><Star size={10} className="fill-[#D4AF37]"/> Seu último pedido</div>)}
                      <div className={`flex justify-between items-center w-full ${isUltimo && !isSelecionado ? 'mt-5' : ''}`}>
                        <div><h3 className={`text-lg font-medium ${isSelecionado ? 'text-[#D4AF37]' : 'text-white'}`}>{servico.nome}</h3><p className="text-sm text-[#A8A8A8] mt-2 flex items-center gap-2"><Clock size={14} /> {servico.tempo}</p></div>
                        <div className="flex items-center gap-4"><span className="text-xl font-['Playfair_Display']">R$ {parseFloat(servico.preco).toFixed(2).replace('.', ',')}</span>{isSelecionado && <CheckCircle2 size={24} className="text-[#D4AF37]" />}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-32 opacity-0"></div>
              <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 bg-linear-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent z-20">
                <button onClick={avancarEtapa} disabled={servicosEscolhidos.length === 0} className={`w-full max-w-md p-5 flex items-center justify-between rounded-2xl transition-all ${servicosEscolhidos.length > 0 ? 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:scale-[1.02]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A]'}`}><div className="flex flex-col text-left"><span className="text-[10px] uppercase font-bold tracking-widest">Total</span><span className="text-xl font-['Playfair_Display'] font-bold">R$ {valorTotal.toFixed(2).replace('.', ',')}</span></div><div><span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">Agendar <ChevronRight size={18}/></span></div></button>
              </div>
            </div>
          )}

          {/* ETAPA 4: DATA E HORA */}
          {etapa === 4 && (
            <div className="space-y-6 animate-slide-up h-full">
              <h2 className="text-3xl font-normal font-['Playfair_Display'] text-center">Data e horário</h2>
              
              {/* MOSTRA QUEM O CLIENTE ESCOLHEU */}
              {funcionarioEscolhido && funcionarioEscolhido.nome !== 'Sem Preferência' && (
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-2xl p-4 flex items-center gap-3 text-sm text-[#D4AF37]">
                  <User size={18} /> Mostrando horários disponíveis para: <strong>{funcionarioEscolhido.nome}</strong>
                </div>
              )}

              <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#2A2A2A] mb-8 shadow-lg">
                 <div className="flex overflow-x-auto gap-3 pb-6 mb-6 border-b border-[#2A2A2A] no-scrollbar">
                   {diasDisponiveis.map((dia) => (
                     <button key={dia.valor} onClick={() => { setDataEscolhida(dia.valor); setHorarioEscolhido(''); }} className={`shrink-0 px-5 py-2.5 rounded-xl border transition-colors font-medium text-sm ${dataEscolhida === dia.valor ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A8A8A8] hover:border-[#6F6F6F]'}`}>{dia.label}</button>
                   ))}
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   {horariosDoProfissional.length > 0 ? horariosDoProfissional.map((hora) => {
                     const isOcupado = horariosOcupados.includes(hora);
                     if (isOcupado) return <button key={hora} disabled className="py-3.5 rounded-xl border bg-[#0D0D0D] border-[#1A1A1A] text-[#4A4A4A] line-through font-medium">{hora}</button>;
                     return <button key={hora} onClick={() => setHorarioEscolhido(hora)} className={`py-3.5 rounded-xl border transition-all font-medium ${horarioEscolhido === hora ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-105' : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A8A8A8] hover:border-[#6F6F6F]'}`}>{hora}</button>;
                   }) : <p className="text-xs text-[#6F6F6F] col-span-3 text-center">O salão não configurou os horários.</p>}
                 </div>
              </div>
              <div className="w-full h-32 opacity-0"></div>
              <div className="fixed bottom-0 left-0 w-full flex justify-center p-6 bg-linear-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent z-20">
                <button onClick={finalizarAgendamento} disabled={!horarioEscolhido} className={`w-full max-w-md p-5 flex items-center justify-center gap-3 rounded-2xl transition-all ${horarioEscolhido ? 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:scale-[1.02]' : 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A]'}`}><CheckCircle2 size={22} /> <span className="uppercase text-sm font-bold tracking-widest">Confirmar Reserva</span></button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}