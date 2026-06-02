import { createRouter, createWebHistory } from 'vue-router'

import ClientesView from '../views/ClientesView.vue'
import VeiculosView from '../views/VeiculosView.vue'
import FuncionariosView from '../views/FuncionariosView.vue'

const routes = [
  { path: '/', redirect: '/clientes' },
  { path: '/clientes', component: ClientesView },
  { path: '/veiculos', component: VeiculosView },
  { path: '/funcionarios', component: FuncionariosView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router