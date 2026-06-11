<script setup>
import { ref, onMounted, computed } from 'vue'
import { listarVeiculos, criarVeiculo, atualizarVeiculo, deletarVeiculo } from '../services/veiculoService.js'
import { listarClientes } from '../services/clienteService.js'
import { PhCar, PhPencil, PhTrash, PhX, PhMagnifyingGlass } from "@phosphor-icons/vue"

const veiculos = ref([])
const clientes = ref([])
const isModalOpen = ref(false)
const idEdicao = ref(null)
const termoBusca = ref("")

const anoMaximo = computed(() => new Date().getFullYear() + 1);

const formData = ref({
  cliente_id: "", marca: "", modelo: "", ano: "", placa: ""
})

async function carregarDados() {
  try {
    const [resVeiculos, resClientes] = await Promise.all([
      listarVeiculos(termoBusca.value),
      listarClientes()
    ])
    veiculos.value = resVeiculos.data
    clientes.value = resClientes.data
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  }
}

onMounted(carregarDados)

function abrirModalNovo() {
  formData.value = { cliente_id: "", marca: "", modelo: "", ano: "", placa: "" }
  idEdicao.value = null
  isModalOpen.value = true
}

function abrirModalEdicao(veiculo) {
  formData.value = {
    cliente_id: veiculo.cliente_id, marca: veiculo.marca,
    modelo: veiculo.modelo, ano: veiculo.ano, placa: veiculo.placa
  }
  idEdicao.value = veiculo.id
  isModalOpen.value = true
}

function mascaraPlaca(event) {
  let val = event.target.value.toUpperCase();
  val = val.replace(/[^A-Z0-9]/g, '').substring(0, 7);
  if (val.length > 4) {
    if (/[0-9]/.test(val[4])) {
      val = val.substring(0, 3) + '-' + val.substring(3);
    }
  }
  formData.value.placa = val;
}

async function handleSalvar() {
  try {
    const dados = { ...formData.value, placa: formData.value.placa.toUpperCase() }
    if (idEdicao.value) {
      await atualizarVeiculo(idEdicao.value, dados)
    } else {
      await criarVeiculo(dados)
    }
    isModalOpen.value = false
    await carregarDados()
  } catch (error) {
    console.error("Erro ao salvar:", error)
    alert("Erro ao salvar veículo. Verifique se a placa já existe.")
  }
}

async function handleDeletar(id) {
  if (confirm("Excluir este veículo permanentemente?")) {
    try {
      await deletarVeiculo(id)
      await carregarDados()
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao excluir. O veículo pode estar em uma Ordem de Serviço.")
    }
  }
}

function getNomeCliente(id) {
  const clienteEncontrado = clientes.value.find(c => c.id === id)
  return clienteEncontrado ? clienteEncontrado.nome : "Cliente não encontrado"
}
</script>

<template>
  <div class="animate-fade-in relative">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Frota de Veículos</h2>
      <button 
        @click="abrirModalNovo"
        class="bg-slate-800 hover:bg-slate-900 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
      >
        <PhCar :size="20" /> Novo Veículo
      </button>
    </div>

    <div class="mb-4 relative">
      <PhMagnifyingGlass :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        v-model="termoBusca"
        @input="carregarDados"
        type="text"
        placeholder="Buscar por marca, modelo, placa ou proprietário..."
        class="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-4 focus:ring-2 focus:ring-slate-500 focus:outline-none"
      />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
            <th class="p-4 font-semibold">Placa</th>
            <th class="p-4 font-semibold">Veículo</th>
            <th class="p-4 font-semibold">Proprietário</th>
            <th class="p-4 font-semibold text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="veiculos.length === 0">
            <td colspan="4" class="p-8 text-center text-slate-500">Nenhum veículo encontrado.</td>
          </tr>
          <tr v-else v-for="veiculo in veiculos" :key="veiculo.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-bold text-slate-700 uppercase tracking-widest">{{ veiculo.placa }}</td>
            <td class="p-4 text-slate-800">{{ veiculo.marca }} {{ veiculo.modelo }} ({{ veiculo.ano }})</td>
            <td class="p-4 text-slate-600">{{ getNomeCliente(veiculo.cliente_id) }}</td>
            <td class="p-4 flex justify-center gap-3">
              <button @click="abrirModalEdicao(veiculo)" class="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><PhPencil :size="20" /></button>
              <button @click="handleDeletar(veiculo.id)" class="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><PhTrash :size="20" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div class="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-xl font-bold text-slate-800">{{ idEdicao ? "Editar Veículo" : "Cadastrar Veículo" }}</h3>
          <button @click="isModalOpen = false" class="text-slate-500 hover:text-red-500 transition-colors cursor-pointer"><PhX :size="24" /></button>
        </div>
        <form @submit.prevent="handleSalvar" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Proprietário (Cliente)</label>
            <select required v-model="formData.cliente_id" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
              <option value="" disabled>Selecione um cliente...</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nome }} ({{ cliente.telefone }})</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Marca</label>
              <input type="text" required v-model="formData.marca" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Toyota" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
              <input type="text" required v-model="formData.modelo" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Corolla" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Ano</label>
              <input type="number" required v-model="formData.ano" min="1900" :max="anoMaximo" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: 2020" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Placa</label>
              <input type="text" required v-model="formData.placa" @input="mascaraPlaca" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase" placeholder="ABC1D23" />
            </div>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-white bg-slate-800 hover:bg-slate-900 rounded-lg font-medium shadow-md transition-colors cursor-pointer">{{ idEdicao ? "Atualizar" : "Salvar" }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>