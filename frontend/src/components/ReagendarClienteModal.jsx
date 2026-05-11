import React, { useMemo, useState } from 'react';
import {
  X,
  CalendarDays,
  Clock3,
  UserRound,
  Sparkles,
  Scissors,
  CheckCircle2,
  Loader2
} from 'lucide-react';

import {
  gerarHorariosDisponiveis,
  obterDuracaoServico
} from '../utils/agendaInteligente';

export default function ReagendarClienteModal({
  aberto,
  onClose,
  cliente,
  funcionarios = [],
  servicos = [],
  agendamentos = [],
  horariosBase = [],
  onConfirmar
}) {
  const servicoFavorito =
    cliente?.servico_favorito ||
    cliente?.ultimo_servico ||
    '';

  const servicoInicial = servicos.find((servico) => {
    return servico.nome === servicoFavorito;
  }) || null;

  const profissionalPreferido =
    cliente?.profissional_preferido || '';

  const funcionarioInicial = funcionarios.find((funcionario) => {
    return funcionario.nome === profissionalPreferido;
  }) || null;

  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState(servicoInicial);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(funcionarioInicial);
  const [enviando, setEnviando] = useState(false);

  const duracaoServico = useMemo(() => {
    return obterDuracaoServico(servicoSelecionado);
  }, [servicoSelecionado]);

  const horariosLivres = useMemo(() => {
    if (!data || !funcionarioSelecionado?.id) return [];

    return gerarHorariosDisponiveis({
      dataSelecionada: data,
      funcionarioId: funcionarioSelecionado.id,
      duracaoServico,
      agendamentos,
      horariosBase
    });
  }, [
    data,
    funcionarioSelecionado,
    duracaoServico,
    agendamentos,
    horariosBase
  ]);

  if (!aberto || !cliente) return null;

  const confirmar = async () => {
    if (!servicoSelecionado) {
      alert('Selecione um serviço.');
      return;
    }

    if (!funcionarioSelecionado) {
      alert('Selecione um profissional.');
      return;
    }

    if (!data || !horario) {
      alert('Selecione a data e horário.');
      return;
    }

    const payload = {
      cliente,
      data,
      horario,
      servico: servicoSelecionado,
      funcionario: funcionarioSelecionado,
      duracao_minutos: duracaoServico
    };

    setEnviando(true);

    try {
      if (onConfirmar) {
        await onConfirmar(payload);
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao reagendar cliente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">

      <div className="w-full max-w-3xl bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-4xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative">

        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none"></div>

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
                Horários reais filtrados por serviço, duração e profissional.
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

        <div className="relative z-10 p-6 space-y-6">

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">
                Serviço
              </label>

              <div className="relative">
                <Scissors size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />

                <select
                  value={servicoSelecionado?.id || ''}
                  onChange={(e) => {
                    const servico = servicos.find((item) => String(item.id) === String(e.target.value));
                    setServicoSelecionado(servico || null);
                    setHorario('');
                  }}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                >
                  <option value="">Selecione</option>

                  {servicos.map((servico) => (
                    <option
                      key={servico.id}
                      value={servico.id}
                    >
                      {servico.nome} • {servico.tempo || '60 min'}
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
                  value={funcionarioSelecionado?.id || ''}
                  onChange={(e) => {
                    const funcionario = funcionarios.find((item) => String(item.id) === String(e.target.value));
                    setFuncionarioSelecionado(funcionario || null);
                    setHorario('');
                  }}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                >
                  <option value="">Selecione</option>

                  {funcionarios.map((funcionario) => (
                    <option
                      key={funcionario.id}
                      value={funcionario.id}
                    >
                      {funcionario.nome}
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
                  min={new Date().toISOString().split('T')[0]}
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value);
                    setHorario('');
                  }}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">
                Horário disponível
              </label>

              <div className="relative">
                <Clock3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />

                <select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  disabled={!data || !servicoSelecionado || !funcionarioSelecionado}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none disabled:opacity-50"
                >
                  <option value="">
                    {!data || !servicoSelecionado || !funcionarioSelecionado
                      ? 'Selecione serviço, profissional e data'
                      : horariosLivres.length === 0
                        ? 'Nenhum horário livre'
                        : 'Selecione'}
                  </option>

                  {horariosLivres.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          <div className="bg-[#111] border border-[#2A2A2A] rounded-4xl p-5 space-y-4">

            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#D4AF37]" />

              <h3 className="text-white font-semibold">
                Resumo do reagendamento
              </h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 text-sm">

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
                  {servicoSelecionado?.nome || '-'}
                </p>
              </div>

              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">
                  Profissional
                </p>

                <p className="text-white">
                  {funcionarioSelecionado?.nome || '-'}
                </p>
              </div>

              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">
                  Duração
                </p>

                <p className="text-[#D4AF37]">
                  {duracaoServico} min
                </p>
              </div>

            </div>

          </div>

          <div className="flex flex-col xl:flex-row gap-3 pt-2">

            <button
              onClick={onClose}
              className="flex-1 bg-[#111] border border-[#2A2A2A] hover:border-[#D4AF37]/30 text-white rounded-2xl py-4 font-semibold transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={confirmar}
              disabled={enviando}
              className="flex-1 bg-[#D4AF37] hover:brightness-110 text-[#0D0D0D] rounded-2xl py-4 font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                'Confirmar reagendamento'
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
