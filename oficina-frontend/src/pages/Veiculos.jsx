import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Car, Pencil, Trash, X } from "@phosphor-icons/react";

export function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [clientes, setClientes] = useState([]); // Necessário para o formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  
  const [formData, setFormData] = useState({
    cliente_id: "",
    marca: "",
    modelo: "",
    ano: "",
    placa: ""
  });

  // Carrega as duas tabelas do banco
  function carregarDados() {
    api.get("/veiculos")
      .then((response) => setVeiculos(response.data))
      .catch((error) => console.error("Erro ao buscar veículos:", error));
      
    api.get("/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Erro ao buscar clientes:", error));
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModalNovo() {
    setFormData({ cliente_id: "", marca: "", modelo: "", ano: "", placa: "" });
    setIdEdicao(null);
    setIsModalOpen(true);
  }

  function abrirModalEdicao(veiculo) {
    setFormData({
      cliente_id: veiculo.cliente_id,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      placa: veiculo.placa
    });
    setIdEdicao(veiculo.id);
    setIsModalOpen(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    try {
      if (idEdicao) {
        await api.put(`/veiculos/${idEdicao}`, formData);
      } else {
        await api.post("/veiculos", formData);
      }
      setIsModalOpen(false);
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar veículo. Verifique se a placa já existe.");
    }
  }

  async function handleDeletar(id) {
    const confirmacao = window.confirm("Excluir este veículo permanentemente?");
    if (confirmacao) {
      try {
        await api.delete(`/veiculos/${id}`);
        carregarDados();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir. O veículo pode estar em uma Ordem de Serviço.");
      }
    }
  }

  // Função para pegar o ID do cliente e mostrar o Nome dele na tabela
  function getNomeCliente(id) {
    const clienteEncontrado = clientes.find(c => c.id === id);
    return clienteEncontrado ? clienteEncontrado.nome : "Cliente não encontrado";
  }

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Frota de Veículos</h2>
        <button 
          onClick={abrirModalNovo}
          className="bg-slate-800 hover:bg-slate-900 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
          <Car size={20} />
          Novo Veículo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Placa</th>
              <th className="p-4 font-semibold">Veículo</th>
              <th className="p-4 font-semibold">Proprietário</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {veiculos.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  Nenhum veículo cadastrado ainda.
                </td>
              </tr>
            ) : (
              veiculos.map((veiculo) => (
                <tr key={veiculo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 uppercase tracking-widest">{veiculo.placa}</td>
                  <td className="p-4 text-slate-800">{veiculo.marca} {veiculo.modelo} ({veiculo.ano})</td>
                  <td className="p-4 text-slate-600">{getNomeCliente(veiculo.cliente_id)}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => abrirModalEdicao(veiculo)} className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><Pencil size={20} /></button>
                    <button onClick={() => handleDeletar(veiculo.id)} className="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><Trash size={20} /></button>
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
                {idEdicao ? "Editar Veículo" : "Cadastrar Veículo"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-5 space-y-4">
              
              {/* Dropdown de Clientes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proprietário (Cliente)</label>
                <select 
                  required
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="" disabled>Selecione um cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} ({cliente.telefone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input 
                    type="text" required value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                  <input 
                    type="text" required value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Corolla"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ano</label>
                  <input 
                    type="number" required value={formData.ano}
                    onChange={(e) => setFormData({...formData, ano: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: 2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
                  <input 
                    type="text" required value={formData.placa}
                    onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase" placeholder="ABC1D23"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-slate-800 hover:bg-slate-900 rounded-lg font-medium shadow-md transition-colors cursor-pointer">
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