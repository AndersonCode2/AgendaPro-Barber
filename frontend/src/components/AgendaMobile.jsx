import React from 'react';
import {
  Clock3,
  User2,
  CheckCircle2,
  Plus,
  Scissors,
  MessageCircle,
  BellRing,
  XCircle
} from 'lucide-react';

export default function AgendaMobile({
  agendamentos = [],
  onNovoAgendamento,
  onFinalizar,
  onEnviarConfirmacao,
  onEnviarLembrete,
  onCancelar
}) {

  const agrupados = agendamentos.reduce((acc, agendamento) => {

    const horario = agendamento.horario || 'Sem horário';

    if (!acc[horario]) {
      acc[horario] = [];
    }

    acc[horario].push(agendamento);

    return acc;

  }, {});

  const horarios = Object.keys(agrupados).sort();

  return (
    <div className="w-full space-y-4 pb-40">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-white text-3xl font-['Playfair_Display']">
            Agenda
          </h2>

          <p className="text-[#8A8A8A] mt-1">
            Visualização otimizada para celular
          </p>
        </div>

        <button
          onClick={onNovoAgendamento}
          className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#0D0D0D] flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.35)]"
        >
          <Plus size={22} />
        </button>

      </div>

      {/* SEM AGENDAMENTOS */}
      {horarios.length === 0 && (

        <div className="bg-[#111] border border-[#2A2A2A] rounded-[2rem] p-10 text-center">

          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] mx-auto flex items-center justify-center mb-5">
            <Clock3 size={34} className="text-[#D4AF37]" />
          </div>

          <h3 className="text-white text-xl font-semibold">
            Sua agenda está livre
          </h3>

          <p className="text-[#8A8A8A] mt-2">
            Nenhum agendamento encontrado para hoje.
          </p>

        </div>

      )}

      {/* LISTA */}
      <div className="space-y-6">

        {horarios.map((horario) => (

          <div key={horario} className="space-y-3">

            {/* HORARIO */}
            <div className="flex items-center gap-3">

              <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>

              <h3 className="text-[#D4AF37] font-bold text-xl">
                {horario}
              </h3>

            </div>

            {/* AGENDAMENTOS */}
            <div className="space-y-3">

              {agrupados[horario].map((agendamento, index) => (

                <div
                  key={index}
                  className="bg-linear-to-br from-[#1A1A1A] to-[#111] border border-[#2A2A2A] rounded-[2rem] overflow-hidden"
                >

                  {/* TOP */}
                  <div className="border-b border-[#2A2A2A] p-4 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">

                      <CheckCircle2
                        size={16}
                        className="text-emerald-400"
                      />

                      <span className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase">
                        Confirmado
                      </span>

                    </div>

                    <div className="text-[#D4AF37] font-bold">
                      {agendamento.horario}
                    </div>

                  </div>

                  {/* BODY */}
                  <div className="p-5 space-y-5">

                    <div>

                      <h2 className="text-white text-2xl font-bold">
                        {agendamento.nome}
                      </h2>

                      <div className="flex items-center gap-2 text-[#8A8A8A] mt-2">

                        <Scissors size={14} />

                        <span>
                          {agendamento.servico_nome}
                        </span>

                      </div>

                    </div>

                    {/* INFO */}
                    <div className="flex flex-wrap gap-2">

                      {agendamento.funcionario_nome && (

                        <div className="bg-[#222] border border-[#2A2A2A] rounded-full px-4 py-2 text-[#D4AF37] text-sm font-semibold flex items-center gap-2">

                          <User2 size={14} />

                          {agendamento.funcionario_nome}

                        </div>

                      )}

                      {agendamento.duracao_minutos && (

                        <div className="bg-[#111] border border-[#2A2A2A] rounded-full px-4 py-2 text-white text-sm">
                          {agendamento.duracao_minutos} min
                        </div>

                      )}

                    </div>

                    {/* FOOTER */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">

                        <div className="text-[#D4AF37] text-3xl font-['Playfair_Display']">
                          R$ {Number(agendamento.valor || 0).toFixed(2)}
                        </div>

                        <button
                          onClick={() => onFinalizar(agendamento)}
                          className="bg-[#D4AF37] text-[#0D0D0D] rounded-2xl px-6 py-4 font-bold tracking-widest uppercase"
                        >
                          Finalizar
                        </button>

                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => onEnviarConfirmacao?.(agendamento)} className="bg-[#0D0D0D] border border-[#2A2A2A] text-[#D4AF37] rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1"><MessageCircle size={13}/>Confirmar</button>
                        <button onClick={() => onEnviarLembrete?.(agendamento)} className="bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1"><BellRing size={13}/>Lembrete</button>
                        <button onClick={() => onCancelar?.(agendamento)} className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1"><XCircle size={13}/>Cancelar</button>
                      </div>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}