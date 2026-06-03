import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import ClientesView from '../views/ClientesView.vue'
import VeiculosView from '../views/VeiculosView.vue'
import FuncionariosView from '../views/FuncionariosView.vue'
import ItensView from '../views/ItensView.vue'
import OrdemServicosView from '../views/OrdemServicosView.vue'

const routes = [
  { path: '/', component: DashboardView },
  { path: '/clientes', component: ClientesView },
  { path: '/veiculos', component: VeiculosView },
  { path: '/funcionarios', component: FuncionariosView },
  { path: '/itens', component: ItensView },
  { path: '/ordens', component: OrdemServicosView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router