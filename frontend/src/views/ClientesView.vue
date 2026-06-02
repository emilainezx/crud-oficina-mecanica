<script setup>
import { ref, onMounted } from 'vue'
import { listarClientes, criarCliente, atualizarCliente, deletarCliente } from '../services/clienteService.js'

const clientes = ref([])
const form = ref({ nome: '', telefone: '', email: '' })
const editandoId = ref(null)
const erro = ref('')

async function carregarClientes() {
  const res = await listarClientes()
  clientes.value = res.data
}

async function salvar() {
  const nomeValido = /^[a-zA-ZÀ-ÿ\s]+$/.test(form.value.nome)
  const telefoneValido = /^\d{10,11}$/.test(form.value.telefone)
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)

  if (!form.value.nome || !form.value.telefone || !form.value.email) {
    erro.value = 'Todos os campos são obrigatórios.'
    return
  }

  if (!nomeValido) {
    erro.value = 'Nome deve conter apenas letras.'
    return
  }

  if (!telefoneValido) {
    erro.value = 'Telefone deve conter 10 ou 11 números.'
    return
}

  if (!emailValido) {
    erro.value = 'Email inválido.'
    return
  }

  try {
    if (editandoId.value) {
      await atualizarCliente(editandoId.value, form.value)
    } else {
      await criarCliente(form.value)
    }
    form.value = { nome: '', telefone: '', email: '' }
    editandoId.value = null
    erro.value = ''
    await carregarClientes()
  } catch (e) {
    erro.value = e.response?.data?.error || 'Erro ao salvar cliente.'
  }
}

function editar(cliente) {
  form.value = { nome: cliente.nome, telefone: cliente.telefone, email: cliente.email }
  editandoId.value = cliente.id
}

async function deletar(id) {
  if (confirm('Deseja deletar este cliente?')) {
    await deletarCliente(id)
    await carregarClientes()
  }
}

onMounted(carregarClientes)
</script>

<template>
  <div class="container">
    <h1>Clientes</h1>

    <div class="form">
      <h2>{{ editandoId ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
      <input v-model="form.nome" placeholder="Nome" />
      <input v-model="form.telefone" placeholder="Telefone" />
      <input v-model="form.email" placeholder="Email" />
      <p v-if="erro" class="erro">{{ erro }}</p>
      <button @click="salvar">{{ editandoId ? 'Atualizar' : 'Cadastrar' }}</button>
      <button v-if="editandoId" @click="editandoId = null; form = { nome: '', telefone: '', email: '' }">Cancelar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.id">
          <td>{{ cliente.nome }}</td>
          <td>{{ cliente.telefone }}</td>
          <td>{{ cliente.email }}</td>
          <td>
            <button @click="editar(cliente)">Editar</button>
            <button @click="deletar(cliente.id)">Deletar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

.container { padding: 24px; 
}
.form { display: flex; flex-direction: column; gap: 8px; max-width: 400px; margin-bottom: 24px; 
}
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; 
}
button { padding: 8px 16px; background-color: #1a1a2e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; 
}
button:hover { background-color: #e94560; 
}
table { width: 100%; border-collapse: collapse; 
}
th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
th { background-color: #1a1a2e; color: white; 
}
.erro { color: red; font-size: 14px; 
}
</style>