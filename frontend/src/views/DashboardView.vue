<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import {
  PhShieldCheck,
  PhMoney,
  PhWrench,
  PhUsers,
  PhCar,
  PhClipboardText,
  PhMagnifyingGlass
} from "@phosphor-icons/vue"

const ordens = ref([])
const clientes = ref([])
const veiculos = ref([])
const funcionarios = ref([])
const loading = ref(true)
const termoBusca = ref("")

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0))

onMounted(async () => {
  try {
    const [resO, resC, resV, resF] = await Promise.all([
      api.get("/ordens-servico"),
      api.get("/clientes"),
      api.get("/veiculos"),
      api.get("/funcionarios")
    ])
    ordens.value = resO.data
    clientes.value = resC.data
    veiculos.value = resV.data
    funcionarios.value = resF.data
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error)
  } finally {
    loading.value = false
  }
})

const stats = computed(() => {
  const concluidas = ordens.value.filter(o => o.status === 'Concluída')
  const emAndamento = ordens.value.filter(o => o.status === 'Em Andamento' || o.status === 'Aberta')
  return {
    faturamento: concluidas.reduce((s, o) => s + Number(o.valor_total || 0), 0),
    osAtivas: emAndamento.length,
    clientes: clientes.value.length,
    frota: veiculos.value.length
  }
})

const getStatusColor = (status) => {
  const cores = {
    'Concluída': 'bg-emerald-100 text-emerald-700',
    'Cancelada': 'bg-red-100 text-red-700',
    'Aberta': 'bg-yellow-100 text-yellow-700',
    'Em Andamento': 'bg-blue-100 text-blue-700'
  }
  return cores[status] || 'bg-slate-100 text-slate-700'
}

const getVeiculoInfo = (id) => {
  const v = veiculos.value.find(v => v.id === id)
  return v ? `${v.marca} ${v.modelo} (${v.placa})` : 'Veículo Removido'
}

const getFuncionarioInfo = (id) => {
  const f = funcionarios.value.find(f => f.id === id)
  return f ? f.nome : 'Não Atribuído'
}

// Filtra as últimas 6 OS pelo termo de busca (veículo, mecânico ou status)
const ordensExibidas = computed(() => {
  const ultimas = ordens.value.slice(-6).reverse()
  const termo = termoBusca.value.toLowerCase().trim()
  if (!termo) return ultimas
  return ultimas.filter(os =>
    getVeiculoInfo(os.veiculo_id).toLowerCase().includes(termo) ||
    getFuncionarioInfo(os.funcionario_id).toLowerCase().includes(termo) ||
    os.status.toLowerCase().includes(termo)
  )
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-8 animate-fade-in">

    <!-- Header -->
    <div class="bg-slate-900 rounded-2xl p-8 mb-8 flex justify-between items-center shadow-lg">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-wide">Painel de Controle</h1>
        <p class="text-slate-400 mt-2 text-sm">Veja o desempenho, faturamento e fluxo de trabalho da sua oficina hoje.</p>
      </div>
      <div class="p-3 border border-slate-700 rounded-xl bg-slate-800">
        <PhShieldCheck :size="28" weight="duotone" class="text-blue-400" />
      </div>
    </div>

    <!-- Cards de estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Faturamento Caixa</p>
          <p class="text-2xl font-bold text-slate-800">{{ formatarMoeda(stats.faturamento) }}</p>
        </div>
        <div class="p-3 rounded-xl bg-emerald-50 text-emerald-500">
          <PhMoney :size="28" weight="fill" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">OS em Andamento</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.osAtivas }} <span class="text-sm font-medium text-slate-500">chamados</span></p>
        </div>
        <div class="p-3 rounded-xl bg-amber-50 text-amber-500">
          <PhWrench :size="28" weight="fill" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clientes Atendidos</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.clientes }} <span class="text-sm font-medium text-slate-500">cadastros</span></p>
        </div>
        <div class="p-3 rounded-xl bg-blue-50 text-blue-500">
          <PhUsers :size="28" weight="fill" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Frota Registrada</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.frota }} <span class="text-sm font-medium text-slate-500">veículos</span></p>
        </div>
        <div class="p-3 rounded-xl bg-indigo-50 text-indigo-500">
          <PhCar :size="28" weight="fill" />
        </div>
      </div>
    </div>

    <!-- Tabela de últimas OS -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 flex flex-col gap-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <PhClipboardText :size="24" class="text-slate-500" />
          <h3 class="font-bold text-lg text-slate-800">Últimas Movimentações de OS</h3>
        </div>

        <!-- Barra de busca — mesmo padrão do clienteView -->
        <div class="relative w-full sm:w-72">
          <PhMagnifyingGlass :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="termoBusca"
            type="text"
            placeholder="Buscar por veículo, mecânico ou status..."
            class="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50">
            <tr class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th class="p-4 pl-6">OS #</th>
              <th class="p-4">Veículo</th>
              <th class="p-4">Mecânico</th>
              <th class="p-4">Status</th>
              <th class="p-4">Valor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading">
              <td colspan="5" class="p-8 text-center text-slate-500">Carregando...</td>
            </tr>
            <tr v-else-if="ordensExibidas.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-500">Nenhuma movimentação encontrada.</td>
            </tr>
            <tr
              v-else
              v-for="os in ordensExibidas"
              :key="os.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="p-4 pl-6 font-bold text-blue-600">#{{ os.id }}</td>
              <td class="p-4 font-medium text-slate-800">{{ getVeiculoInfo(os.veiculo_id) }}</td>
              <td class="p-4 text-sm font-medium text-slate-600">{{ getFuncionarioInfo(os.funcionario_id) }}</td>
              <td class="p-4">
                <span :class="['px-3 py-1 rounded-full text-[11px] font-bold', getStatusColor(os.status)]">
                  {{ os.status }}
                </span>
              </td>
              <td class="p-4 font-bold text-slate-700">{{ formatarMoeda(os.valor_total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>