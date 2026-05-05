import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shield, Calendar, PlusCircle, LogOut, Loader2, Home, DollarSign, UsersRound, Settings } from 'lucide-react';
import PaginaCliente from './PaginaCliente';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

function PainelProfissional({ usuario, onLogout }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
        <div>
          <h1 className="text-[#D4AF37] text-2xl font-serif">AURUM</h1>
          <p className="text-[10px] text-gray-500 uppercase">Olá, {usuario.nome}</p>
        </div>
        <button onClick={onLogout} className="text-red-500"><LogOut /></button>
      </header>
      <main className="p-6 grid grid-cols-2 gap-4">
        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] text-center"><Calendar className="mx-auto mb-2 text-[#D4AF37]" /><p className="text-xs font-bold">AGENDA</p></div>
        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] text-center"><DollarSign className="mx-auto mb-2 text-[#D4AF37]" /><p className="text-xs font-bold">CAIXA</p></div>
      </main>
    </div>
  );
}

function PainelMasterCEO({ onLogout }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/profissionais`);
      const data = await res.json();
      setEmpresas(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, []);

  const renovar = async (id) => {
    if(!window.confirm("Renovar +30 dias?")) return;
    await fetch(`${API_URL}/admin/renovar`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
    carregar();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[#D4AF37] text-3xl font-serif flex items-center gap-2"><Shield /> Master CEO</h1>
        <button onClick={onLogout} className="text-red-500"><LogOut /></button>
      </header>
      {loading ? <Loader2 className="animate-spin mx-auto text-[#D4AF37]" /> : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {empresas.map(e => (
            <div key={e.id} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#2A2A2A] flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{e.nome}</p>
                <div className="bg-black/40 px-3 py-1 rounded-full border border-[#D4AF37]/20 w-fit mt-2">
                  <span className="text-[10px] font-bold text-[#D4AF37]">VENCE EM: {e.data_vencimento ? new Date(e.data_vencimento).toLocaleDateString('pt-BR') : '---'}</span>
                </div>
              </div>
              <button onClick={() => renovar(e.id)} className="bg-[#D4AF37] text-black p-4 rounded-2xl transition-all active:scale-90 shadow-lg shadow-[#D4AF37]/10"><PlusCircle /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('aurum_token'));
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('aurum_usuario') || 'null'));

  const logout = () => { localStorage.clear(); setToken(null); setUsuario(null); window.location.reload(); };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agendar/:id_profissional" element={<PaginaCliente />} />
        <Route path="/" element={
          !token ? (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-[#D4AF37] text-7xl font-serif mb-12 tracking-tighter">AURUM</h1>
              <div className="space-y-4 w-full max-w-xs">
                <button onClick={() => { const u = {nome: "CEO Master", is_ceo: true}; localStorage.setItem('aurum_token', 'demo'); localStorage.setItem('aurum_usuario', JSON.stringify(u)); setToken('demo'); setUsuario(u); }} className="w-full bg-[#D4AF37] text-black py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl">Acessar Master CEO</button>
                <button onClick={() => { const u = {nome: "Barbeiro", is_ceo: false}; localStorage.setItem('aurum_token', 'demo'); localStorage.setItem('aurum_usuario', JSON.stringify(u)); setToken('demo'); setUsuario(u); }} className="w-full border border-[#2A2A2A] text-white py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Acessar Painel Barbeiro</button>
              </div>
            </div>
          ) : (
            usuario?.is_ceo ? <PainelMasterCEO onLogout={logout} /> : <PainelProfissional usuario={usuario} onLogout={logout} />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}