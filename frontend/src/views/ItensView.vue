<script setup>
import { ref, onMounted } from 'vue'
import { listarItens, criarItem, atualizarItem, deletarItem } from '../services/itemService.js'
import { PhPackage, PhPencil, PhTrash, PhX } from "@phosphor-icons/vue"

const itens = ref([])
const isModalOpen = ref(false)
const idEdicao = ref(null)

// Função de padronização para exibição (R$ 150,00)
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0));
}

const formData = ref({
  nome: "",
  descricao: "",
  preco: "",
  tipo: "",
  quantidade: ""
})

async function carregarItens() {
  try {
    const response = await listarItens()
    itens.value = response.data
  } catch (error) {
    console.error("Erro ao buscar itens:", error)
  }
}

onMounted(carregarItens)

function abrirModalNovo() {
  formData.value = { nome: "", descricao: "", preco: "", tipo: "", quantidade: "" }
  idEdicao.value = null
  isModalOpen.value = true
}

function abrirModalEdicao(item) {
  formData.value = {
    nome: item.nome,
    descricao: item.descricao,
    preco: item.preco,
    tipo: item.tipo || "",
    quantidade: item.quantidade || ""
  }
  idEdicao.value = item.id
  isModalOpen.value = true
}

async function handleSalvar() {
  try {
    // CORREÇÃO: Converte valores numéricos e trava quantidade para não ser negativa
    const dadosParaEnviar = {
      ...formData.value,
      preco: parseFloat(formData.value.preco),
      quantidade: Math.max(0, parseInt(formData.value.quantidade) || 0)
    }

    if (idEdicao.value) {
      await atualizarItem(idEdicao.value, dadosParaEnviar)
    } else {
      await criarItem(dadosParaEnviar)
    }
    isModalOpen.value = false
    await carregarItens()
  } catch (error) {
    console.error("Erro ao salvar:", error)
    alert("Erro ao salvar item. Verifique os dados no console.")
  }
}

async function handleDeletar(id) {
  if (confirm("Excluir este item do sistema?")) {
    try {
      await deletarItem(id)
      await carregarItens()
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao excluir. Este item pode estar em uso em uma Ordem de Serviço.")
    }
  }
}
</script>

<template>
  <div class="animate-fade-in relative">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Catálogo de Peças/Serviços</h2>
      <button 
        @click="abrirModalNovo"
        class="bg-orange-600 hover:bg-orange-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
      >
        <PhPackage :size="20" />
        Novo Item
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
            <th class="p-4 font-semibold">Item</th>
            <th class="p-4 font-semibold">Descrição</th>
            <th class="p-4 font-semibold">Tipo</th>
            <th class="p-4 font-semibold">Preço</th>
            <th class="p-4 font-semibold">Qtd</th>
            <th class="p-4 font-semibold text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="itens.length === 0">
            <td colspan="6" class="p-8 text-center text-slate-500">
              Nenhum item ou serviço cadastrado ainda.
            </td>
          </tr>
          <tr v-else v-for="item in itens" :key="item.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-medium text-slate-800">{{ item.nome }}</td>
            <td class="p-4 text-slate-600 text-sm">{{ item.descricao }}</td>
            <td class="p-4 text-slate-500 text-xs uppercase font-semibold">{{ item.tipo || "Geral" }}</td>
            <td class="p-4 text-orange-600 font-bold">{{ formatarMoeda(item.preco) }}</td>
            <td class="p-4 text-slate-600">{{ item.quantidade ?? 0 }}</td>
            <td class="p-4 flex justify-center gap-3">
              <button @click="abrirModalEdicao(item)" class="text-blue-500 cursor-pointer hover:text-blue-700 p-1 bg-blue-50 rounded"><PhPencil :size="20" /></button>
              <button @click="handleDeletar(item.id)" class="text-red-500 cursor-pointer hover:text-red-700 p-1 bg-red-50 rounded"><PhTrash :size="20" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div class="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-xl font-bold text-slate-800">
            {{ idEdicao ? "Editar Item" : "Cadastrar Novo Item" }}
          </h3>
          <button @click="isModalOpen = false" class="text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
            <PhX :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="handleSalvar" class="p-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
              <input 
                type="text" required v-model="formData.nome" 
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                placeholder="Ex: Pastilha de Freio" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <input 
                type="text" v-model="formData.tipo" 
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                placeholder="Ex: Peça ou Serviço" 
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea 
              required v-model="formData.descricao" 
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none h-20 resize-none" 
              placeholder="Ex: Pastilha dianteira original." 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
              <input 
                type="number" step="0.01" min="0" required v-model="formData.preco" 
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                placeholder="Ex: 150.00" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Quantidade Inicial</label>
              <input 
                type="number" v-model="formData.quantidade" min="0"
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                placeholder="Ex: 15" 
              />
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium shadow-md transition-colors cursor-pointer">
              {{ idEdicao ? "Atualizar" : "Salvar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>