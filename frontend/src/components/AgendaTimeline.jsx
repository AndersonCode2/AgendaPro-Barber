import React, { useMemo } from 'react';
import { CalendarDays, CheckCircle2, MessageCircle, BellRing, XCircle } from 'lucide-react';

export default function AgendaTimeline({
  agendamentos = [],
  funcionarios = [],
  onConcluir,
  onEnviarConfirmacao,
  onEnviarLembrete,
  onCancelar
}) {
  const horariosBase = [
    '08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00',
    '18:00','19:00','20:00','21:00','22:00'
  ];

  /*
    AJUSTE VISUAL PREMIUM
    - Antes os cards de 1h ficavam pequenos demais.
    - Cards longos ficavam grandes demais.
    - Agora o visual fica equilibrado e legível.
  */
  const ALTURA_HORA = 150;
  const ALTURA_CARD_FIXA = 190;
  const INICIO_DIA = 8 * 60;
  const FIM_DIA = 23 * 60;
  const ALTURA_TOTAL = ((FIM_DIA - INICIO_DIA) / 60) * ALTURA_HORA;

  const horaParaMinutos = (hora) => {
    if (!hora || typeof hora !== 'string') return 0;
    const [h, m] = hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const minutosParaHora = (minutos) => {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0');
    const m = (minutos % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const calcularFim = (agendamento) => {
    const inicio = horaParaMinutos(agendamento.horario);
    const duracao = parseInt(agendamento.duracao_minutos, 10) || 60;
    return agendamento.horario_fim || minutosParaHora(inicio + duracao);
  };

  const formatarMoeda = (valor) => {
    return `R$ ${parseFloat(valor || 0).toFixed(2).replace('.', ',')}`;
  };

  const profissionaisTimeline = useMemo(() => {
    const lista = funcionarios.map((func) => ({
      id: func.id,
      nome: func.nome
    }));

    const temSemProfissional = agendamentos.some((a) => !a.funcionario_id);

    if (temSemProfissional || lista.length === 0) {
      lista.unshift({
        id: 'sem-preferencia',
        nome: 'Sem preferência'
      });
    }

    return lista;
  }, [funcionarios, agendamentos]);

  const agendamentosPorProfissional = (profissional) => {
    if (profissional.id === 'sem-preferencia') {
      return agendamentos.filter((a) => !a.funcionario_id);
    }

    return agendamentos.filter(
      (a) => Number(a.funcionario_id) === Number(profissional.id)
    );
  };

  const totalDia = agendamentos.reduce(
    (acc, item) => acc + parseFloat(item.valor || 0),
    0
  );

  if (!agendamentos.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-4xl p-8 text-center">
        <CalendarDays size={42} className="text-[#D4AF37] mx-auto mb-4 opacity-80" />

        <h3 className="text-white font-['Playfair_Display'] text-2xl mb-2">
          Agenda vazia hoje
        </h3>

        <p className="text-[#8A8A8A] text-sm">
          Nenhum agendamento encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest mb-2">
            Agendamentos
          </p>
          <h3 className="text-white text-3xl font-bold">
            {agendamentos.length}
          </h3>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest mb-2">
            Previsto
          </p>
          <h3 className="text-[#D4AF37] text-2xl font-['Playfair_Display']">
            {formatarMoeda(totalDia)}
          </h3>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest mb-2">
            Profissionais
          </p>
          <h3 className="text-white text-3xl font-bold">
            {profissionaisTimeline.length}
          </h3>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest mb-2">
            Status
          </p>
          <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-widest">
            Operando
          </h3>
        </div>
      </div>

      <div className="bg-[#101010] border border-[#2A2A2A] rounded-4xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-['Playfair_Display'] text-white">
              Agenda Timeline
            </h2>

            <p className="text-[#8A8A8A] text-sm">
              Visualização premium por profissional e duração real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-[#A8A8A8] text-xs uppercase tracking-widest">
              Confirmado
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-300">
            <div
              className="grid bg-[#151515] border-b border-[#2A2A2A]"
              style={{
                gridTemplateColumns: `90px repeat(${profissionaisTimeline.length}, minmax(280px, 1fr))`
              }}
            >
              <div className="p-4 text-[#8A8A8A] text-xs uppercase tracking-widest border-r border-[#2A2A2A]">
                Hora
              </div>

              {profissionaisTimeline.map((prof) => (
                <div
                  key={prof.id}
                  className="p-4 border-r border-[#2A2A2A] last:border-r-0"
                >
                  <p className="text-white font-bold text-lg">
                    {prof.nome}
                  </p>
                  <p className="text-[#8A8A8A] text-xs">
                    Profissional
                  </p>
                </div>
              ))}
            </div>

            <div
              className="grid relative"
              style={{
                gridTemplateColumns: `90px repeat(${profissionaisTimeline.length}, minmax(280px, 1fr))`
              }}
            >
              <div className="relative bg-[#0B0B0B] border-r border-[#2A2A2A]">
                {horariosBase.map((hora) => (
                  <div
                    key={hora}
                    className="border-b border-[#1E1E1E] px-4 pt-4"
                    style={{ height: ALTURA_HORA }}
                  >
                    <span className="text-[#D4AF37] font-['Playfair_Display'] text-lg">
                      {hora}
                    </span>
                  </div>
                ))}
              </div>

              {profissionaisTimeline.map((prof) => (
                <div
                  key={prof.id}
                  className="relative bg-[#111] border-r border-[#1E1E1E] last:border-r-0"
                  style={{ height: ALTURA_TOTAL }}
                >
                  {horariosBase.map((hora) => (
                    <div
                      key={`${prof.id}-${hora}`}
                      className="absolute left-0 right-0 border-b border-[#1E1E1E]"
                      style={{
                        top: ((horaParaMinutos(hora) - INICIO_DIA) / 60) * ALTURA_HORA,
                        height: ALTURA_HORA
                      }}
                    >
                      <div className="h-full m-3 rounded-2xl border border-dashed border-[#252525] flex items-center justify-center">
                        <span className="text-[#3A3A3A] text-xs">
                          Livre
                        </span>
                      </div>
                    </div>
                  ))}

                  {agendamentosPorProfissional(prof).map((ag) => {
                    const inicioMin = horaParaMinutos(ag.horario);
                    const duracao = parseInt(ag.duracao_minutos, 10) || 60;
                    const fimAg = calcularFim(ag);

                    const top = ((inicioMin - INICIO_DIA) / 60) * ALTURA_HORA;

                    const height = ALTURA_CARD_FIXA;

                    const cardLongo = false;

                    return (
                      <div
                        key={ag.id}
                        className="absolute left-3 right-3 rounded-3xl border border-[#D4AF37]/50 bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] shadow-[0_18px_50px_rgba(0,0,0,0.55)] overflow-hidden z-20"
                        style={{
                          top: top + 8,
                          height: height - 16
                        }}
                      >
                        <div className="bg-[#0B0B0B] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>

                            <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase truncate">
                              Confirmado
                            </span>
                          </div>

                          <span className="text-[#D4AF37] text-sm font-bold whitespace-nowrap">
                            {ag.horario} → {fimAg}
                          </span>
                        </div>

                        <div className="px-4 py-3 h-[calc(100%-45px)] flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-white text-lg font-bold truncate">
                                {ag.cliente_nome}
                              </h3>

                              <p className="text-[#A8A8A8] text-xs truncate">
                                {ag.servico_nome}
                              </p>

                              {cardLongo && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <span className="bg-[#2A2A2A] text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold">
                                    {prof.nome}
                                  </span>

                                  <span className="bg-[#0D0D0D] border border-[#2A2A2A] text-white px-3 py-1 rounded-full text-xs">
                                    {duracao} min
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-[#D4AF37] font-['Playfair_Display'] text-lg">
                                {formatarMoeda(ag.valor)}
                              </p>

                              {!cardLongo && (
                                <p className="text-[#8A8A8A] text-[10px]">
                                  {duracao} min
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 mt-2">
                            <button
                              onClick={() => onEnviarConfirmacao?.(ag)}
                              className="bg-[#0D0D0D] border border-[#2A2A2A] text-[#D4AF37] px-2 py-2 rounded-xl text-[10px] font-bold uppercase hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-1"
                            >
                              <MessageCircle size={12} />
                              Conf.
                            </button>

                            <button
                              onClick={() => onEnviarLembrete?.(ag)}
                              className="bg-[#0D0D0D] border border-[#2A2A2A] text-white px-2 py-2 rounded-xl text-[10px] font-bold uppercase hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-1"
                            >
                              <BellRing size={12} />
                              Lemb.
                            </button>

                            <button
                              onClick={() => onCancelar?.(ag)}
                              className="bg-red-500/10 border border-red-500/20 text-red-300 px-2 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                            >
                              <XCircle size={12} />
                              Canc.
                            </button>

                            {onConcluir && (
                              <button
                                onClick={() => onConcluir(ag)}
                                className="bg-[#D4AF37] text-[#0D0D0D] px-2 py-2 rounded-xl text-[10px] font-bold uppercase hover:scale-105 transition-all flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 size={12} />
                                Finalizar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
