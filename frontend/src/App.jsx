import React, { useState, useEffect } from 'react';
import { Shield, Calendar, PlusCircle, Loader2 } from 'lucide-react';
import PaginaCliente from './PaginaCliente';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

function PainelMasterCEO() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/profissionais`);
      const data = await res.json();
      setEmpresas(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmpresas(); }, []);

  const add30Dias = async (id) => {
    if(!window.confirm("Confirmar renovação de +30 dias?")) return;
    const res = await fetch(`${API_URL}/admin/renovar-plano`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profissional_id: id })
    });
    if(res.ok) { alert("Sucesso!"); fetchEmpresas(); }
  };

  if(loading) return <div className="flex h-screen bg-black items-center justify-center text-[#D4AF37]"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <h1 className="text-[#D4AF37] text-3xl font-serif mb-8 flex items-center gap-3"><Shield /> Master CEO</h1>
      <div className="grid gap-4 max-w-4xl mx-auto">
        {empresas.map(e => (
          <div key={e.id} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] flex justify-between items-center transition-all hover:border-[#D4AF37]/30">
            <div>
              <h3 className="text-xl font-bold">{e.nome}</h3>
              <p className="text-gray-500 text-sm">{e.email}</p>
              <div className="mt-3 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-[#D4AF37]/20 w-fit">
                <Calendar size={14} className="text-[#D4AF37]" />
                <span className="text-[10px] font-bold">VENCIMENTO: {e.data_vencimento ? new Date(e.data_vencimento).toLocaleDateString('pt-BR') : '---'}</span>
              </div>
            </div>
            <button onClick={() => add30Dias(e.id)} className="bg-[#D4AF37] text-black p-4 rounded-2xl hover:scale-105 transition-transform"><PlusCircle /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [usuario] = useState(JSON.parse(localStorage.getItem('aurum_usuario') || 'null'));
  const caminho = window.location.pathname;

  if (caminho.startsWith('/agendar/')) return <PaginaCliente />;
  if (usuario?.is_ceo) return <PainelMasterCEO />;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white">
      <p className="font-serif">Painel AURUM Online.</p>
    </div>
  );
}