import React, { useState } from 'react';
import { X } from 'lucide-react';

const API_URL = 'https://aurum-api-mdmq.onrender.com/api';

export default function NovoClienteModal({
  aberto,
  onClose,
  token,
  onClienteCriado
}) {

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const salvarCliente = async () => {

    if (!nome) {
      return alert('Digite o nome');
    }

    try {

      const res = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          whatsapp,
          nascimento,
          observacoes
        })
      });

      const data = await res.json();

      onClienteCriado(data);

      onClose();

      setNome('');
      setWhatsapp('');
      setNascimento('');
      setObservacoes('');

    } catch (error) {
      console.log(error);
      alert('Erro ao cadastrar');
    }
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">

      <div className="bg-[#111] border border-[#2A2A2A] rounded-[30px] p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-6">

          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase">
              CRM
            </p>

            <h2 className="text-white text-3xl font-['Playfair_Display']">
              Novo Cliente
            </h2>
          </div>

          <button
            onClick={onClose}
            className="bg-[#1A1A1A] p-3 rounded-full"
          >
            <X size={18} className="text-white" />
          </button>

        </div>

        <div className="space-y-4">

          <input
            placeholder="Nome da cliente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 rounded-2xl text-white"
          />

          <input
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 rounded-2xl text-white"
          />

          <input
            placeholder="Nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 rounded-2xl text-white"
          />

          <textarea
            placeholder="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-4 rounded-2xl text-white min-h-[100px]"
          />

          <button
            onClick={salvarCliente}
            className="w-full bg-[#D4AF37] text-[#0D0D0D] py-5 rounded-2xl font-bold tracking-[0.2em]"
          >
            SALVAR CLIENTE
          </button>

        </div>

      </div>

    </div>
  );
}
