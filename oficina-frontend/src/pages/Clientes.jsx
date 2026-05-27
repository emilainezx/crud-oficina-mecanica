import { useEffect, useState } from "react";
import { api } from "../services/api";
import { UserPlus, Pencil, Trash } from "@phosphor-icons/react";

export function Clientes() {
  const [clientes, setClientes] = useState([]);

  // Busca os clientes no seu back-end assim que a tela abre
  useEffect(() => {
    api.get("/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Erro ao buscar clientes:", error));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Meus Clientes</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all">
          <UserPlus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Telefone</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  Nenhum cliente cadastrado no banco de dados ainda.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{cliente.nome}</td>
                  <td className="p-4 text-slate-600">{cliente.telefone}</td>
                  <td className="p-4 text-slate-600">{cliente.email}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded"><Pencil size={20} /></button>
                    <button className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded"><Trash size={20} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}