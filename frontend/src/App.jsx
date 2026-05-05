/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import PaginaCliente from './PaginaCliente';

// COMPONENTE SIMPLIFICADO DE LOGIN PARA O APP.JSX
function TelaLogin({ onLogin }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-[#D4AF37] text-4xl font-serif mb-8">AURUM LOGIN</h1>
      <button 
        onClick={() => onLogin("fake-token", {nome: "Anderson Admin", id: 1, is_ceo: true})}
        className="bg-[#D4AF37] text-black px-10 py-4 rounded-full font-bold"
      >
        ENTRAR NO PAINEL
      </button>
    </div>
  );
}

function SistemaPrincipal() {
  const [token, setToken] = useState(localStorage.getItem('aurum_token'));
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('aurum_usuario') || 'null'));

  if (token && usuario) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white p-10">
        <h1 className="text-[#D4AF37] text-2xl">Olá, {usuario.nome}</h1>
        <p className="mt-4">Seu sistema AURUM está operacional.</p>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="mt-10 text-red-500 underline"
        >
          Sair do Sistema
        </button>
      </div>
    );
  }

  return <TelaLogin onLogin={(t, u) => {
    localStorage.setItem('aurum_token', t);
    localStorage.setItem('aurum_usuario', JSON.stringify(u));
    setToken(t); setUsuario(u);
  }} />;
}

export default function App() {
  const caminho = window.location.pathname;

  // ROTEAMENTO MANUAL PARA O LINK DE AGENDAMENTO
  if (caminho.startsWith('/agendar/')) {
    const idSalao = caminho.split('/').filter(Boolean).pop();
    return <PaginaCliente id={idSalao} />;
  }

  return <SistemaPrincipal />;
}