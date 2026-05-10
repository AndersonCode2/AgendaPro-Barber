import React, { useMemo, useState } from 'react';
import {
  X,
  CalendarDays,
  Clock3,
  UserRound,
  Sparkles,
  Scissors,
  CheckCircle2
} from 'lucide-react';

export default function ReagendarClienteModal({
  aberto,
  onClose,
  cliente,
  funcionarios = [],
  servicos = [],
  horariosDisponiveis = [],
  onConfirmar
}) {

  const servicoFavorito =
    cliente?.servico_favorito ||
    cliente?.ultimo_servico ||
    '';

  const profissionalPreferido =
    cliente?.profissional_preferido || '';

  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState(servicoFavorito);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(profissionalPreferido);

  const horarios = useMemo(() => {
    if (Array.isArray(horariosDisponiveis) && horariosDisponiveis.length > 0) {
      return horariosDisponiveis;
    }

    return [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00'
    ];
  }, [horariosDisponiveis]);

  if (!aberto || !cliente) return null;

  const confirmar = () => {
    if (!data || !horario) {
      alert('Selecione a data e horário.');
      return;
    }

    const payload = {
      cliente,
      data,
      horario,
      servico: servicoSelecionado,
      funcionario: funcionarioSelecionado
    };

    if (onConfirmar) {
      onConfirmar(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">

      <div className="w-full max-w-3xl bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-4xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative">

        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>

        {/* HEADER */}
        <div className="relative z-10 border-b border-[#2A2A2A] p-6 flex items-start justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center">
              <Sparkles size={28} className="text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                Reagendamento Inteligente
              </p>

              <h2 className="text-white text-3xl font-['Playfair_Display']">
                {cliente?.nome}
              </h2>

              <p className="text-[#8A8A8A] text-sm mt-1">
                Agende rapidamente o próximo atendimento do cliente.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all"
          >
            <X size={20} />
          </button>

        </div>

        {/* BODY */}
        <div className="relative z-10 p-6 space-y-6">

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">
                Serviço
              </label>

              <div className="relative">
                <Scissors size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />

                <select
                  value={servicoSelecionado}
                  onChange={(e) => setServicoSelecionado(e.target.value)}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                >
                  <option value="">Selecione</option>

                  {servicos.map((servico, index) => (
                    <option
                      key={index}
                      value={servico.nome || servico}
                    >
                      {servico.nome || servico}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">
                Profissional
              </label>

              <div className="relative">
                <UserRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />

                <select
                  value={funcionarioSelecionado}
                  onChange={(e) => setFuncionarioSelecionado(e.target.value)}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                >
                  <option value="">Selecione</option>

                  {funcionarios.map((funcionario, index) => (
                    <option
                      key={index}
                      value={funcionario.nome || funcionario}
                    >
                      {funcionario.nome || funcionario}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">
                Data
              </label>

              <div className="relative">
                <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />

                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">
                Horário
              </label>

              <div className="relative">
                <Clock3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />

                <select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                >
                  <option value="">Selecione</option>

                  {horarios.map((hora, index) => (
                    <option key={index} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* RESUMO */}
          <div className="bg-[#111] border border-[#2A2A2A] rounded-4xl p-5 space-y-4">

            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#D4AF37]" />

              <h3 className="text-white font-semibold">
                Resumo do reagendamento
              </h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 text-sm">

              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">
                  Cliente
                </p>

                <p className="text-white">
                  {cliente?.nome}
                </p>
              </div>

              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">
                  Serviço
                </p>

                <p className="text-white">
                  {servicoSelecionado || '-'}
                </p>
              </div>

              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">
                  Profissional
                </p>

                <p className="text-white">
                  {funcionarioSelecionado || '-'}
                </p>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex flex-col xl:flex-row gap-3 pt-2">

            <button
              onClick={onClose}
              className="flex-1 bg-[#111] border border-[#2A2A2A] hover:border-[#D4AF37]/30 text-white rounded-2xl py-4 font-semibold transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={confirmar}
              className="flex-1 bg-[#D4AF37] hover:brightness-110 text-[#0D0D0D] rounded-2xl py-4 font-bold transition-all"
            >
              Confirmar reagendamento
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
