import { useEffect, useState } from "react";
import { api } from "../services/api";
import { IdentificationBadge, Pencil, Trash, X } from "@phosphor-icons/react";

export function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    cargo: "",
    salario: ""
  });

  function carregarFuncionarios() {
    api.get("/funcionarios")
      .then((response) => setFuncionarios(response.data))
      .catch((error) => console.error("Erro ao buscar funcionários:", error));
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  function abrirModalNovo() {
    setFormData({ nome: "", cpf: "", telefone: "", cargo: "", salario: "" });
    setIdEdicao(null);
    setIsModalOpen(true);
  }

  function abrirModalEdicao(funcionario) {
    setFormData({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      telefone: funcionario.telefone,
      cargo: funcionario.cargo,
      salario: funcionario.salario
    });
    setIdEdicao(funcionario.id);
    setIsModalOpen(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    try {
      if (idEdicao) {
        await api.put(`/funcionarios/${idEdicao}`, formData);
      } else {
        await api.post("/funcionarios", formData);
      }
      setIsModalOpen(false);
      carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar funcionário. Verifique os dados.");
    }
  }

  async function handleDeletar(id) {
    const confirmacao = window.confirm("Excluir este funcionário do sistema?");
    if (confirmacao) {
      try {
        await api.delete(`/funcionarios/${id}`);
        carregarFuncionarios();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir. Este funcionário pode ter Ordens de Serviço vinculadas.");
      }
    }
  }

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Equipe de Mecânicos</h2>
        <button 
          onClick={abrirModalNovo}
          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
          <IdentificationBadge size={20} />
          Novo Funcionário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Cargo</th>
              <th className="p-4 font-semibold">Telefone</th>
              <th className="p-4 font-semibold">Salário</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {funcionarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  Nenhum funcionário cadastrado ainda.
                </td>
              </tr>
            ) : (
              funcionarios.map((func) => (
                <tr key={func.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{func.nome}</td>
                  <td className="p-4 text-slate-600 font-semibold">{func.cargo}</td>
                  <td className="p-4 text-slate-600">{func.telefone}</td>
                  <td className="p-4 text-slate-600 text-emerald-600 font-medium">R$ {func.salario}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => abrirModalEdicao(func)} className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><Pencil size={20} /></button>
                    <button onClick={() => handleDeletar(func.id)} className="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><Trash size={20} /></button>
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
                {idEdicao ? "Editar Funcionário" : "Cadastrar Funcionário"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ex: Carlos Mecânico" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                  <input type="text" required value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input type="text" required value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="(81) 99999-9999" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
                  <input type="text" required value={formData.cargo} onChange={(e) => setFormData({...formData, cargo: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ex: Mecânico Chefe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salário (R$)</label>
                  <input type="number" step="0.01" required value={formData.salario} onChange={(e) => setFormData({...formData, salario: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="3500.00" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer">
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