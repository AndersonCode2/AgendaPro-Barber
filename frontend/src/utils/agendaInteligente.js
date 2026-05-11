export function horaParaMinutos(hora) {
  if (!hora || typeof hora !== 'string') return 0;

  const [h, m] = hora.split(':').map(Number);

  return (h || 0) * 60 + (m || 0);
}

export function minutosParaHora(minutos) {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');

  return `${h}:${m}`;
}

export function converterTempoParaMinutos(tempoServico) {
  const texto = String(tempoServico || '').toLowerCase().trim();

  const horas = texto.match(/(\d+)\s*h/);
  const minutos = texto.match(/(\d+)\s*(min|m)/);

  if (horas || minutos) {
    const totalHoras = horas ? parseInt(horas[1], 10) * 60 : 0;
    const totalMinutos = minutos ? parseInt(minutos[1], 10) : 0;

    return totalHoras + totalMinutos;
  }

  const numero = parseInt(texto.replace(/\D/g, ''), 10);

  return Number.isNaN(numero) ? 60 : numero;
}

export function normalizarData(data) {
  if (!data) return '';

  if (String(data).includes('/')) {
    const [dia, mes, ano] = String(data).split('/');
    return `${ano}-${mes}-${dia}`;
  }

  return String(data).split('T')[0];
}

export function obterDuracaoServico(servico) {
  if (!servico) return 60;

  if (servico.duracao_minutos) {
    return Number(servico.duracao_minutos) || 60;
  }

  if (servico.tempo) {
    return converterTempoParaMinutos(servico.tempo);
  }

  return 60;
}

export function montarIntervalosOcupados({
  agendamentos = [],
  dataSelecionada,
  funcionarioId
}) {
  const dataRef = normalizarData(dataSelecionada);

  return agendamentos
    .filter((ag) => {
      const dataAg =
        normalizarData(
          ag.data_reserva ||
          ag.data_agendamento ||
          ag.data ||
          ag.created_at
        );

      const mesmaData = dataAg === dataRef;

      const mesmoFuncionario =
        funcionarioId
          ? Number(ag.funcionario_id) === Number(funcionarioId)
          : true;

      const statusValido =
        !ag.status ||
        !['cancelado', 'cancelada'].includes(String(ag.status).toLowerCase());

      return mesmaData && mesmoFuncionario && statusValido;
    })
    .map((ag) => {
      const inicio = horaParaMinutos(ag.horario);

      const duracao =
        Number(ag.duracao_minutos) ||
        Number(ag.duracao) ||
        60;

      const fim =
        ag.horario_fim
          ? horaParaMinutos(ag.horario_fim)
          : inicio + duracao;

      return {
        inicio,
        fim,
        agendamento: ag
      };
    });
}

export function gerarHorariosDisponiveis({
  dataSelecionada,
  funcionarioId,
  duracaoServico = 60,
  agendamentos = [],
  horariosBase = []
}) {
  if (!dataSelecionada || !funcionarioId) return [];

  const horarios = Array.isArray(horariosBase) && horariosBase.length > 0
    ? horariosBase
    : [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00'
      ];

  const intervalosOcupados = montarIntervalosOcupados({
    agendamentos,
    dataSelecionada,
    funcionarioId
  });

  const ultimoHorario = horarios[horarios.length - 1];
  const limiteFimExpediente = horaParaMinutos(ultimoHorario) + 60;

  return horarios.filter((horario) => {
    const inicio = horaParaMinutos(horario);
    const fim = inicio + Number(duracaoServico || 60);

    if (fim > limiteFimExpediente) {
      return false;
    }

    const conflito = intervalosOcupados.some((intervalo) => {
      return inicio < intervalo.fim && fim > intervalo.inicio;
    });

    return !conflito;
  });
}

export function profissionaisDisponiveisNoHorario({
  dataSelecionada,
  horario,
  duracaoServico = 60,
  funcionarios = [],
  agendamentos = []
}) {
  if (!dataSelecionada || !horario) return [];

  const inicio = horaParaMinutos(horario);
  const fim = inicio + Number(duracaoServico || 60);

  return funcionarios.filter((funcionario) => {
    const intervalos = montarIntervalosOcupados({
      agendamentos,
      dataSelecionada,
      funcionarioId: funcionario.id
    });

    const conflito = intervalos.some((intervalo) => {
      return inicio < intervalo.fim && fim > intervalo.inicio;
    });

    return !conflito;
  });
}
