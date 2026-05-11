import React, { useMemo, useState } from 'react';
import {
  X,
  User2,
  Calendar,
  Clock3,
  Scissors,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

export default function NovoAgendamentoModal({
  aberto,
  onClose,
  clientes = [],
  funcionarios = [],
  servicos = [],
  horarios = [],
  onSalvar
}) {

  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

  const clientesFiltrados = useMemo(() => {

    if (!busca) return clientes;

    return clientes.filter((cliente) =>
      cliente.nome?.toLowerCase().includes(busca.toLowerCase())
    );

  }, [clientes, busca]);

  if (!aberto) return null;

  const salvar = async () => {

    if (
      !clienteSelecionado ||
      !servicoSelecionado ||
      !funcionarioSelecionado ||
      !data ||
      !horario
    ) {
      alert('Preencha todas as informações.');
      return;
    }

    await onSalvar({
      cliente: clienteSelecionado,
      servico: servicoSelecionado,
      funcionario: funcionarioSelecionado,
      data,
      horario
    });

    onClose();

    setBusca('');
    setClienteSelecionado(null);
    setServicoSelecionado(null);
    setFuncionarioSelecionado(null);
    setData('');
    setHorario('');
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6">

      <div className="bg-[#111] w-full lg:max-w-3xl rounded-t-[2.5rem] lg:rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden animate-slide-up">

        {/* HEADER */}
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">

          <div>

            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
              Recepção
            </p>

            <h2 className="text-3xl font-['Playfair_Display'] text-white">
              Novo Agendamento
            </h2>

          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A8A8A8]"
          >
            <X size={18} />
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-7">

          {/* CLIENTE */}
          <div>

            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">
              Cliente
            </label>

            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl px-5 flex items-center gap-3">

              <User2 size={18} className="text-[#D4AF37]" />

              <input
                type="text"
                placeholder="Pesquisar cliente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-transparent w-full h-14 outline-none text-white"
              />

            </div>

            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">

              {clientesFiltrados.map((cliente) => (

                <button
                  key={cliente.id}
                  onClick={() => setClienteSelecionado(cliente)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    clienteSelecionado?.id === cliente.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2A2A2A] bg-[#1A1A1A]'
                  }`}
                >

                  <p className="text-white font-medium">
                    {cliente.nome}
                  </p>

                  <p className="text-[#8A8A8A] text-sm mt-1">
                    {cliente.whatsapp}
                  </p>

                </button>

              ))}

            </div>

          </div>

          {/* SERVIÇO */}
          <div>

            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">
              Serviço
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {servicos.map((servico) => (

                <button
                  key={servico.id}
                  onClick={() => setServicoSelecionado(servico)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    servicoSelecionado?.id === servico.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2A2A2A] bg-[#1A1A1A]'
                  }`}
                >

                  <div className="flex items-center gap-3 mb-3">

                    <Scissors
                      size={18}
                      className="text-[#D4AF37]"
                    />

                    <p className="text-white font-medium">
                      {servico.nome}
                    </p>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-[#8A8A8A] text-sm">
                      {servico.tempo}
                    </span>

                    <span className="text-[#D4AF37] font-bold">
                      R$ {Number(servico.preco).toFixed(2)}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* PROFISSIONAL */}
          <div>

            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">
              Profissional
            </label>

            <div className="grid grid-cols-2 gap-3">

              {funcionarios.map((funcionario) => (

                <button
                  key={funcionario.id}
                  onClick={() => setFuncionarioSelecionado(funcionario)}
                  className={`p-4 rounded-2xl border transition-all ${
                    funcionarioSelecionado?.id === funcionario.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2A2A2A] bg-[#1A1A1A]'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <Briefcase
                      size={16}
                      className="text-[#D4AF37]"
                    />

                    <span className="text-white font-medium text-sm">
                      {funcionario.nome}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* DATA */}
          <div>

            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">
              Data
            </label>

            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl px-5 flex items-center gap-3">

              <Calendar size={18} className="text-[#D4AF37]" />

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="bg-transparent w-full h-14 outline-none text-white"
              />

            </div>

          </div>

          {/* HORÁRIOS */}
          <div>

            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">
              Horário
            </label>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">

              {horarios.map((hora) => (

                <button
                  key={hora}
                  onClick={() => setHorario(hora)}
                  className={`h-14 rounded-2xl border font-bold transition-all ${
                    horario === hora
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0D0D0D]'
                      : 'border-[#2A2A2A] bg-[#1A1A1A] text-white'
                  }`}
                >

                  <div className="flex items-center justify-center gap-2">

                    <Clock3 size={14} />

                    {hora}

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#2A2A2A]">

          <button
            onClick={salvar}
            className="w-full h-16 rounded-2xl bg-[#D4AF37] text-[#0D0D0D] font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.35)]"
          >

            <CheckCircle2 size={20} />

            Salvar Agendamento

          </button>

        </div>

      </div>

    </div>
  );
}