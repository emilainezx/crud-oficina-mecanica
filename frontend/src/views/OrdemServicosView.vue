<script setup>
import { ref, onMounted } from 'vue'
import { listarOrdens, criarOrdem, atualizarOrdem, deletarOrdem } from '../services/ordemServicoService.js'
import { listarVeiculos } from '../services/veiculoService.js'
import { listarFuncionarios } from '../services/funcionarioService.js'
import { PhClipboardText, PhPencil, PhTrash, PhX, PhMagnifyingGlass } from "@phosphor-icons/vue"

const ordens = ref([])
const veiculos = ref([])
const funcionarios = ref([])
const isModalOpen = ref(false)
const idEdicao = ref(null)
const termoBusca = ref("")

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0))
}

const formData = ref({
  veiculo_id: "", funcionario_id: "", status: "Aberta", data_abertura: "", data_conclusao: "", valor_total: ""
})

// Carrega veículos e funcionários uma vez; ordens são recarregadas a cada busca
async function carregarVeiculosEFuncionarios() {
  const [resVeiculos, resFuncionarios] = await Promise.all([
    listarVeiculos(),
    listarFuncionarios()
  ])
  veiculos.value = resVeiculos.data
  funcionarios.value = resFuncionarios.data
}

async function carregarOrdens() {
  try {
    const response = await listarOrdens(termoBusca.value)
    ordens.value = response.data
  } catch (error) {
    console.error("Erro ao buscar ordens:", error)
  }
}

onMounted(async () => {
  await carregarVeiculosEFuncionarios()
  await carregarOrdens()
})

function abrirModalNovo() {
  const hoje = new Date().toISOString().split('T')[0]
  formData.value = { veiculo_id: "", funcionario_id: "", status: "Aberta", data_abertura: hoje, data_conclusao: "", valor_total: "" }
  idEdicao.value = null
  isModalOpen.value = true
}

function abrirModalEdicao(os) {
  formData.value = {
    veiculo_id: os.veiculo_id,
    funcionario_id: os.funcionario_id,
    status: os.status,
    data_abertura: os.data_abertura ? os.data_abertura.split('T')[0] : "",
    data_conclusao: os.data_conclusao ? os.data_conclusao.split('T')[0] : "",
    valor_total: os.valor_total
  }
  idEdicao.value = os.id
  isModalOpen.value = true
}

function ajustarDataConclusao() {
  if (formData.value.status === 'Concluída') {
    formData.value.data_conclusao = new Date().toISOString().split('T')[0]
  } else {
    formData.value.data_conclusao = ""
  }
}

async function handleSalvar() {
  try {
    const anoAbertura = new Date(formData.value.data_abertura).getFullYear()
    if (anoAbertura < 2026) {
      alert("Operação bloqueada: A data de abertura não pode ser anterior a 2026.")
      return
    }

    if (formData.value.status === 'Concluída') {
      const hoje = new Date().toISOString().split('T')[0]
      if (formData.value.data_conclusao !== hoje) {
        alert("Aviso do Sistema: A OS foi marcada como 'Concluída'. A data de conclusão foi ajustada automaticamente para HOJE.")
        formData.value.data_conclusao = hoje
      }
    }

    const dadosParaEnviar = {
      ...formData.value,
      veiculo_id: parseInt(formData.value.veiculo_id),
      funcionario_id: parseInt(formData.value.funcionario_id),
      valor_total: parseFloat(formData.value.valor_total) || 0
    }

    if (!dadosParaEnviar.data_conclusao) {
      dadosParaEnviar.data_conclusao = null
    }

    if (idEdicao.value) {
      await atualizarOrdem(idEdicao.value, dadosParaEnviar)
    } else {
      await criarOrdem(dadosParaEnviar)
    }

    isModalOpen.value = false
    await carregarOrdens()
  } catch (error) {
    console.error("Erro ao salvar OS:", error)
    alert("Erro ao salvar OS. O backend rejeitou os dados.")
  }
}

async function handleDeletar(id) {
  if (confirm("Atenção: Tem certeza que deseja excluir esta Ordem de Serviço?")) {
    try {
      await deletarOrdem(id)
      await carregarOrdens()
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao excluir. A OS pode ter vínculos no banco de dados.")
    }
  }
}

function getPlacaVeiculo(id) {
  const v = veiculos.value.find(v => v.id === id)
  return v ? `${v.marca} ${v.modelo} (${v.placa})` : "Veículo Removido"
}

function getNomeFuncionario(id) {
  const f = funcionarios.value.find(f => f.id === id)
  return f ? f.nome : "Mecânico Removido"
}

function getStatusColor(status) {
  const cores = {
    'Aberta': 'bg-yellow-100 text-yellow-800',
    'Em Andamento': 'bg-blue-100 text-blue-800',
    'Concluída': 'bg-emerald-100 text-emerald-800',
    'Cancelada': 'bg-red-100 text-red-800'
  }
  return cores[status] || 'bg-slate-100 text-slate-800'
}
</script>

<template>
  <div class="animate-fade-in relative">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Ordens de Serviço</h2>
      <button
        @click="abrirModalNovo"
        class="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
      >
        <PhClipboardText :size="20" />
        Nova OS
      </button>
    </div>

    <!-- Barra de busca — mesmo padrão do clienteView -->
    <div class="mb-4 relative">
      <PhMagnifyingGlass :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        v-model="termoBusca"
        @input="carregarOrdens"
        type="text"
        placeholder="Buscar por status (Ex: Aberta, Concluída, Em Andamento...)"
        class="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
            <th class="p-4 font-semibold">OS #</th>
            <th class="p-4 font-semibold">Veículo</th>
            <th class="p-4 font-semibold">Mecânico</th>
            <th class="p-4 font-semibold">Status</th>
            <th class="p-4 font-semibold">Valor</th>
            <th class="p-4 font-semibold text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="ordens.length === 0">
            <td colspan="6" class="p-8 text-center text-slate-500">
              Nenhuma ordem de serviço encontrada.
            </td>
          </tr>
          <tr v-else v-for="os in ordens" :key="os.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-bold text-indigo-600">#{{ os.id }}</td>
            <td class="p-4 font-medium text-slate-800">{{ getPlacaVeiculo(os.veiculo_id) }}</td>
            <td class="p-4 text-slate-600">{{ getNomeFuncionario(os.funcionario_id) }}</td>
            <td class="p-4">
              <span :class="['px-2 py-1 rounded-full text-xs font-bold uppercase', getStatusColor(os.status)]">
                {{ os.status }}
              </span>
            </td>
            <td class="p-4 font-bold text-slate-700">{{ formatarMoeda(os.valor_total) }}</td>
            <td class="p-4 flex justify-center gap-3">
              <button @click="abrirModalEdicao(os)" class="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded" title="Editar">
                <PhPencil :size="20" />
              </button>
              <button @click="handleDeletar(os.id)" class="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded" title="Excluir">
                <PhTrash :size="20" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div class="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-xl font-bold text-slate-800">{{ idEdicao ? "Editar OS" : "Nova OS" }}</h3>
          <button @click="isModalOpen = false" class="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
            <PhX :size="24" />
          </button>
        </div>

        <form @submit.prevent="handleSalvar" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
            <select required v-model="formData.veiculo_id" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option value="" disabled>Selecione um veículo...</option>
              <option v-for="v in veiculos" :key="v.id" :value="v.id">{{ v.modelo }} - {{ v.placa }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Mecânico Responsável</label>
            <select required v-model="formData.funcionario_id" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option value="" disabled>Selecione um mecânico...</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Data Abertura</label>
              <input
                type="date"
                required
                min="2026-01-01"
                v-model="formData.data_abertura"
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Data Conclusão</label>
              <input
                type="date"
                v-model="formData.data_conclusao"
                :readonly="formData.status === 'Concluída'"
                :class="{ 'bg-slate-100 cursor-not-allowed': formData.status === 'Concluída' }"
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select v-model="formData.status" @change="ajustarDataConclusao" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="Aberta">Aberta</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                v-model="formData.valor_total"
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer">
              {{ idEdicao ? "Atualizar" : "Salvar OS" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>