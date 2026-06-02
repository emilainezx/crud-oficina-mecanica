import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Users, Car, ClipboardText, Money, Wrench, ShieldCheck } from "@phosphor-icons/react";

export function Dashboard() {
  const [metricas, setMetricas] = useState({
    totalClientes: 0,
    totalVeiculos: 0,
    osAtivas: 0,
    faturamentoTotal: 0
  });
  const [ultimasOrdens, setUltimasOrdens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        // Dispara todas as requisições em paralelo para máxima performance
        const [resClientes, resVeiculos, resOrdens] = await Promise.all([
          api.get("/clientes"),
          api.get("/veiculos"),
          api.get("/ordens-servico")
        ]);

        const clientes = resClientes.data;
        const veiculos = resVeiculos.data;
        const ordens = resOrdens.data;

        // Processa os indicadores na hora
        const osAtivas = ordens.filter(os => os.status === "Aberta" || os.status === "Em Andamento").length;
        
        const faturamentoTotal = ordens
          .filter(os => os.status === "Concluída")
          .reduce((soma, os) => soma + Number(os.valor_total || 0), 0);

        setMetricas({
          totalClientes: clientes.length,
          totalVeiculos: veiculos.length,
          osAtivas,
          faturamentoTotal
        });

        // Pega as 5 ordens mais recentes para mostrar num mini-log
        setUltimasOrdens(ordens.slice(-5).reverse());
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-medium text-slate-500 animate-pulse">Carregando painel de controle...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Banner de Boas-Vindas */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex items-center justify-between border border-slate-800">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel de Controle</h2>
          <p className="text-slate-400 mt-1">Veja o desempenho, faturamento e fluxo de trabalho da sua oficina hoje.</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 hidden sm:block">
          <ShieldCheck size={32} className="text-blue-400" />
        </div>
      </div>

      {/* Grid de Cartões de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Faturamento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Faturamento Caixa</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">R$ {metricas.faturamentoTotal.toFixed(2)}</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-emerald-600">
            <Money size={28} weight="bold" />
          </div>
        </div>

        {/* Card 2: OS Ativas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">OS Em Andamento</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{metricas.osAtivas} chamados</h3>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-amber-600">
            <Wrench size={28} weight="duotone" />
          </div>
        </div>

        {/* Card 3: Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clientes Atendidos</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{metricas.totalClientes} cadastros</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-blue-600">
            <Users size={28} />
          </div>
        </div>

        {/* Card 4: Frota */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Frota Registrada</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{metricas.totalVeiculos} veículos</h3>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg text-indigo-600">
            <Car size={28} />
          </div>
        </div>
      </div>

      {/* Seção Inferior: Atividades Recentes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardText size={24} className="text-slate-700" />
          <h3 className="text-lg font-bold text-slate-800">Últimas Movimentações de OS</h3>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="p-3">OS #</th>
                <th className="p-3">Status</th>
                <th className="p-3">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {ultimasOrdens.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-slate-400">Nenhuma atividade recente registrada.</td>
                </tr>
              ) : (
                ultimasOrdens.map(os => (
                  <tr key={os.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-indigo-600">#{os.id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        os.status === 'Concluída' ? 'bg-emerald-100 text-emerald-800' :
                        os.status === 'Cancelada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {os.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium">R$ {Number(os.valor_total || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}