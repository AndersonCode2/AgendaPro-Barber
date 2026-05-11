import React, { useEffect, useMemo, useState } from 'react';
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
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!aberto || !cliente) return;

    const servicoFavorito = cliente?.servico_favorito || cliente?.ultimo_servico || '';
    const servicoInicial = servicos.find((servico) => servico.nome === servicoFavorito) || servicos[0] || null;

    const profissionalPreferido = cliente?.profissional_preferido || '';
    const funcionarioInicial = funcionarios.find((funcionario) => funcionario.nome === profissionalPreferido) || funcionarios[0] || null;

    setData('');
    setHorario('');
    setServicoSelecionado(servicoInicial);
    setFuncionarioSelecionado(funcionarioInicial);
    setEnviando(false);
  }, [aberto, cliente, servicos, funcionarios]);

  const duracaoServico = useMemo(() => {
    return obterDuracaoServico(servicoSelecionado);
  }, [servicoSelecionado]);

  const horariosLivres = useMemo(() => {
    if (!data || !servicoSelecionado) return [];

    if (funcionarios.length === 0) {
      return Array.isArray(horariosBase) ? horariosBase : [];
    }

    if (!funcionarioSelecionado?.id) return [];

    return gerarHorariosDisponiveis({
      dataSelecionada: data,
      funcionarioId: funcionarioSelecionado.id,
      duracaoServico,
      agendamentos,
      horariosBase
    });
  }, [data, funcionarioSelecionado, servicoSelecionado, duracaoServico, agendamentos, horariosBase, funcionarios.length]);

  if (!aberto || !cliente) return null;

  const confirmar = async () => {
    if (!servicoSelecionado || !data || !horario) {
      alert('Selecione serviço, data e horário.');
      return;
    }

    if (funcionarios.length > 0 && !funcionarioSelecionado) {
      alert('Selecione um profissional.');
      return;
    }

    setEnviando(true);

    try {
      await onConfirmar({
        cliente,
        data,
        horario,
        servico: servicoSelecionado,
        funcionario: funcionarioSelecionado,
        duracao_minutos: duracaoServico
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert(error?.message || 'Erro ao reagendar cliente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6">
      <div className="bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-t-[2.5rem] lg:rounded-[2.5rem] w-full lg:max-w-4xl max-h-[92vh] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.7)] animate-slide-up">
        <div className="p-6 border-b border-[#2A2A2A] flex items-start justify-between gap-4">
          <div>
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Agenda Inteligente</p>
            <h2 className="text-3xl font-['Playfair_Display'] text-white">Reagendar Cliente</h2>
            <p className="text-[#8A8A8A] text-sm mt-2">Escolha serviço, profissional, data e horário sem conflito.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2A2A2A] flex items-center justify-center text-[#8A8A8A] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          <div className="bg-[#111] border border-[#2A2A2A] rounded-3xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center">
              <UserRound size={28} className="text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-lg truncate">{cliente.nome}</p>
              <p className="text-[#8A8A8A] text-sm">{cliente.whatsapp || 'WhatsApp não informado'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">Serviço</label>
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
                    <option key={servico.id} value={servico.id}>
                      {servico.nome} • {servico.tempo || '60 min'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">Profissional</label>
              <div className="relative">
                <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <select
                  value={funcionarioSelecionado?.id || ''}
                  onChange={(e) => {
                    const funcionario = funcionarios.find((item) => String(item.id) === String(e.target.value));
                    setFuncionarioSelecionado(funcionario || null);
                    setHorario('');
                  }}
                  disabled={funcionarios.length === 0}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none disabled:opacity-60"
                >
                  {funcionarios.length === 0 ? (
                    <option value="">Equipe geral</option>
                  ) : (
                    <option value="">Selecione</option>
                  )}
                  {funcionarios.map((funcionario) => (
                    <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">Data</label>
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
              <label className="text-[#8A8A8A] text-xs uppercase tracking-widest">Horário disponível</label>
              <div className="relative">
                <Clock3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  disabled={!data || !servicoSelecionado || (funcionarios.length > 0 && !funcionarioSelecionado)}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white outline-none disabled:opacity-50"
                >
                  <option value="">
                    {!data || !servicoSelecionado
                      ? 'Selecione serviço e data'
                      : horariosLivres.length === 0
                        ? 'Nenhum horário livre'
                        : 'Selecione'}
                  </option>
                  {horariosLivres.map((hora) => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#2A2A2A] rounded-4xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#D4AF37]" />
              <h3 className="text-white font-semibold">Resumo do reagendamento</h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">Cliente</p>
                <p className="text-white">{cliente?.nome}</p>
              </div>
              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">Serviço</p>
                <p className="text-white">{servicoSelecionado?.nome || '-'}</p>
              </div>
              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">Profissional</p>
                <p className="text-white">{funcionarioSelecionado?.nome || 'Equipe geral'}</p>
              </div>
              <div>
                <p className="text-[#6F6F6F] uppercase tracking-widest text-[10px] mb-1">Duração</p>
                <p className="text-[#D4AF37]">{duracaoServico} min</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#111] border border-[#2A2A2A] hover:border-[#D4AF37]/30 text-white rounded-2xl py-4 font-semibold transition-all"
            >
              Cancelar
            </button>

            <button
              type="button"
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
