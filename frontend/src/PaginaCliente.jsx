/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, ChevronRight, ArrowLeft, Scissors, Loader2, Star } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

export default function PaginaCliente() {
  const { id_profissional } = useParams();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Dados do Salão
  const [salao, setSalao] = useState({ nome: '', logo_url: '', horarios_trabalho: [] });
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  
  // Fluxo de Agendamento
  const [passo, setPasso] = useState(1);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);

  // Dados do Cliente
  const [cliente, setCliente] = useState({ nome: '', whatsapp: '', nascimento: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarDadosSalao();
  }, [id_profissional]);

  const carregarDadosSalao = async () => {
    try {
      const [resProf, resServ, resFunc] = await Promise.all([
        fetch(`${API_URL}/public/profissional/${id_profissional}`),
        fetch(`${API_URL}/public/servicos/${id_profissional}`),
        fetch(`${API_URL}/public/funcionarios/${id_profissional}`)
      ]);

      if (!resProf.ok) throw new Error('Salão não encontrado.');

      const dataProf = await resProf.json();
      const dataServ = await resServ.json();
      const dataFunc = await resFunc.json();

      setSalao({
        nome: dataProf.nome || 'Salão Parceiro',
        logo_url: dataProf.logo_url || null,
        horarios_trabalho: dataProf.horarios_trabalho ? dataProf.horarios_trabalho.split(',') : []
      });
      setServicos(dataServ);
      setFuncionarios(dataFunc);

      // Define a data de hoje como padrão para o calendário
      const hoje = new Date().toISOString().split('T')[0];
      setDataSelecionada(hoje);

    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar as informações deste salão. Verifique o link.');
    } finally {
      setCarregando(false);
    }
  };

  const buscarHorarios = async (data, funcId) => {
    if (!data) return;
    setCarregandoHorarios(true);
    setHorarioSelecionado('');
    try {
      let url = `${API_URL}/public/horarios-ocupados/${id_profissional}?data=${data}`;
      if (funcId) url += `&funcionario_id=${funcId}`;
      
      const res = await fetch(url);
      const ocupados = await res.json();
      
      // Filtra os horários do salão tirando os que já estão ocupados
      const disponiveis = salao.horarios_trabalho.filter(h => !ocupados.includes(h));
      setHorariosDisponiveis(disponiveis);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoHorarios(false);
    }
  };

  // Quando escolhe um profissional ou muda a data, recalcula os horários
  useEffect(() => {
    if (passo === 3 && dataSelecionada) {
      buscarHorarios(dataSelecionada, funcionarioSelecionado?.id);
    }
  }, [passo, dataSelecionada, funcionarioSelecionado]);

  // Busca o último serviço quando o cliente digita o WhatsApp
  useEffect(() => {
    const formatarEBuscar = async () => {
      const whatsLimpo = cliente.whatsapp.replace(/\D/g, '');
      if (whatsLimpo.length >= 10 && passo === 4) {
        try {
          const res = await fetch(`${API_URL}/public/historico/${id_profissional}/${cliente.whatsapp}`);
          const data = await res.json();
          if (data.ultimoServico) {
            console.log("Último serviço:", data.ultimoServico);
          }
        } catch (e) {
          console.error(e);
        } 
      }
    };
    const timer = setTimeout(formatarEBuscar, 1000);
    return () => clearTimeout(timer);
  }, [cliente.whatsapp, passo, id_profissional]);

  const formatarDataBR = (dataIso) => {
    const partes = dataIso.split('-');
    if (partes.length !== 3) return dataIso;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // 🧠 INTELIGÊNCIA DE AGENDA: Bloqueia horários baseado no tempo do serviço
  const finalizarAgendamento = async (e) => {
    e.preventDefault();
    if (!cliente.nome || cliente.whatsapp.length < 10) {
      alert("Por favor, preencha seu nome e um WhatsApp válido.");
      return;
    }

    setEnviando(true);
    
    // Calcula quantos slots de tempo precisam ser bloqueados
    const tempoServico = servicoSelecionado.tempo.toLowerCase();
    let slotsNecessarios = 1; // Padrão 1 slot (ex: 1 hora ou 30 min se for o intervalo do salão)
    if (tempoServico.includes('2h') || tempoServico.includes('2 h') || tempoServico.includes('120')) slotsNecessarios = 2;
    if (tempoServico.includes('3h') || tempoServico.includes('3 h') || tempoServico.includes('180')) slotsNecessarios = 3;

    // Acha o horário que o cliente clicou na grade do salão
    const indexHorario = salao.horarios_trabalho.indexOf(horarioSelecionado);
    let horariosParaBloquear = [horarioSelecionado];
    
    // Se precisar de mais slots, puxa os próximos horários da grade do salão
    for (let i = 1; i < slotsNecessarios; i++) {
       if (salao.horarios_trabalho[indexHorario + i]) {
           horariosParaBloquear.push(salao.horarios_trabalho[indexHorario + i]);
       }
    }
    
    // Junta tudo (ex: "14:00,15:00") para enviar pro banco
    const horarioPayload = horariosParaBloquear.join(',');

    const payload = {
      id_profissional,
      nome: cliente.nome,
      whatsapp: cliente.whatsapp,
      nascimento: cliente.nascimento,
      servico_nome: servicoSelecionado.nome,
      data_reserva: formatarDataBR(dataSelecionada),
      horario: horarioPayload, // Enviando os blocos travados!
      valor: servicoSelecionado.preco,
      funcionario_id: funcionarioSelecionado ? funcionarioSelecionado.id : null,
      funcionario_nome: funcionarioSelecionado ? funcionarioSelecionado.nome : null
    };

    try {
      const res = await fetch(`${API_URL}/public/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Erro ao agendar');
      
      setSucesso(true);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao tentar agendar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center text-[#D4AF37]">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-['Playfair_Display'] text-xl tracking-widest animate-pulse">Preparando Experiência...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center p-6 text-center">
        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-red-900/30">
          <p className="text-red-400 font-['Inter']">{erro}</p>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/20">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h1 className="text-3xl font-['Playfair_Display'] text-white mb-2">Reserva Confirmada!</h1>
        <p className="text-[#A8A8A8] text-sm max-w-sm mb-8 font-light leading-relaxed">
          Sua experiência no <strong className="text-white">{salao.nome}</strong> foi agendada com sucesso.
        </p>
        <button onClick={() => window.location.reload()} className="text-[#D4AF37] border border-[#D4AF37] px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-colors">
          Fazer novo agendamento
        </button>
      </div>
    );
  }

  // Renderização dos Passos
  return (
    <div className="min-h-screen bg-[#0D0D0D] font-['Inter'] text-white flex justify-center p-4 md:p-8 selection:bg-[#D4AF37] selection:text-black">
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-[2.5rem] border border-[#2A2A2A] shadow-2xl overflow-hidden relative flex flex-col h-[85vh] md:h-auto md:min-h-175">
        
        {/* CABEÇALHO DO SALÃO */}
        <div className="p-6 pb-4 flex flex-col items-center border-b border-[#2A2A2A] bg-linear-to-b from-[#0D0D0D] to-[#1A1A1A]">
           {salao.logo_url ? (
             <img src={salao.logo_url} alt={salao.nome} className="w-20 h-20 rounded-2xl object-cover mb-4 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]" />
           ) : (
             <div className="w-20 h-20 rounded-2xl bg-[#0D0D0D] border border-[#D4AF37]/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
               <Star size={32} className="text-[#D4AF37]" />
             </div>
           )}
           <h1 className="text-2xl font-bold font-['Playfair_Display'] text-center tracking-wide text-white">{salao.nome}</h1>
           <p className="text-[10px] text-[#D4AF37] tracking-widest uppercase mt-1">Agendamento VIP</p>
        </div>

        {/* BARRA DE PROGRESSO */}
        <div className="flex h-1 bg-[#0D0D0D]">
          <div className="h-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] transition-all duration-500" style={{ width: `${(passo / 4) * 100}%` }}></div>
        </div>

        {/* CONTEÚDO ROLÁVEL */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          
          {passo > 1 && (
            <button onClick={() => setPasso(passo - 1)} className="text-[#A8A8A8] flex items-center gap-2 text-xs hover:text-[#D4AF37] transition-colors mb-6">
              <ArrowLeft size={16} /> Voltar
            </button>
          )}

          {/* PASSO 1: ESCOLHER SERVIÇO */}
          {passo === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-6">Escolha sua Experiência</h2>
              {servicos.length === 0 ? (
                <p className="text-[#6F6F6F] text-sm text-center py-10 border border-dashed border-[#2A2A2A] rounded-2xl">Nenhuma experiência cadastrada no momento.</p>
              ) : (
                <div className="space-y-3">
                  {servicos.map(serv => (
                    <button 
                      key={serv.id} 
                      onClick={() => setServicoSelecionado(serv)}
                      className={`w-full p-5 rounded-2xl border text-left transition-all flex justify-between items-center group ${servicoSelecionado?.id === serv.id ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                    >
                      <div>
                        <p className={`font-medium text-lg ${servicoSelecionado?.id === serv.id ? 'text-[#D4AF37]' : 'text-white'}`}>{serv.nome}</p>
                        <p className="text-[#6F6F6F] text-xs mt-1 flex items-center gap-1"><Clock size={12}/> {serv.tempo}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <span className={`font-['Playfair_Display'] text-lg ${servicoSelecionado?.id === serv.id ? 'text-white' : 'text-[#D4AF37]'}`}>R$ {parseFloat(serv.preco).toFixed(2).replace('.', ',')}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${servicoSelecionado?.id === serv.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                          {servicoSelecionado?.id === serv.id && <CheckCircle2 size={12} className="text-[#0D0D0D]" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASSO 2: ESCOLHER PROFISSIONAL */}
          {passo === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-6">Escolha o Profissional</h2>
              <div className="space-y-3">
                {/* Opção Qualquer Profissional */}
                <button 
                  onClick={() => setFuncionarioSelecionado(null)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${!funcionarioSelecionado ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] border ${!funcionarioSelecionado ? 'border-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                    <Star size={20} className={!funcionarioSelecionado ? 'text-[#D4AF37]' : 'text-[#6F6F6F]'} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${!funcionarioSelecionado ? 'text-[#D4AF37]' : 'text-white'}`}>Sem preferência</p>
                    <p className="text-[#6F6F6F] text-xs">O primeiro disponível atenderá você</p>
                  </div>
                </button>

                {funcionarios.map(func => (
                  <button 
                    key={func.id} 
                    onClick={() => setFuncionarioSelecionado(func)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${funcionarioSelecionado?.id === func.id ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] border ${funcionarioSelecionado?.id === func.id ? 'border-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                      <Scissors size={20} className={funcionarioSelecionado?.id === func.id ? 'text-[#D4AF37]' : 'text-[#6F6F6F]'} />
                    </div>
                    <p className={`font-medium text-lg flex-1 ${funcionarioSelecionado?.id === func.id ? 'text-[#D4AF37]' : 'text-white'}`}>{func.nome}</p>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${funcionarioSelecionado?.id === func.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                      {funcionarioSelecionado?.id === func.id && <CheckCircle2 size={12} className="text-[#0D0D0D]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 3: DATA E HORA */}
          {passo === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-6">Data e Horário</h2>
              
              <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 mb-6">
                <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-2 block">Selecione o Dia</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={dataSelecionada} 
                  onChange={(e) => setDataSelecionada(e.target.value)} 
                  className="w-full bg-transparent text-white outline-none focus:text-[#D4AF37] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] cursor-pointer text-lg font-light"
                />
              </div>

              <div className="mb-4">
                <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-3 block">Horários Disponíveis</label>
                {carregandoHorarios ? (
                   <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#D4AF37]" size={24} /></div>
                ) : horariosDisponiveis.length === 0 ? (
                   <p className="text-[#6F6F6F] text-sm text-center py-6 border border-dashed border-[#2A2A2A] rounded-xl">Nenhum horário livre para esta data.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {horariosDisponiveis.map(hora => (
                      <button 
                        key={hora} 
                        onClick={() => setHorarioSelecionado(hora)}
                        className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${horarioSelecionado === hora ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] scale-105 shadow-lg' : 'bg-[#0D0D0D] text-[#A8A8A8] border-[#2A2A2A] hover:border-[#D4AF37]/50 hover:text-white'}`}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASSO 4: DADOS DO CLIENTE */}
          {passo === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-6">Confirme sua Reserva</h2>
              
              <div className="bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-2xl p-5 mb-8 flex flex-col gap-2 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A8A8A8] text-xs">Experiência</span>
                  <span className="text-white font-medium">{servicoSelecionado.nome}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A8A8A8] text-xs">Profissional</span>
                  <span className="text-white font-medium">{funcionarioSelecionado ? funcionarioSelecionado.nome : 'Sem preferência'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A8A8A8] text-xs">Data e Hora</span>
                  <span className="text-[#D4AF37] font-medium">{formatarDataBR(dataSelecionada)} - {horarioSelecionado}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#A8A8A8] text-xs">Valor</span>
                  <span className="text-[#D4AF37] font-['Playfair_Display'] text-xl">R$ {parseFloat(servicoSelecionado.preco).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <form onSubmit={finalizarAgendamento} className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-2 block">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6F6F6F]" size={18} />
                    <input type="text" required placeholder="Ex: João Silva" value={cliente.nome} onChange={e => setCliente({...cliente, nome: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] py-4 pl-12 pr-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-2 block">Seu WhatsApp</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] text-sm">+55</span>
                    <input type="tel" required placeholder="(11) 99999-9999" value={cliente.whatsapp} onChange={e => setCliente({...cliente, whatsapp: e.target.value})} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] py-4 pl-14 pr-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={enviando} className={`w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-5 rounded-xl font-bold tracking-widest uppercase text-sm mt-4 flex justify-center items-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.3)] ${enviando ? 'opacity-70' : 'hover:scale-[1.02] transition-transform'}`}>
                  {enviando ? <><Loader2 className="animate-spin" size={18} /> Processando...</> : 'Finalizar Agendamento'}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* RODAPÉ E BOTÃO DE AVANÇAR */}
        {passo < 4 && (
          <div className="p-6 border-t border-[#2A2A2A] bg-[#0D0D0D]">
            <button 
              onClick={() => setPasso(passo + 1)}
              disabled={(passo === 1 && !servicoSelecionado) || (passo === 3 && !horarioSelecionado)}
              className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase text-xs flex justify-center items-center gap-2 transition-all ${((passo === 1 && !servicoSelecionado) || (passo === 3 && !horarioSelecionado)) ? 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A] cursor-not-allowed' : 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02]'}`}
            >
              Continuar <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}