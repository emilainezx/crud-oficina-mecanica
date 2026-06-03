<script setup>
import { ref, onMounted } from 'vue'
import { listarFuncionarios, criarFuncionario, atualizarFuncionario, deletarFuncionario } from '../services/funcionarioService.js'
import { PhIdentificationBadge, PhPencil, PhTrash, PhX } from "@phosphor-icons/vue"

const funcionarios = ref([])
const isModalOpen = ref(false)
const idEdicao = ref(null)

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0));
}

const formData = ref({
  nome: "", cpf: "", telefone: "", cargo: "", salario: ""
})

async function carregarFuncionarios() {
  try {
    const response = await listarFuncionarios()
    funcionarios.value = response.data
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error)
  }
}

onMounted(carregarFuncionarios)

function abrirModalNovo() {
  formData.value = { nome: "", cpf: "", telefone: "", cargo: "", salario: "" }
  idEdicao.value = null
  isModalOpen.value = true
}

function abrirModalEdicao(funcionario) {
  formData.value = { ...funcionario }
  idEdicao.value = funcionario.id
  isModalOpen.value = true
}

async function handleSalvar() {
  try {
    const dadosParaEnviar = {
      ...formData.value,
      salario: parseFloat(formData.value.salario)
    }

    if (idEdicao.value) {
      await atualizarFuncionario(idEdicao.value, dadosParaEnviar)
    } else {
      await criarFuncionario(dadosParaEnviar)
    }
    isModalOpen.value = false
    await carregarFuncionarios()
  } catch (error) {
    console.error("Erro ao salvar:", error)
    alert("Erro ao salvar funcionário. Verifique os dados.")
  }
}

async function handleDeletar(id) {
  if (confirm("Excluir este funcionário do sistema?")) {
    try {
      await deletarFuncionario(id)
      await carregarFuncionarios()
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao excluir. Este funcionário pode ter Ordens de Serviço vinculadas.")
    }
  }
}
</script>

<template>
  <div class="animate-fade-in relative">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Equipe de Mecânicos</h2>
      <button 
        @click="abrirModalNovo"
        class="bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
      >
        <PhIdentificationBadge :size="20" /> Novo Funcionário
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
          <tr><th class="p-4">Nome</th><th class="p-4">Cargo</th><th class="p-4">Telefone</th><th class="p-4">Salário</th><th class="p-4 text-center">Ações</th></tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="funcionarios.length === 0"><td colspan="5" class="p-8 text-center text-slate-500">Nenhum funcionário cadastrado.</td></tr>
          <tr v-else v-for="func in funcionarios" :key="func.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-medium text-slate-800">{{ func.nome }}</td>
            <td class="p-4 text-slate-600 font-semibold">{{ func.cargo }}</td>
            <td class="p-4 text-slate-600">{{ func.telefone }}</td>
            <td class="p-4 text-slate-600 text-emerald-600 font-medium">{{ formatarMoeda(func.salario) }}</td>
            <td class="p-4 flex justify-center gap-3">
              <button @click="abrirModalEdicao(func)" class="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><PhPencil :size="20" /></button>
              <button @click="handleDeletar(func.id)" class="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><PhTrash :size="20" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div class="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-xl font-bold">{{ idEdicao ? "Editar" : "Cadastrar" }} Funcionário</h3>
          <button @click="isModalOpen = false" class="text-slate-500 hover:text-red-500 cursor-pointer"><PhX :size="24" /></button>
        </div>
        <form @submit.prevent="handleSalvar" class="p-5 space-y-4">
          <input type="text" required v-model="formData.nome" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nome Completo" />
          <div class="grid grid-cols-2 gap-4">
            <input type="text" required v-model="formData.cpf" class="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="CPF" />
            <input type="text" required v-model="formData.telefone" class="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Telefone" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <input type="text" required v-model="formData.cargo" class="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Cargo" />
            <input type="number" step="0.01" required v-model="formData.salario" class="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Salário (R$)" />
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-lg font-medium">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium shadow-md">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>