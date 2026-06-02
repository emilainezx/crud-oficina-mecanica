<script setup>
import { ref, onMounted } from 'vue'
import { listarVeiculos, criarVeiculo, atualizarVeiculo, deletarVeiculo } from '../services/veiculoService.js'
import { listarClientes } from '../services/clienteService.js'

const veiculos = ref([])
const clientes = ref([])
const form = ref({ cliente_id: '', marca: '', modelo: '', ano: '', placa: '' })
const editandoId = ref(null)
const erro = ref('')

async function carregarDados() {
  const [resVeiculos, resClientes] = await Promise.all([listarVeiculos(), listarClientes()])
  veiculos.value = resVeiculos.data
  clientes.value = resClientes.data
}

function nomeCliente(id) {
  const cliente = clientes.value.find(c => c.id === id)
  return cliente ? cliente.nome : id
}

async function salvar() {
  const anoNum = Number(form.value.ano)
  const anoAtual = new Date().getFullYear()

  if (!form.value.cliente_id || !form.value.marca || !form.value.modelo || !form.value.ano || !form.value.placa) {
    erro.value = 'Todos os campos são obrigatórios.'
    return
  }
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(form.value.marca)) {
    erro.value = 'Marca deve conter apenas letras.'
    return
  }
  if (!/^[a-zA-ZÀ-ÿ0-9\s]+$/.test(form.value.modelo)) {
    erro.value = 'Modelo inválido.'
    return
  }
  if (isNaN(anoNum) || anoNum < 1886 || anoNum > anoAtual) {
    erro.value = `Ano deve ser entre 1886 e ${anoAtual}.`
    return
  }
  if (!/^[A-Z]{3}\d[A-Z\d]\d{2}$/.test(form.value.placa.toUpperCase())) {
    erro.value = 'Placa inválida. Use o formato ABC1234 ou ABC1D23.'
    return
  }

  try {
    const dados = { ...form.value, placa: form.value.placa.toUpperCase(), ano: anoNum }
    if (editandoId.value) {
      await atualizarVeiculo(editandoId.value, dados)
    } else {
      await criarVeiculo(dados)
    }
    form.value = { cliente_id: '', marca: '', modelo: '', ano: '', placa: '' }
    editandoId.value = null
    erro.value = ''
    await carregarDados()
  } catch (e) {
    erro.value = e.response?.data?.error || 'Erro ao salvar veículo.'
  }
}

function editar(veiculo) {
  form.value = { cliente_id: veiculo.cliente_id, marca: veiculo.marca, modelo: veiculo.modelo, ano: veiculo.ano, placa: veiculo.placa }
  editandoId.value = veiculo.id
}

async function deletar(id) {
  if (confirm('Deseja deletar este veículo?')) {
    await deletarVeiculo(id)
    await carregarDados()
  }
}

onMounted(carregarDados)
</script>

<template>
  <div class="container">
    <h1>Veículos</h1>

    <div class="form">
      <h2>{{ editandoId ? 'Editar Veículo' : 'Novo Veículo' }}</h2>

      <select v-model="form.cliente_id">
        <option value="">Selecione o cliente</option>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nome }}
        </option>
      </select>

      <input v-model="form.marca" placeholder="Marca do veículo" />
      <input v-model="form.modelo" placeholder="Modelo do veículo" />
      <input v-model="form.ano" placeholder="Ano do veículo" />
      <input v-model="form.placa" placeholder="Placa do veículo" />

      <p v-if="erro" class="erro">{{ erro }}</p>
      <button @click="salvar">{{ editandoId ? 'Atualizar' : 'Cadastrar' }}</button>
      <button v-if="editandoId" @click="editandoId = null; form = { cliente_id: '', marca: '', modelo: '', ano: '', placa: '' }">Cancelar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Ano</th>
          <th>Placa</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="veiculo in veiculos" :key="veiculo.id">
          <td>{{ nomeCliente(veiculo.cliente_id) }}</td>
          <td>{{ veiculo.marca }}</td>
          <td>{{ veiculo.modelo }}</td>
          <td>{{ veiculo.ano }}</td>
          <td>{{ veiculo.placa }}</td>
          <td>
            <button @click="editar(veiculo)">Editar</button>
            <button @click="deletar(veiculo.id)">Deletar</button>
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
input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; 
}
button { padding: 8px 16px; background-color: #1a1a2e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; 
}
button:hover { background-color: #e94560; 
}
table { width: 100%; border-collapse: collapse; 
}
th, td { padding: 10px; border: 1px solid #ddd; text-align: left; 
}
th { background-color: #1a1a2e; color: white; 
}
.erro { color: red; font-size: 14px; 
}
</style>