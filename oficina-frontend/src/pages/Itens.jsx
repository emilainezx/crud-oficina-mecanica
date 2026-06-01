import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Package, Pencil, Trash, X } from "@phosphor-icons/react";

export function Itens() {
  const [itens, setItens] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  
  // Estado adaptado exatamente ao req.body do seu ItemController
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    tipo: "",
    quantidade: ""
  });

  function carregarItens() {
    api.get("/itens")
      .then((response) => setItens(response.data))
      .catch((error) => console.error("Erro ao buscar itens:", error));
  }

  useEffect(() => {
    carregarItens();
  }, []);

  function abrirModalNovo() {
    setFormData({ nome: "", descricao: "", preco: "", tipo: "", quantidade: "" });
    setIdEdicao(null);
    setIsModalOpen(true);
  }

  function abrirModalEdicao(item) {
    setFormData({
      nome: item.nome,
      descricao: item.descricao,
      preco: item.preco,
      tipo: item.tipo || "",
      quantidade: item.quantidade || ""
    });
    setIdEdicao(item.id);
    setIsModalOpen(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    try {
      if (idEdicao) {
        await api.put(`/itens/${idEdicao}`, formData);
      } else {
        await api.post("/itens", formData);
      }
      setIsModalOpen(false);
      carregarItens();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar item. Verifique os dados no console.");
    }
  }

  async function handleDeletar(id) {
    const confirmacao = window.confirm("Excluir este item do sistema?");
    if (confirmacao) {
      try {
        await api.delete(`/itens/${id}`);
        carregarItens();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir. Este item pode estar em uso em uma Ordem de Serviço.");
      }
    }
  }

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Catálogo de Peças/Serviços</h2>
        <button 
          onClick={abrirModalNovo}
          className="bg-orange-600 hover:bg-orange-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
          <Package size={20} />
          Novo Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold">Descrição</th>
              <th className="p-4 font-semibold">Tipo</th>
              <th className="p-4 font-semibold">Preço</th>
              <th className="p-4 font-semibold">Qtd</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {itens.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  Nenhum item ou serviço cadastrado ainda.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{item.nome}</td>
                  <td className="p-4 text-slate-600 text-sm">{item.descricao}</td>
                  <td className="p-4 text-slate-500 text-xs uppercase font-semibold">{item.tipo || "Geral"}</td>
                  <td className="p-4 text-orange-600 font-bold">R$ {Number(item.preco).toFixed(2)}</td>
                  <td className="p-4 text-slate-600">{item.quantidade ?? 0}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => abrirModalEdicao(item)} className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><Pencil size={20} /></button>
                    <button onClick={() => handleDeletar(item.id)} className="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><Trash size={20} /></button>
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
                {idEdicao ? "Editar Item" : "Cadastrar Novo Item"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
                  <input 
                    type="text" required value={formData.nome} 
                    onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                    placeholder="Ex: Pastilha de Freio" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <input 
                    type="text" value={formData.tipo} 
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})} 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                    placeholder="Ex: Peça ou Serviço" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  required value={formData.descricao} 
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none h-20 resize-none" 
                  placeholder="Ex: Pastilha dianteira original para sistema de freio a disco." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
                  <input 
                    type="number" step="0.01" required value={formData.preco} 
                    onChange={(e) => setFormData({...formData, preco: e.target.value})} 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                    placeholder="Ex: 150.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade Inicial</label>
                  <input 
                    type="number" value={formData.quantidade} 
                    onChange={(e) => setFormData({...formData, quantidade: e.target.value})} 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                    placeholder="Ex: 15" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer">
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