<script setup>
import { ref, computed, onMounted } from 'vue'
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

const formData = ref({
  veiculo_id: "", funcionario_id: "", status: "Aberta", data_abertura: "", data_conclusao: "", valor_total: ""
})

async function carregarDados() {
  const [resOrdens, resVeiculos, resFuncionarios] = await Promise.all([
    listarOrdens(), listarVeiculos(), listarFuncionarios()
  ])
  ordens.value = resOrdens.data
  veiculos.value = resVeiculos.data
  funcionarios.value = resFuncionarios.data
}

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

async function handleSalvar() {
  try {
    if (idEdicao.value) {
      await atualizarOrdem(idEdicao.value, formData.value)
    } else {
      await criarOrdem(formData.value)
    }
    isModalOpen.value = false
    await carregarDados()
  } catch (error) {
    console.error("Erro ao salvar OS:", error)
    alert("Erro ao salvar OS.")
  }
}

async function handleDeletar(id) {
  if (confirm("Excluir esta Ordem de Serviço permanentemente?")) {
    await deletarOrdem(id)
    await carregarDados()
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
  const cores = { 'Aberta': 'bg-yellow-100 text-yellow-800', 'Em Andamento': 'bg-blue-100 text-blue-800', 'Concluída': 'bg-emerald-100 text-emerald-800', 'Cancelada': 'bg-red-100 text-red-800' }
  return cores[status] || 'bg-slate-100 text-slate-800'
}

const ordensFiltradas = computed(() => {
  const termo = termoBusca.value.toLowerCase()
  return ordens.value.filter(os => 
    getPlacaVeiculo(os.veiculo_id).toLowerCase().includes(termo) || 
    getNomeFuncionario(os.funcionario_id).toLowerCase().includes(termo) || 
    os.status.toLowerCase().includes(termo)
  )
})

onMounted(carregarDados)
</script>

<template>
  <div class="animate-fade-in relative">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Ordens de Serviço</h2>
      <button @click="abrirModalNovo" class="bg-indigo-600 text-white py-2 px-4 rounded-lg flex items-center gap-2">
        <PhClipboardText :size="20" /> Nova OS
      </button>
    </div>

    <div class="bg-white rounded-xl shadow border border-slate-200">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 border-b">
            <th class="p-4">OS #</th>
            <th class="p-4">Veículo</th>
            <th class="p-4">Mecânico</th>
            <th class="p-4">Status</th>
            <th class="p-4">Valor</th>
            <th class="p-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="os in ordensFiltradas" :key="os.id">
            <td class="p-4 font-bold text-indigo-600">#{{ os.id }}</td>
            <td class="p-4">{{ getPlacaVeiculo(os.veiculo_id) }}</td>
            <td class="p-4">{{ getNomeFuncionario(os.funcionario_id) }}</td>
            <td class="p-4"><span :class="['px-2 py-1 rounded-full text-xs font-bold uppercase', getStatusColor(os.status)]">{{ os.status }}</span></td>
            <td class="p-4 font-bold">R$ {{ Number(os.valor_total || 0).toFixed(2) }}</td>
            <td class="p-4 flex justify-center gap-2">
              <button @click="abrirModalEdicao(os)" class="text-blue-500 hover:text-blue-700"><PhPencil :size="20" /></button>
              <button @click="handleDeletar(os.id)" class="text-red-500 hover:text-red-700"><PhTrash :size="20" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4">{{ idEdicao ? "Editar OS" : "Nova OS" }}</h3>
        <form @submit.prevent="handleSalvar" class="space-y-4">
          <select required v-model="formData.veiculo_id" class="w-full border p-2 rounded">
            <option value="" disabled>Selecione um veículo...</option>
            <option v-for="v in veiculos" :key="v.id" :value="v.id">{{ v.modelo }} - {{ v.placa }}</option>
          </select>
          <select required v-model="formData.funcionario_id" class="w-full border p-2 rounded">
            <option value="" disabled>Selecione um mecânico...</option>
            <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
          </select>
          <div class="grid grid-cols-2 gap-2">
            <select v-model="formData.status" class="border p-2 rounded">
              <option value="Aberta">Aberta</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
            <input type="number" v-model="formData.valor_total" class="border p-2 rounded" placeholder="Valor" />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>