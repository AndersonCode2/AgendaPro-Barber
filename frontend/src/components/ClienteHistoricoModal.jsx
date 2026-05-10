import React from 'react';
import {
  X,
  Crown,
  Wallet,
  CalendarDays,
  TrendingUp,
  Clock3,
  UserRound
} from 'lucide-react';

export default function ClienteHistoricoModal({
  aberto,
  onClose,
  cliente,
  historico = []
}) {
  if (!aberto || !cliente) return null;

  const totalVisitas = historico.length;

  const totalGasto = historico.reduce((acc, item) => {
    return acc + Number(item.valor || 0);
  }, 0);

  const ticketMedio =
    totalVisitas > 0 ? totalGasto / totalVisitas : 0;

  const ultimaVisita =
    historico.length > 0
      ? new Date(historico[0].data_agendamento).toLocaleDateString('pt-BR')
      : 'Sem visitas';

  const formatarMoeda = (valor) => {
    return `R$ ${Number(valor || 0)
      .toFixed(2)
      .replace('.', ',')}`;
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 animate-fade-in">

      <div className="bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-[2rem] w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.65)] animate-slide-up relative">

        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* HEADER */}
        <div className="border-b border-[#2A2A2A] p-6 flex items-start justify-between gap-4 relative z-10">

          <div className="flex items-center gap-5 min-w-0">

            <div className="w-20 h-20 rounded-3xl bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.12)] shrink-0">
              <UserRound size={38} className="text-[#D4AF37]" />
            </div>

            <div className="min-w-0">
              <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                CRM Premium
              </p>

              <h2 className="text-3xl font-['Playfair_Display'] text-white truncate">
                {cliente.nome}
              </h2>

              <p className="text-[#8A8A8A] text-sm mt-2">
                Histórico completo de atendimentos e relacionamento.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center text-[#8A8A8A] hover:text-white hover:border-[#D4AF37]/40 transition-all shrink-0"
          >
            <X size={20} />
          </button>

        </div>

        {/* ESTATISTICAS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-6 border-b border-[#2A2A2A] relative z-10">

          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8A8A8A] text-[10px] uppercase tracking-widest">
                Visitas
              </span>

              <CalendarDays size={18} className="text-[#D4AF37]" />
            </div>

            <h3 className="text-white text-3xl font-bold">
              {totalVisitas}
            </h3>
          </div>

          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8A8A8A] text-[10px] uppercase tracking-widest">
                Total gasto
              </span>

              <Wallet size={18} className="text-[#D4AF37]" />
            </div>

            <h3 className="text-[#D4AF37] text-2xl font-['Playfair_Display']">
              {formatarMoeda(totalGasto)}
            </h3>
          </div>

          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8A8A8A] text-[10px] uppercase tracking-widest">
                Ticket médio
              </span>

              <TrendingUp size={18} className="text-[#D4AF37]" />
            </div>

            <h3 className="text-white text-2xl font-bold">
              {formatarMoeda(ticketMedio)}
            </h3>
          </div>

          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8A8A8A] text-[10px] uppercase tracking-widest">
                Última visita
              </span>

              <Clock3 size={18} className="text-[#D4AF37]" />
            </div>

            <h3 className="text-white text-lg font-bold">
              {ultimaVisita}
            </h3>
          </div>

        </div>

        {/* TIMELINE */}
        <div className="overflow-y-auto max-h-[55vh] p-6 space-y-5 relative z-10">

          {historico.length === 0 ? (
            <div className="border border-dashed border-[#2A2A2A] rounded-[2rem] p-14 text-center bg-[#111]">

              <Crown size={42} className="text-[#D4AF37] mx-auto mb-5 opacity-70" />

              <h3 className="text-white text-2xl font-['Playfair_Display'] mb-3">
                Nenhum histórico encontrado
              </h3>

              <p className="text-[#8A8A8A] text-sm">
                Os atendimentos do cliente aparecerão aqui automaticamente.
              </p>

            </div>
          ) : (
            historico.map((item, index) => {

              const data = item.data_agendamento
                ? new Date(item.data_agendamento)
                : null;

              return (
                <div
                  key={index}
                  className="relative pl-8"
                >

                  {/* LINHA */}
                  <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-[#2A2A2A]"></div>

                  {/* BOLINHA */}
                  <div className="absolute left-0 top-7 w-5 h-5 rounded-full bg-[#D4AF37] border-4 border-[#0D0D0D] shadow-[0_0_20px_rgba(212,175,55,0.5)]"></div>

                  <div className="bg-[#111] border border-[#2A2A2A] hover:border-[#D4AF37]/30 rounded-[2rem] p-6 transition-all duration-300">

                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                      <div className="space-y-3">

                        <div>
                          <h3 className="text-white text-xl font-bold">
                            {item.servico_nome || 'Serviço'}
                          </h3>

                          <p className="text-[#8A8A8A] text-sm mt-1">
                            Atendimento realizado no sistema AURUM Premium.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">

                          <span className="bg-[#0D0D0D] border border-[#2A2A2A] text-white px-4 py-2 rounded-full text-xs">
                            👤 {item.funcionario_nome || 'Profissional'}
                          </span>

                          <span className="bg-[#0D0D0D] border border-[#2A2A2A] text-[#D4AF37] px-4 py-2 rounded-full text-xs">
                            💰 {formatarMoeda(item.valor)}
                          </span>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-[#D4AF37] text-lg font-['Playfair_Display']">
                          {data
                            ? data.toLocaleDateString('pt-BR')
                            : 'Data não disponível'}
                        </p>

                        <p className="text-[#6F6F6F] text-xs mt-1">
                          {data
                            ? data.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : ''}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}
