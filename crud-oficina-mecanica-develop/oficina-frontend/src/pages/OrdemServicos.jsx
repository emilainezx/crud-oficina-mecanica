import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ClipboardText, Pencil, Trash, X, MagnifyingGlass } from "@phosphor-icons/react";

export function OrdemServicos() {
  const [ordens, setOrdens] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  
  // 1. Novo estado para a barra de pesquisa
  const [termoBusca, setTermoBusca] = useState("");
  
  const [formData, setFormData] = useState({
    veiculo_id: "",
    funcionario_id: "",
    status: "Aberta",
    data_abertura: "",
    data_conclusao: "",
    valor_total: ""
  });

  function carregarDados() {
    api.get("/ordens-servico")
      .then((response) => setOrdens(response.data))
      .catch((error) => console.error("Erro ao buscar OS:", error));

    api.get("/veiculos")
      .then((response) => setVeiculos(response.data))
      .catch((error) => console.error("Erro ao buscar veículos:", error));

    api.get("/funcionarios")
      .then((response) => setFuncionarios(response.data))
      .catch((error) => console.error("Erro ao buscar funcionários:", error));
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModalNovo() {
    const hoje = new Date().toISOString().split('T')[0];
    setFormData({ veiculo_id: "", funcionario_id: "", status: "Aberta", data_abertura: hoje, data_conclusao: "", valor_total: "" });
    setIdEdicao(null);
    setIsModalOpen(true);
  }

  function abrirModalEdicao(os) {
    setFormData({
      veiculo_id: os.veiculo_id,
      funcionario_id: os.funcionario_id,
      status: os.status,
      data_abertura: os.data_abertura ? os.data_abertura.split('T')[0] : "",
      data_conclusao: os.data_conclusao ? os.data_conclusao.split('T')[0] : "",
      valor_total: os.valor_total
    });
    setIdEdicao(os.id);
    setIsModalOpen(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    try {
      if (idEdicao) {
        await api.put(`/ordens-servico/${idEdicao}`, formData);
      } else {
        await api.post("/ordens-servico", formData);
      }
      setIsModalOpen(false);
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar OS:", error);
      alert("Erro ao salvar OS. Verifique os campos obrigatórios.");
    }
  }

  async function handleDeletar(id) {
    const confirmacao = window.confirm("Atenção: Excluir esta Ordem de Serviço permanentemente?");
    if (confirmacao) {
      try {
        await api.delete(`/ordens-servico/${id}`);
        carregarDados();
      } catch (error) {
        console.error("Erro ao deletar OS:", error);
        alert("Erro ao excluir OS.");
      }
    }
  }

  function getPlacaVeiculo(id) {
    const veiculo = veiculos.find(v => v.id === id);
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})` : "Veículo Removido";
  }

  function getNomeFuncionario(id) {
    const func = funcionarios.find(f => f.id === id);
    return func ? func.nome : "Mecânico Removido";
  }

  function getStatusColor(status) {
    switch(status) {
      case 'Aberta': return 'bg-yellow-100 text-yellow-800';
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Concluída': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  // 2. O Motor de Busca: Filtra os dados antes de desenhar a tabela
  const ordensFiltradas = ordens.filter((os) => {
    const termo = termoBusca.toLowerCase();
    const textoVeiculo = getPlacaVeiculo(os.veiculo_id).toLowerCase();
    const textoMecanico = getNomeFuncionario(os.funcionario_id).toLowerCase();
    const textoId = os.id.toString();
    const textoStatus = os.status.toLowerCase();

    // Procura o texto digitado na Placa, no Mecânico, no ID ou no Status
    return textoVeiculo.includes(termo) || 
           textoMecanico.includes(termo) || 
           textoId.includes(termo) ||
           textoStatus.includes(termo);
  });

  return (
    <div className="animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-slate-800">Ordens de Serviço</h2>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          {/* 3. A Barra de Pesquisa Visual */}
          <div className="relative w-full md:w-72">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por placa, mecânico ou status..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition-all text-sm"
            />
          </div>

          <button 
            onClick={abrirModalNovo}
            className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
          >
            <ClipboardText size={20} />
            Nova OS
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">OS #</th>
              <th className="p-4 font-semibold">Veículo</th>
              <th className="p-4 font-semibold">Mecânico</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Valor</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ordensFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  {termoBusca ? "Nenhum resultado encontrado para esta busca." : "Nenhuma Ordem de Serviço aberta."}
                </td>
              </tr>
            ) : (
              ordensFiltradas.map((os) => (
                <tr key={os.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-indigo-600">#{os.id}</td>
                  <td className="p-4 font-medium text-slate-800">{getPlacaVeiculo(os.veiculo_id)}</td>
                  <td className="p-4 text-slate-600">{getNomeFuncionario(os.funcionario_id)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(os.status)}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-800 font-bold">R$ {Number(os.valor_total || 0).toFixed(2)}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => abrirModalEdicao(os)} className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><Pencil size={20} /></button>
                    <button onClick={() => handleDeletar(os.id)} className="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><Trash size={20} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800">
                {idEdicao ? `Editar OS #${idEdicao}` : "Abrir Nova OS"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Veículo (Cliente)</label>
                  <select required value={formData.veiculo_id} onChange={(e) => setFormData({...formData, veiculo_id: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                    <option value="" disabled>Selecione um veículo...</option>
                    {veiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo} - {v.placa}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mecânico Responsável</label>
                  <select required value={formData.funcionario_id} onChange={(e) => setFormData({...formData, funcionario_id: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                    <option value="" disabled>Selecione o mecânico...</option>
                    {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nome} ({f.cargo})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium">
                    <option value="Aberta">Aberta</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Abertura</label>
                  <input type="date" required value={formData.data_abertura} onChange={(e) => setFormData({...formData, data_abertura: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Conclusão</label>
                  <input type="date" value={formData.data_conclusao} onChange={(e) => setFormData({...formData, data_conclusao: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total (R$)</label>
                <input type="number" step="0.01" value={formData.valor_total} onChange={(e) => setFormData({...formData, valor_total: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="0.00" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6 pt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer">{idEdicao ? "Atualizar OS" : "Salvar OS"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}