/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User, CheckCircle2, ChevronRight, ArrowLeft, Scissors, Loader2, Star } from 'lucide-react';

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
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [escolhaSemPreferencia, setEscolhaSemPreferencia] = useState(false);
  const [profissionaisDisponiveisHorario, setProfissionaisDisponiveisHorario] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [carregandoProfissionais, setCarregandoProfissionais] = useState(false);

  // Dados do Cliente
  const [cliente, setCliente] = useState({ nome: '', whatsapp: '', nascimento: '' });
  const [enviando, setEnviando] = useState(false);

  const valorTotal = servicosSelecionados.reduce((total, servico) => total + Number(servico.preco || 0), 0);

  const converterTempoParaMinutos = (tempoServico) => {
    const texto = String(tempoServico || '').toLowerCase().trim();

    const horas = texto.match(/(\d+)\s*h/);
    const minutos = texto.match(/(\d+)\s*(min|m)/);

    if (horas || minutos) {
      const totalHoras = horas ? parseInt(horas[1], 10) * 60 : 0;
      const totalMinutos = minutos ? parseInt(minutos[1], 10) : 0;
      return totalHoras + totalMinutos;
    }

    const numero = parseInt(texto.replace(/\D/g, ''), 10);
    return Number.isNaN(numero) ? 0 : numero;
  };

  const formatarDuracao = (minutos) => {
    if (!minutos) return 'Não informado';
    if (minutos < 60) return `${minutos} min`;

    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  const somarMinutosNaHora = (hora, minutos) => {
    if (!hora) return '';

    const [h, m] = hora.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return '';

    const total = h * 60 + m + (minutos || 0);
    const horaFinal = Math.floor(total / 60).toString().padStart(2, '0');
    const minutoFinal = (total % 60).toString().padStart(2, '0');

    return `${horaFinal}:${minutoFinal}`;
  };

  const tempoTotal = servicosSelecionados.reduce((total, servico) => {
    return total + converterTempoParaMinutos(servico.tempo);
  }, 0);

  const nomesServicos = servicosSelecionados.map(servico => servico.nome).join(', ');
  const horarioFimSelecionado = horarioSelecionado ? somarMinutosNaHora(horarioSelecionado, tempoTotal || 60) : '';

  const profissionalAutomatico = escolhaSemPreferencia && profissionaisDisponiveisHorario.length > 0
    ? profissionaisDisponiveisHorario[0]
    : null;

  const profissionalFinal = funcionarioSelecionado || profissionalAutomatico;

  const nomeProfissionalExibicao = funcionarioSelecionado
    ? funcionarioSelecionado.nome
    : profissionalAutomatico
      ? `Qualquer disponível (${profissionalAutomatico.nome})`
      : 'Sem preferência';

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
      setServicos(Array.isArray(dataServ) ? dataServ : []);
      setFuncionarios(Array.isArray(dataFunc) ? dataFunc : []);

      const hoje = new Date().toISOString().split('T')[0];
      setDataSelecionada(hoje);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar as informações deste salão. Verifique o link.');
    } finally {
      setCarregando(false);
    }
  };

  const resetarEscolhaDeHorarioEProfissional = () => {
    setHorarioSelecionado('');
    setFuncionarioSelecionado(null);
    setEscolhaSemPreferencia(false);
    setProfissionaisDisponiveisHorario([]);
  };

  const toggleServico = (servico) => {
    setServicosSelecionados((selecionadosAtuais) => {
      const jaSelecionado = selecionadosAtuais.some(item => item.id === servico.id);

      if (jaSelecionado) {
        return selecionadosAtuais.filter(item => item.id !== servico.id);
      }

      return [...selecionadosAtuais, servico];
    });

    resetarEscolhaDeHorarioEProfissional();
  };

  // Busca os horários livres/ocupados considerando a equipe inteira.
  // Agora o horário só aparece ocupado no modo "sem preferência" se TODOS os profissionais estiverem ocupados.
  const buscarHorarios = async (data) => {
    if (!data) return;

    setCarregandoHorarios(true);
    resetarEscolhaDeHorarioEProfissional();

    try {
      const todosHorarios = Array.isArray(salao.horarios_trabalho)
        ? salao.horarios_trabalho
        : [];

      const duracao = tempoTotal || 60;

      // Se o salão tem profissionais, consulta cada agenda individualmente.
      if (funcionarios.length > 0) {
        const resultadosPorFuncionario = await Promise.all(
          funcionarios.map(async (func) => {
            const url = `${API_URL}/public/horarios-ocupados/${id_profissional}?data=${data}&duracao=${duracao}&funcionario_id=${func.id}`;
            const res = await fetch(url);
            const ocupados = await res.json();

            return {
              funcionario_id: func.id,
              horarios_ocupados: Array.isArray(ocupados) ? ocupados : []
            };
          })
        );

        const horariosBloqueados = todosHorarios.filter((hora) => {
          return resultadosPorFuncionario.every((resultado) => {
            return resultado.horarios_ocupados.includes(hora);
          });
        });

        setHorariosOcupados(horariosBloqueados);
        setHorariosDisponiveis(todosHorarios);
        return;
      }

      // Se o salão não tem profissionais cadastrados, usa a agenda geral.
      const url = `${API_URL}/public/horarios-ocupados/${id_profissional}?data=${data}&duracao=${duracao}`;
      const res = await fetch(url);
      const ocupados = await res.json();

      setHorariosOcupados(Array.isArray(ocupados) ? ocupados : []);
      setHorariosDisponiveis(todosHorarios);
    } catch (err) {
      console.error(err);
      setHorariosOcupados([]);
      setHorariosDisponiveis(Array.isArray(salao.horarios_trabalho) ? salao.horarios_trabalho : []);
    } finally {
      setCarregandoHorarios(false);
    }
  };

  // Depois que o cliente escolhe horário, mostra quais profissionais estão disponíveis naquele horário.
  const buscarProfissionaisDisponiveis = async (data, hora) => {
    if (!data || !hora) return;

    setCarregandoProfissionais(true);
    setFuncionarioSelecionado(null);
    setEscolhaSemPreferencia(false);

    try {
      const duracao = tempoTotal || 60;

      if (funcionarios.length === 0) {
        setProfissionaisDisponiveisHorario([]);
        return;
      }

      const resultados = await Promise.all(
        funcionarios.map(async (func) => {
          const url = `${API_URL}/public/horarios-ocupados/${id_profissional}?data=${data}&duracao=${duracao}&funcionario_id=${func.id}`;
          const res = await fetch(url);
          const ocupados = await res.json();
          const listaOcupados = Array.isArray(ocupados) ? ocupados : [];

          return {
            ...func,
            disponivel: !listaOcupados.includes(hora)
          };
        })
      );

      setProfissionaisDisponiveisHorario(resultados.filter(item => item.disponivel));
    } catch (err) {
      console.error(err);
      setProfissionaisDisponiveisHorario([]);
    } finally {
      setCarregandoProfissionais(false);
    }
  };

  useEffect(() => {
    if (passo === 2 && dataSelecionada) {
      buscarHorarios(dataSelecionada);
    }
  }, [passo, dataSelecionada, tempoTotal, funcionarios.length]);

  useEffect(() => {
    if (passo === 3 && dataSelecionada && horarioSelecionado) {
      buscarProfissionaisDisponiveis(dataSelecionada, horarioSelecionado);
    }
  }, [passo, dataSelecionada, horarioSelecionado, tempoTotal, funcionarios.length]);

  useEffect(() => {
    const formatarEBuscar = async () => {
      const whatsLimpo = cliente.whatsapp.replace(/\D/g, '');
      if (whatsLimpo.length >= 10 && passo === 4) {
        try {
          const res = await fetch(`${API_URL}/public/historico/${id_profissional}/${cliente.whatsapp}`);
          const data = await res.json();
          if (data.ultimoServico) {
            console.log('Último serviço:', data.ultimoServico);
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

  const finalizarAgendamento = async (e) => {
    e.preventDefault();

    if (servicosSelecionados.length === 0) {
      alert('Selecione pelo menos uma experiência.');
      return;
    }

    if (!horarioSelecionado) {
      alert('Selecione um horário disponível.');
      return;
    }

    if (funcionarios.length > 0 && !funcionarioSelecionado && !escolhaSemPreferencia) {
      alert('Escolha um profissional ou selecione qualquer disponível.');
      return;
    }

    if (funcionarios.length > 0 && escolhaSemPreferencia && !profissionalAutomatico) {
      alert('Nenhum profissional disponível para este horário. Escolha outro horário.');
      return;
    }

    if (!cliente.nome || cliente.whatsapp.replace(/\D/g, '').length < 10) {
      alert('Por favor, preencha seu nome e um WhatsApp válido.');
      return;
    }

    setEnviando(true);

    const payload = {
      id_profissional,
      nome: cliente.nome,
      whatsapp: cliente.whatsapp,
      nascimento: cliente.nascimento,
      servico_nome: nomesServicos,
      data_reserva: formatarDataBR(dataSelecionada),
      horario: horarioSelecionado,
      valor: valorTotal,
      funcionario_id: profissionalFinal ? profissionalFinal.id : null,
      funcionario_nome: profissionalFinal ? profissionalFinal.nome : null,
      duracao_minutos: tempoTotal || 60
    };

    try {
      const res = await fetch(`${API_URL}/public/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Erro ao agendar');
      }

      setSucesso(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Ocorreu um erro ao tentar agendar. Tente novamente.');
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
        <p className="text-[#A8A8A8] text-sm max-w-sm mb-4 font-light leading-relaxed">
          Sua experiência no <strong className="text-white">{salao.nome}</strong> foi agendada com sucesso para <strong className="text-white">{formatarDataBR(dataSelecionada)} das {horarioSelecionado} às {horarioFimSelecionado}</strong>.
        </p>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 mb-8 w-full max-w-sm text-left">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest mb-2">Serviços agendados</p>
          <p className="text-white text-sm leading-relaxed">{nomesServicos}</p>
          <p className="text-[#A8A8A8] text-xs mt-3">Profissional: <strong className="text-white">{profissionalFinal?.nome || 'Sem preferência'}</strong></p>
          <p className="text-[#D4AF37] font-['Playfair_Display'] text-xl mt-3">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
        </div>
        <button onClick={() => window.location.reload()} className="text-[#D4AF37] border border-[#D4AF37] px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-colors">
          Fazer novo agendamento
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] font-['Inter'] text-white flex justify-center p-4 md:p-8 selection:bg-[#D4AF37] selection:text-black">
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-[2.5rem] border border-[#2A2A2A] shadow-2xl overflow-hidden relative flex flex-col h-[85vh] md:h-auto md:min-h-175">
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

        <div className="flex h-1 bg-[#0D0D0D]">
          <div className="h-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] transition-all duration-500" style={{ width: `${(passo / 4) * 100}%` }}></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {passo > 1 && (
            <button onClick={() => setPasso(passo - 1)} className="text-[#A8A8A8] flex items-center gap-2 text-xs hover:text-[#D4AF37] transition-colors mb-6">
              <ArrowLeft size={16} /> Voltar
            </button>
          )}

          {passo === 1 && (
            <div className="animate-slide-up">
              <div className="mb-6">
                <h2 className="text-xl font-['Playfair_Display'] text-white">Escolha sua Experiência</h2>
                <p className="text-[#6F6F6F] text-xs mt-1">Você pode selecionar um ou vários serviços.</p>
              </div>

              {servicos.length === 0 ? (
                <p className="text-[#6F6F6F] text-sm text-center py-10 border border-dashed border-[#2A2A2A] rounded-2xl">Nenhuma experiência cadastrada no momento.</p>
              ) : (
                <div className="space-y-3">
                  {servicos.map(serv => {
                    const selecionado = servicosSelecionados.some(item => item.id === serv.id);

                    return (
                      <button
                        key={serv.id}
                        type="button"
                        onClick={() => toggleServico(serv)}
                        className={`w-full p-5 rounded-2xl border text-left transition-all flex justify-between items-center group ${selecionado ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                      >
                        <div>
                          <p className={`font-medium text-lg ${selecionado ? 'text-[#D4AF37]' : 'text-white'}`}>{serv.nome}</p>
                          <p className="text-[#6F6F6F] text-xs mt-1 flex items-center gap-1"><Clock size={12} /> {serv.tempo || 'Tempo não informado'}</p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <span className={`font-['Playfair_Display'] text-lg ${selecionado ? 'text-white' : 'text-[#D4AF37]'}`}>R$ {Number(serv.preco || 0).toFixed(2).replace('.', ',')}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selecionado ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                            {selecionado && <CheckCircle2 size={12} className="text-[#0D0D0D]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {servicosSelecionados.length > 0 && (
                <div className="mt-5 bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <p className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Selecionados</p>
                      <p className="text-white text-sm mt-1">{servicosSelecionados.length} {servicosSelecionados.length === 1 ? 'serviço' : 'serviços'}</p>
                    </div>
                    <div className="text-right">
                      {tempoTotal > 0 && <p className="text-[#A8A8A8] text-xs mb-1">Tempo aprox.: {formatarDuracao(tempoTotal)}</p>}
                      <p className="text-[#D4AF37] font-['Playfair_Display'] text-xl">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {passo === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-6">Data e Horário</h2>

              <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 mb-4">
                <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-2 block">Selecione o Dia</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  className="w-full bg-transparent text-white outline-none focus:text-[#D4AF37] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] cursor-pointer text-lg font-light"
                />
              </div>

              <div className="bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Tempo total</p>
                    <p className="text-white font-medium">{formatarDuracao(tempoTotal || 60)}</p>
                  </div>
                  {horarioSelecionado ? (
                    <div className="text-right">
                      <p className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Intervalo</p>
                      <p className="text-[#D4AF37] font-bold">{horarioSelecionado} → {horarioFimSelecionado}</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Status</p>
                      <p className="text-[#D4AF37] font-medium">Escolha um horário</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest block">Agenda do Dia</label>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-[#A8A8A8]"><span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span> Livre</span>
                    <span className="flex items-center gap-1 text-red-300"><span className="w-2 h-2 rounded-full bg-red-500"></span> Ocupado</span>
                  </div>
                </div>

                {carregandoHorarios ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#D4AF37]" size={24} /></div>
                ) : horariosDisponiveis.length === 0 ? (
                  <p className="text-[#6F6F6F] text-sm text-center py-6 border border-dashed border-[#2A2A2A] rounded-xl">Nenhum horário cadastrado para esta data.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {horariosDisponiveis.map(hora => {
                      const ocupado = horariosOcupados.includes(hora);
                      const selecionado = horarioSelecionado === hora;

                      return (
                        <button
                          key={hora}
                          type="button"
                          disabled={ocupado}
                          onClick={() => {
                            if (!ocupado) {
                              setHorarioSelecionado(hora);
                              setFuncionarioSelecionado(null);
                              setEscolhaSemPreferencia(false);
                              setProfissionaisDisponiveisHorario([]);
                            }
                          }}
                          title={ocupado ? 'Todos os profissionais estão ocupados neste horário' : `Selecionar ${hora}`}
                          className={`py-3.5 rounded-xl border text-sm font-medium transition-all relative overflow-hidden ${selecionado ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] scale-105 shadow-lg' : ocupado ? 'bg-red-950/40 text-red-300 border-red-900/60 cursor-not-allowed opacity-80' : 'bg-[#0D0D0D] text-[#A8A8A8] border-[#2A2A2A] hover:border-[#D4AF37]/50 hover:text-white'}`}
                        >
                          <span className="block">{hora}</span>
                          {ocupado && <span className="block text-[9px] mt-0.5 uppercase tracking-widest">Ocupado</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {passo === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-2">Profissional disponível</h2>
              <p className="text-[#6F6F6F] text-xs mb-6">Escolha quem vai atender no horário {horarioSelecionado}.</p>

              <div className="bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Horário escolhido</p>
                  <p className="text-[#D4AF37] font-bold">{formatarDataBR(dataSelecionada)} • {horarioSelecionado} → {horarioFimSelecionado}</p>
                </div>
                <p className="text-white text-sm">{formatarDuracao(tempoTotal || 60)}</p>
              </div>

              {carregandoProfissionais ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#D4AF37]" size={24} /></div>
              ) : funcionarios.length === 0 ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFuncionarioSelecionado(null);
                      setEscolhaSemPreferencia(true);
                    }}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${escolhaSemPreferencia ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] border ${escolhaSemPreferencia ? 'border-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                      <Star size={20} className={escolhaSemPreferencia ? 'text-[#D4AF37]' : 'text-[#6F6F6F]'} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${escolhaSemPreferencia ? 'text-[#D4AF37]' : 'text-white'}`}>Atendimento pelo salão</p>
                      <p className="text-[#6F6F6F] text-xs">Nenhum profissional específico cadastrado</p>
                    </div>
                  </button>
                </div>
              ) : profissionaisDisponiveisHorario.length === 0 ? (
                <p className="text-red-300 text-sm text-center py-6 border border-red-900/50 bg-red-950/20 rounded-xl">Nenhum profissional disponível neste horário. Volte e escolha outro horário.</p>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFuncionarioSelecionado(null);
                      setEscolhaSemPreferencia(true);
                    }}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${escolhaSemPreferencia && !funcionarioSelecionado ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] border ${escolhaSemPreferencia && !funcionarioSelecionado ? 'border-[#D4AF37]' : 'border-[#2A2A2A]'}`}>
                      <Star size={20} className={escolhaSemPreferencia && !funcionarioSelecionado ? 'text-[#D4AF37]' : 'text-[#6F6F6F]'} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${escolhaSemPreferencia && !funcionarioSelecionado ? 'text-[#D4AF37]' : 'text-white'}`}>Qualquer disponível</p>
                      <p className="text-[#6F6F6F] text-xs">Sistema atribui automaticamente: {profissionaisDisponiveisHorario[0]?.nome}</p>
                    </div>
                    {escolhaSemPreferencia && !funcionarioSelecionado && <CheckCircle2 size={18} className="text-[#D4AF37]" />}
                  </button>

                  {funcionarios.map(func => {
                    const disponivel = profissionaisDisponiveisHorario.some(item => Number(item.id) === Number(func.id));
                    const selecionado = funcionarioSelecionado?.id === func.id;

                    return (
                      <button
                        key={func.id}
                        type="button"
                        disabled={!disponivel}
                        onClick={() => {
                          if (!disponivel) return;
                          setFuncionarioSelecionado(func);
                          setEscolhaSemPreferencia(false);
                        }}
                        className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${selecionado ? 'bg-[#0D0D0D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : !disponivel ? 'bg-red-950/20 border-red-900/50 opacity-70 cursor-not-allowed' : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] border ${selecionado ? 'border-[#D4AF37]' : !disponivel ? 'border-red-900/60' : 'border-[#2A2A2A]'}`}>
                          <Scissors size={20} className={selecionado ? 'text-[#D4AF37]' : !disponivel ? 'text-red-300' : 'text-[#6F6F6F]'} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-lg ${selecionado ? 'text-[#D4AF37]' : !disponivel ? 'text-red-300' : 'text-white'}`}>{func.nome}</p>
                          <p className={`text-xs ${disponivel ? 'text-emerald-400' : 'text-red-300'}`}>{disponivel ? 'Disponível neste horário' : 'Ocupado neste horário'}</p>
                        </div>
                        {selecionado && <CheckCircle2 size={18} className="text-[#D4AF37]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {passo === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-['Playfair_Display'] text-white mb-6">Confirme sua Reserva</h2>

              <div className="bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-2xl p-5 mb-8 flex flex-col gap-2 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                <div className="pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A8A8A8] text-xs block mb-2">Experiências</span>
                  <div className="space-y-1">
                    {servicosSelecionados.map(servico => (
                      <div key={servico.id} className="flex justify-between gap-3 text-sm">
                        <span className="text-white font-medium">{servico.nome}</span>
                        <span className="text-[#D4AF37] whitespace-nowrap">R$ {Number(servico.preco || 0).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A8A8A8] text-xs">Profissional</span>
                  <span className="text-white font-medium text-right">{nomeProfissionalExibicao}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A8A8A8] text-xs">Data e Hora</span>
                  <span className="text-[#D4AF37] font-medium">{formatarDataBR(dataSelecionada)} - {horarioSelecionado} → {horarioFimSelecionado}</span>
                </div>
                {tempoTotal > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                    <span className="text-[#A8A8A8] text-xs">Tempo aproximado</span>
                    <span className="text-white font-medium">{formatarDuracao(tempoTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#A8A8A8] text-xs">Valor Total</span>
                  <span className="text-[#D4AF37] font-['Playfair_Display'] text-xl">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <form onSubmit={finalizarAgendamento} className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-2 block">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6F6F6F]" size={18} />
                    <input type="text" required placeholder="Ex: João Silva" value={cliente.nome} onChange={e => setCliente({ ...cliente, nome: e.target.value })} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] py-4 pl-12 pr-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-2 block">Seu WhatsApp</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] text-sm">+55</span>
                    <input type="tel" required placeholder="(11) 99999-9999" value={cliente.whatsapp} onChange={e => setCliente({ ...cliente, whatsapp: e.target.value })} className="w-full bg-[#0D0D0D] border border-[#2A2A2A] py-4 pl-14 pr-4 text-white rounded-xl focus:border-[#D4AF37] outline-none transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={enviando} className={`w-full bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] py-5 rounded-xl font-bold tracking-widest uppercase text-sm mt-4 flex justify-center items-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.3)] ${enviando ? 'opacity-70' : 'hover:scale-[1.02] transition-transform'}`}>
                  {enviando ? <><Loader2 className="animate-spin" size={18} /> Processando...</> : 'Finalizar Agendamento'}
                </button>
              </form>
            </div>
          )}
        </div>

        {passo < 4 && (
          <div className="p-6 border-t border-[#2A2A2A] bg-[#0D0D0D]">
            <button
              type="button"
              onClick={() => setPasso(passo + 1)}
              disabled={
                (passo === 1 && servicosSelecionados.length === 0) ||
                (passo === 2 && !horarioSelecionado) ||
                (passo === 3 && funcionarios.length > 0 && !funcionarioSelecionado && !escolhaSemPreferencia) ||
                (passo === 3 && funcionarios.length > 0 && escolhaSemPreferencia && profissionaisDisponiveisHorario.length === 0)
              }
              className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase text-xs flex justify-center items-center gap-2 transition-all ${((passo === 1 && servicosSelecionados.length === 0) || (passo === 2 && !horarioSelecionado) || (passo === 3 && funcionarios.length > 0 && !funcionarioSelecionado && !escolhaSemPreferencia) || (passo === 3 && funcionarios.length > 0 && escolhaSemPreferencia && profissionaisDisponiveisHorario.length === 0)) ? 'bg-[#1A1A1A] text-[#6F6F6F] border border-[#2A2A2A] cursor-not-allowed' : 'bg-linear-to-r from-[#D4AF37] to-[#E6C76B] text-[#0D0D0D] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02]'}`}
            >
              Continuar <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
