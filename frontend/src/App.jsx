import React, { useState, useEffect } from 'react';
import { Shield, Calendar, PlusCircle, Loader2, LogOut } from 'lucide-react';
import PaginaCliente from './PaginaCliente';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

function PainelMasterCEO({ onLogout }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/empresas`);
      const data = await res.json();
      setEmpresas(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmpresas(); }, []);

  const renovar = async (id) => {
    if(!window.confirm("Confirmar renovação de +30 dias?")) return;
    const res = await fetch(`${API_URL}/admin/renovar-plano`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profissional_id: id })
    });
    if(res.ok) { alert("Plano Renovado!"); fetchEmpresas(); }
  };

  if(loading) return <div className="flex h-screen bg-black items-center justify-center text-[#D4AF37]"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-[#D4AF37] text-3xl font-serif flex items-center gap-3"><Shield /> Master CEO</h1>
          <button onClick={onLogout} className="text-red-500 text-xs font-bold flex items-center gap-2 uppercase tracking-widest"><LogOut size={16}/> Sair</button>
        </div>
        <div className="grid gap-4">
          {empresas.map(e => (
            <div key={e.id} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{e.nome}</h3>
                <p className="text-gray-500 text-sm">{e.email}</p>
                <div className="mt-3 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-[#D4AF37]/20 w-fit">
                  <Calendar size={14} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-bold">VENCIMENTO: {e.data_vencimento ? new Date(e.data_vencimento).toLocaleDateString('pt-BR') : '---'}</span>
                </div>
              </div>
              <button onClick={() => renovar(e.id)} className="bg-[#D4AF37] text-black p-4 rounded-2xl hover:scale-105 transition-transform"><PlusCircle /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('aurum_token'));
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('aurum_usuario') || 'null'));

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUsuario(null);
    window.location.reload();
  };

  const caminho = window.location.pathname;
  if (caminho.startsWith('/agendar/')) return <PaginaCliente />;

  if (token && usuario?.is_ceo) return <PainelMasterCEO onLogout={logout} />;

  // Se não estiver logado, exibe botão de login (simulação para seu sistema)
  if (!token) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <button 
        onClick={() => { 
          localStorage.setItem('aurum_token', 'ok'); 
          localStorage.setItem('aurum_usuario', JSON.stringify({nome: "Master CEO", is_ceo: true}));
          window.location.reload();
        }}
        className="bg-[#D4AF37] text-black px-10 py-4 rounded-full font-bold"
      >
        ENTRAR NO AURUM
      </button>
    </div>
  );

  return <div className="text-white text-center p-10">Acesse o painel via link profissional.</div>;
}