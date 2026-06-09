<script setup>
import { ref, onMounted } from 'vue'
import { listarClientes, criarCliente, atualizarCliente, deletarCliente } from '../services/clienteService.js'
import { PhUserPlus, PhPencil, PhTrash, PhX } from "@phosphor-icons/vue"

const clientes = ref([])
const isModalOpen = ref(false)
const idEdicao = ref(null)
const formData = ref({ nome: "", telefone: "", email: "" })

async function carregarClientes() {
  try {
    const response = await listarClientes()
    clientes.value = response.data
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
  }
}

onMounted(carregarClientes)

function abrirModalNovo() {
  formData.value = { nome: "", telefone: "", email: "" }
  idEdicao.value = null
  isModalOpen.value = true
}

function abrirModalEdicao(cliente) {
  formData.value = { nome: cliente.nome, telefone: cliente.telefone, email: cliente.email }
  idEdicao.value = cliente.id
  isModalOpen.value = true
}

// ----------------- MÁSCARAS E VALIDAÇÕES -----------------
function mascaraNome(event) {
  let val = event.target.value;
  // Remove tudo que não for letra (incluindo acentos) ou espaço
  val = val.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  // Padroniza primeira letra maiúscula de cada palavra
  val = val.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  formData.value.nome = val;
}

function mascaraTelefone(event) {
  let val = event.target.value;
  // Remove tudo que não for número e limita a 11 dígitos
  val = val.replace(/\D/g, '').substring(0, 11);
  // Aplica a máscara (XX) 9XXXX-XXXX
  if (val.length > 2) val = '(' + val.substring(0, 2) + ') ' + val.substring(2);
  if (val.length > 10) val = val.substring(0, 10) + '-' + val.substring(10);
  formData.value.telefone = val;
}
// ---------------------------------------------------------

async function handleSalvar() {
  try {
    if (idEdicao.value) {
      await atualizarCliente(idEdicao.value, formData.value)
    } else {
      await criarCliente(formData.value)
    }
    isModalOpen.value = false
    await carregarClientes()
  } catch (error) {
    console.error("Erro ao salvar:", error)
    alert("Erro ao processar a requisição. Verifique o console.")
  }
}

async function handleDeletar(id) {
  if (confirm("Atenção: Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.")) {
    try {
      await deletarCliente(id)
      await carregarClientes()
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao excluir. O cliente pode ter vínculos no banco de dados.")
    }
  }
}
</script>

<template>
  <div class="animate-fade-in relative">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Meus Clientes</h2>
      <button 
        @click="abrirModalNovo"
        class="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
      >
        <PhUserPlus :size="20" />
        Novo Cliente
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
            <th class="p-4 font-semibold">Nome</th>
            <th class="p-4 font-semibold">Telefone</th>
            <th class="p-4 font-semibold">Email</th>
            <th class="p-4 font-semibold text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="clientes.length === 0">
            <td colspan="4" class="p-8 text-center text-slate-500">
              Nenhum cliente cadastrado no banco de dados ainda.
            </td>
          </tr>
          <tr v-else v-for="cliente in clientes" :key="cliente.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-medium text-slate-800">{{ cliente.nome }}</td>
            <td class="p-4 text-slate-600">{{ cliente.telefone }}</td>
            <td class="p-4 text-slate-600">{{ cliente.email }}</td>
            <td class="p-4 flex justify-center gap-3">
              <button 
                @click="abrirModalEdicao(cliente)"
                class="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"
                title="Editar"
              >
                <PhPencil :size="20" />
              </button>
              <button 
                @click="handleDeletar(cliente.id)"
                class="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"
                title="Excluir"
              >
                <PhTrash :size="20" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div class="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-xl font-bold text-slate-800">
            {{ idEdicao ? "Editar Cliente" : "Novo Cliente" }}
          </h3>
          <button @click="isModalOpen = false" class="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
            <PhX :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="handleSalvar" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              v-model="formData.nome"
              @input="mascaraNome"
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: João da Silva"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
            <input 
              type="text" 
              required
              v-model="formData.telefone"
              @input="mascaraTelefone"
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: (81) 99999-9999"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              v-model="formData.email"
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: joao@email.com"
            />
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              @click="isModalOpen = false"
              class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer"
            >
              {{ idEdicao ? "Atualizar" : "Salvar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>