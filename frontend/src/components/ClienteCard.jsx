import React from 'react';
import {
  MessageCircle,
  History,
  CalendarPlus,
  Crown,
  Star,
  UserRound,
  Phone,
  Clock,
  Wallet,
  BadgeCheck
} from 'lucide-react';

export default function ClienteCard({
  cliente,
  onHistorico,
  onReagendar
}) {
  const nome = cliente?.nome || 'Cliente sem nome';
  const whatsapp = cliente?.whatsapp || '';
  const telefoneLimpo = whatsapp.replace(/\D/g, '');

  const totalVisitas = Number(cliente?.total_visitas || 0);
  const totalGasto = Number(cliente?.total_gasto || cliente?.valor_total || 0);

  const ultimaVisita = cliente?.ultima_visita
    ? new Date(cliente.ultima_visita).toLocaleDateString('pt-BR')
    : 'Sem visitas';

  const servicoFavorito =
    cliente?.servico_favorito ||
    cliente?.ultimo_servico ||
    cliente?.servico_nome ||
    'Ainda não identificado';

  const primeiroNome = nome.split(' ')[0];

  const calcularStatus = () => {
    if (totalGasto >= 1000 || totalVisitas >= 10) {
      return {
        texto: 'VIP',
        icone: <Crown size={13} />,
        classe: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40'
      };
    }

    if (totalVisitas >= 4) {
      return {
        texto: 'Frequente',
        icone: <BadgeCheck size={13} />,
        classe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      };
    }

    return {
      texto: 'Novo',
      icone: <Star size={13} />,
      classe: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
    };
  };

  const status = calcularStatus();

  const mensagemWhatsApp = encodeURIComponent(
    `Olá ${primeiroNome}! Tudo bem?`
  );

  const numeroWhatsApp = telefoneLimpo.startsWith('55') ? telefoneLimpo : `55${telefoneLimpo}`;

  const linkWhatsApp = telefoneLimpo
    ? `https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}`
    : '#';

  return (
    <div className="group bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] hover:border-[#D4AF37]/50 rounded-4xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 relative overflow-hidden">

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center">
            <UserRound size={26} className="text-[#D4AF37]" />
          </div>

          <div className="min-w-0">
            <h3 className="text-white font-bold text-lg truncate">
              {nome}
            </h3>

            <p className="text-[#8A8A8A] text-xs flex items-center gap-1 mt-1 truncate">
              <Phone size={12} />
              {whatsapp || 'WhatsApp não informado'}
            </p>
          </div>
        </div>

        <div className={`shrink-0 border px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${status.classe}`}>
          {status.icone}
          {status.texto}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-[#6F6F6F] text-[10px] uppercase tracking-widest mb-1">
            Visitas
          </p>

          <p className="text-white text-2xl font-bold">
            {totalVisitas}
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-[#6F6F6F] text-[10px] uppercase tracking-widest mb-1">
            Total gasto
          </p>

          <p className="text-[#D4AF37] text-xl font-['Playfair_Display']">
            R$ {totalGasto.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#8A8A8A] text-xs flex items-center gap-2">
            <Clock size={14} className="text-[#D4AF37]" />
            Última visita
          </span>

          <span className="text-white text-xs font-medium">
            {ultimaVisita}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[#8A8A8A] text-xs flex items-center gap-2">
            <Wallet size={14} className="text-[#D4AF37]" />
            Serviço favorito
          </span>

          <span className="text-white text-xs font-medium text-right truncate max-w-37.5">
            {servicoFavorito}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-5">
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
        >
          <MessageCircle size={14} />
          Whats
        </a>

        <button
          type="button"
          onClick={() => onHistorico && onHistorico(cliente)}
          className="rounded-2xl py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-[#111] text-[#D4AF37] border border-[#2A2A2A]"
        >
          <History size={14} />
          Histórico
        </button>

        <button
          type="button"
          onClick={() => onReagendar && onReagendar(cliente)}
          className="rounded-2xl py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0D0D0D]"
        >
          <CalendarPlus size={14} />
          Agendar
        </button>
      </div>
    </div>
  );
}
