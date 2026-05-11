import React, { useMemo, useState } from 'react';
import {
  X,
  User2,
  Calendar,
  Clock3,
  Scissors,
  Briefcase,
  CheckCircle2,
  Plus,
  Pencil,
  Save
} from 'lucide-react';

export default function NovoAgendamentoModal({
  aberto,
  onClose,
  clientes = [],
  funcionarios = [],
  servicos = [],
  horarios = [],
  onSalvar,
  onSalvarCliente
}) {
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteManualAberto, setClienteManualAberto] = useState(false);
  const [clienteForm, setClienteForm] = useState({ nome: '', whatsapp: '', nascimento: '', observacoes: '' });
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [salvandoCliente, setSalvandoCliente] = useState(false);

  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes;

    return clientes.filter((cliente) => {
      const texto = `${cliente.nome || ''} ${cliente.whatsapp || ''}`.toLowerCase();
      return texto.includes(busca.toLowerCase());
    });
  }, [clientes, busca]);

  const valorTotal = servicosSelecionados.reduce((total, servico) => total + Number(servico.preco || 0), 0);

  const converterTempoParaMinutos = (tempo) => {
    const texto = String(tempo || '').toLowerCase().trim();
    const horas = texto.match(/(\d+)\s*h/);
    const minutos = texto.match(/(\d+)\s*(min|m)/);

    if (horas || minutos) {
      const totalHoras = horas ? parseInt(horas[1], 10) * 60 : 0;
      const totalMinutos = minutos ? parseInt(minutos[1], 10) : 0;
      return totalHoras + totalMinutos || 60;
    }

    const numero = parseInt(texto.replace(/\D/g, ''), 10);
    return Number.isNaN(numero) ? 60 : numero;
  };

  const tempoTotal = servicosSelecionados.reduce((total, servico) => {
    return total + converterTempoParaMinutos(servico.tempo);
  }, 0);

  const formatarDuracao = (minutos) => {
    if (!minutos) return '0 min';
    if (minutos < 60) return `${minutos} min`;

    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  if (!aberto) return null;

  const limparFormulario = () => {
    setBusca('');
    setClienteSelecionado(null);
    setClienteManualAberto(false);
    setClienteForm({ nome: '', whatsapp: '', nascimento: '', observacoes: '' });
    setServicosSelecionados([]);
    setFuncionarioSelecionado(null);
    setData('');
    setHorario('');
  };

  const selecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setClienteForm({
      nome: cliente.nome || '',
      whatsapp: cliente.whatsapp || '',
      nascimento: cliente.nascimento || '',
      observacoes: cliente.observacoes || ''
    });
    setClienteManualAberto(true);
  };

  const abrirNovoCliente = () => {
    setClienteSelecionado(null);
    setClienteForm({ nome: '', whatsapp: '', nascimento: '', observacoes: '' });
    setClienteManualAberto(true);
  };

  const salvarClienteManual = async () => {
    if (!clienteForm.nome.trim()) {
      alert('Informe o nome do cliente.');
      return;
    }

    setSalvandoCliente(true);

    try {
      const clienteSalvo = onSalvarCliente
        ? await onSalvarCliente({
            nome: clienteForm.nome.trim(),
            whatsapp: clienteForm.whatsapp || '',
            nascimento: clienteForm.nascimento || '',
            observacoes: clienteForm.observacoes || ''
          })
        : { ...clienteForm };

      const clienteFinal = clienteSalvo || { ...clienteForm };
      setClienteSelecionado(clienteFinal);
      setClienteForm({
        nome: clienteFinal.nome || clienteForm.nome,
        whatsapp: clienteFinal.whatsapp || clienteForm.whatsapp,
        nascimento: clienteFinal.nascimento || clienteForm.nascimento,
        observacoes: clienteFinal.observacoes || clienteForm.observacoes
      });
      alert('Cliente salvo e selecionado para o agendamento.');
    } catch (error) {
      console.error(error);
      alert(error?.message || 'Erro ao salvar cliente.');
    } finally {
      setSalvandoCliente(false);
    }
  };

  const toggleServico = (servico) => {
    setServicosSelecionados((atuais) => {
      const existe = atuais.some(item => Number(item.id) === Number(servico.id));
      if (existe) return atuais.filter(item => Number(item.id) !== Number(servico.id));
      return [...atuais, servico];
    });
  };

  const salvar = async () => {
    const clienteFinal = clienteSelecionado || {
      nome: clienteForm.nome,
      whatsapp: clienteForm.whatsapp,
      nascimento: clienteForm.nascimento,
      observacoes: clienteForm.observacoes
    };

    if (!clienteFinal.nome || servicosSelecionados.length === 0 || !data || !horario) {
      alert('Preencha cliente, serviço, data e horário.');
      return;
    }

    if (funcionarios.length > 0 && !funcionarioSelecionado) {
      alert('Selecione um profissional.');
      return;
    }

    setSalvando(true);

    try {
      await onSalvar({
        cliente: clienteFinal,
        servicosSelecionados,
        servico: servicosSelecionados[0],
        funcionario: funcionarioSelecionado,
        data,
        horario
      });

      limparFormulario();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error?.message || 'Erro ao salvar agendamento.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6">
      <div className="bg-[#111] w-full lg:max-w-4xl rounded-t-[2.5rem] lg:rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Recepção</p>
            <h2 className="text-3xl font-['Playfair_Display'] text-white">Novo Agendamento</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A8A8A8]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-7">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <label className="text-xs uppercase tracking-widest text-[#A8A8A8] block">Cliente</label>
              <button
                type="button"
                onClick={abrirNovoCliente}
                className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={14} /> Cadastrar novo
              </button>
            </div>

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

            <div className="mt-3 space-y-2 max-h-52 overflow-y-auto">
              {clientesFiltrados.length === 0 ? (
                <p className="text-[#6F6F6F] text-sm border border-dashed border-[#2A2A2A] rounded-2xl p-4 text-center">
                  Nenhum cliente encontrado. Cadastre um novo acima.
                </p>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <button
                    type="button"
                    key={cliente.id || cliente.whatsapp || cliente.nome}
                    onClick={() => selecionarCliente(cliente)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      clienteSelecionado?.id === cliente.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#2A2A2A] bg-[#1A1A1A]'
                    }`}
                  >
                    <p className="text-white font-medium">{cliente.nome}</p>
                    <p className="text-[#8A8A8A] text-sm mt-1">{cliente.whatsapp || 'WhatsApp não informado'}</p>
                  </button>
                ))
              )}
            </div>

            {clienteManualAberto && (
              <div className="mt-4 bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <Pencil size={14} /> {clienteSelecionado ? 'Editar dados do cliente' : 'Cadastrar cliente'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={clienteForm.nome}
                    onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })}
                    className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-4 text-white outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp / telefone"
                    value={clienteForm.whatsapp}
                    onChange={(e) => setClienteForm({ ...clienteForm, whatsapp: e.target.value })}
                    className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-4 text-white outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="date"
                    value={clienteForm.nascimento || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, nascimento: e.target.value })}
                    className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-4 text-white outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    placeholder="Observações"
                    value={clienteForm.observacoes || ''}
                    onChange={(e) => setClienteForm({ ...clienteForm, observacoes: e.target.value })}
                    className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-4 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="button"
                  onClick={salvarClienteManual}
                  disabled={salvandoCliente}
                  className="w-full bg-[#1A1A1A] border border-[#D4AF37]/40 text-[#D4AF37] rounded-2xl py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save size={16} /> {salvandoCliente ? 'Salvando...' : 'Salvar cliente'}
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">Serviços</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {servicos.map((servico) => {
                const selecionado = servicosSelecionados.some(item => Number(item.id) === Number(servico.id));

                return (
                  <button
                    type="button"
                    key={servico.id}
                    onClick={() => toggleServico(servico)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selecionado
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#2A2A2A] bg-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Scissors size={18} className="text-[#D4AF37]" />
                      <p className="text-white font-medium">{servico.nome}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8A8A8A] text-sm">{servico.tempo || '60 min'}</span>
                      <span className="text-[#D4AF37] font-bold">R$ {Number(servico.preco || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {servicosSelecionados.length > 0 && (
              <div className="mt-4 bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-2xl p-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest">Tempo total</p>
                  <p className="text-white text-xl font-bold mt-1">{formatarDuracao(tempoTotal)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#8A8A8A] text-[10px] uppercase tracking-widest">Valor total</p>
                  <p className="text-[#D4AF37] text-xl font-bold mt-1">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">Profissional</label>
            {funcionarios.length === 0 ? (
              <div className="p-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] text-[#A8A8A8] text-sm">
                Nenhum profissional cadastrado. O agendamento será salvo na equipe geral.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {funcionarios.map((funcionario) => (
                  <button
                    type="button"
                    key={funcionario.id}
                    onClick={() => setFuncionarioSelecionado(funcionario)}
                    className={`p-4 rounded-2xl border transition-all ${
                      funcionarioSelecionado?.id === funcionario.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#2A2A2A] bg-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-[#D4AF37]" />
                      <span className="text-white font-medium text-sm">{funcionario.nome}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">Data</label>
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl px-5 flex items-center gap-3">
              <Calendar size={18} className="text-[#D4AF37]" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="bg-transparent w-full h-14 outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#A8A8A8] mb-3 block">Horário</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-h-72 overflow-y-auto pr-1">
              {horarios.map((hora) => (
                <button
                  type="button"
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

        <div className="p-6 border-t border-[#2A2A2A]">
          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="w-full h-16 rounded-2xl bg-[#D4AF37] text-[#0D0D0D] font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.35)] disabled:opacity-60"
          >
            <CheckCircle2 size={20} />
            {salvando ? 'Salvando...' : 'Salvar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
