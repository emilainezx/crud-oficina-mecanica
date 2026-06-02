<script setup>
import { ref, onMounted } from 'vue'
import { listarFuncionarios, criarFuncionario, atualizarFuncionario, deletarFuncionario } from '../services/funcionarioService.js'

const funcionarios = ref([])
const form = ref({ nome: '', cpf: '', telefone: '', cargo: '', salario: '' })
const editandoId = ref(null)
const erro = ref('')

async function carregarFuncionarios() {
  const res = await listarFuncionarios()
  funcionarios.value = res.data
}

async function salvar() {
  if (!form.value.nome || !form.value.cpf || !form.value.telefone || !form.value.cargo || !form.value.salario) {
    erro.value = 'Todos os campos são obrigatórios.'
    return
  }
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.value.nome)) {
    erro.value = 'Nome deve conter apenas letras.'
    return
  }
  if (!/^\d{11}$/.test(form.value.cpf)) {
    erro.value = 'CPF deve conter 11 números.'
    return
  }
  if (!/^\d{10,11}$/.test(form.value.telefone)) {
    erro.value = 'Telefone deve conter 10 ou 11 números.'
    return
  }
  if (isNaN(Number(form.value.salario)) || Number(form.value.salario) <= 0) {
    erro.value = 'Salário deve ser um valor positivo.'
    return
  }

  try {
    if (editandoId.value) {
      await atualizarFuncionario(editandoId.value, form.value)
    } else {
      await criarFuncionario(form.value)
    }
    form.value = { nome: '', cpf: '', telefone: '', cargo: '', salario: '' }
    editandoId.value = null
    erro.value = ''
    await carregarFuncionarios()
  } catch (e) {
    erro.value = e.response?.data?.error || 'Erro ao salvar funcionário.'
  }
}

function editar(funcionario) {
  form.value = { 
    nome: funcionario.nome, 
    cpf: funcionario.cpf, 
    telefone: funcionario.telefone, 
    cargo: funcionario.cargo, 
    salario: funcionario.salario 
}
  editandoId.value = funcionario.id
}

async function deletar(id) {
  if (confirm('Deseja deletar este funcionário?')) {
    await deletarFuncionario(id)
    await carregarFuncionarios()
  }
}

onMounted(carregarFuncionarios)
</script>

<template>
  <div class="container">
    <h1>Funcionários</h1>

    <div class="form">
      <h2>{{ editandoId ? 'Editar Funcionário' : 'Novo Funcionário' }}</h2>
      <input v-model="form.nome" placeholder="Nome" />
      <input v-model="form.cpf" placeholder="CPF (apenas números)" />
      <input v-model="form.telefone" placeholder="Telefone (apenas números)" />
      <input v-model="form.cargo" placeholder="Cargo" />
      <input v-model="form.salario" placeholder="Salário (ex: 1500.00)" type="number" />
      <p v-if="erro" class="erro">{{ erro }}</p>
      <button @click="salvar">{{ editandoId ? 'Atualizar' : 'Cadastrar' }}</button>
      <button v-if="editandoId" @click="editandoId = null; form = { nome: '', cpf: '', telefone: '', cargo: '', salario: '' }">Cancelar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Cargo</th>
          <th>Salário</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="funcionario in funcionarios" :key="funcionario.id">
          <td>{{ funcionario.nome }}</td>
          <td>{{ funcionario.cpf }}</td>
          <td>{{ funcionario.telefone }}</td>
          <td>{{ funcionario.cargo }}</td>
          <td>R$ {{ Number(funcionario.salario).toFixed(2) }}</td>
          <td>
            <button @click="editar(funcionario)">Editar</button>
            <button @click="deletar(funcionario.id)">Deletar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container { 
    padding: 24px; 
}
.form { 
    display: flex; 
    flex-direction: column; 
    gap: 8px; 
    max-width: 400px; 
    margin-bottom: 24px; 
}
input { 
    padding: 8px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
}
button { 
    padding: 8px 16px; 
    background-color: #1a1a2e; 
    color: white;
    border: none; 
    border-radius: 4px; 
    cursor: pointer;
    margin-right: 8px;
 }
button:hover {
    background-color: #e94560; 
}
table { 
    width: 100%; 
    border-collapse: collapse; 
}
th, td { 
    padding: 10px;
     border: 1px solid #ddd; 
     text-align: left; 
    }
th { 
    background-color: #1a1a2e; 
    color: white; 
}
.erro { 
    color: red; 
    font-size: 14px;
}
</style>