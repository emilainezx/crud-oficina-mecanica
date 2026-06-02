import { useEffect, useState } from "react";
import { api } from "../services/api";
import { UserPlus, Pencil, Trash, X } from "@phosphor-icons/react";

export function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null); // Guarda o ID se estivermos editando
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: ""
  });

  function carregarClientes() {
    api.get("/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Erro ao buscar clientes:", error));
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  // Abre o modal limpo para um NOVO cliente
  function abrirModalNovo() {
    setFormData({ nome: "", telefone: "", email: "" });
    setIdEdicao(null);
    setIsModalOpen(true);
  }

  // Abre o modal preenchido para EDITAR um cliente existente
  function abrirModalEdicao(cliente) {
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email
    });
    setIdEdicao(cliente.id);
    setIsModalOpen(true);
  }

  // Função central: Salva (POST) ou Atualiza (PUT)
  async function handleSalvar(e) {
    e.preventDefault();
    try {
      if (idEdicao) {
        // Se tem ID, é porque estamos atualizando
        await api.put(`/clientes/${idEdicao}`, formData);
      } else {
        // Se não tem ID, é cliente novo
        await api.post("/clientes", formData);
      }
      
      setIsModalOpen(false);
      carregarClientes(); // Atualiza a tabela na hora
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao processar a requisição. Verifique o console.");
    }
  }

  // Função para Deletar com confirmação de segurança
  async function handleDeletar(id) {
    const confirmacao = window.confirm("Atenção: Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.");
    
    if (confirmacao) {
      try {
        await api.delete(`/clientes/${id}`);
        carregarClientes(); // Recarrega a tabela após apagar
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir. O cliente pode ter vínculos no banco de dados.");
      }
    }
  }

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Meus Clientes</h2>
        <button 
          onClick={abrirModalNovo}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
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
                    <button 
                      onClick={() => abrirModalEdicao(cliente)}
                      className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Pencil size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeletar(cliente.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                {idEdicao ? "Editar Cliente" : "Novo Cliente"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: João da Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                <input 
                  type="text" 
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: (81) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: joao@email.com"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer"
                >
                  {idEdicao ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}