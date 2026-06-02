<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { 
  PhUsers, 
  PhCar, 
  PhWrench, 
  PhDesktopTower, 
  PhIdentificationBadge, 
  PhPackage, 
  PhClipboardText 
} from "@phosphor-icons/vue"
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
      <div class="p-6 border-b border-slate-700 flex items-center gap-3">
        <PhWrench :size="32" weight="duotone" class="text-blue-400" />
        <h1 class="text-xl font-bold tracking-wider">Oficina<span class="text-blue-400">Pro</span></h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-2">
        <RouterLink to="/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white" exact-active-class="bg-slate-800 text-white">
          <PhDesktopTower :size="24" />
          <span>Dashboard</span>
        </RouterLink>
        
        <RouterLink to="/clientes" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white" active-class="bg-slate-800 text-white">
          <PhUsers :size="24" />
          <span>Clientes</span>
        </RouterLink>
        
        <RouterLink to="/veiculos" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white" active-class="bg-slate-800 text-white">
          <PhCar :size="24" />
          <span>Veículos</span>
        </RouterLink>
        
        <RouterLink to="/funcionarios" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white" active-class="bg-slate-800 text-white">
          <PhIdentificationBadge :size="24" />
          <span>Funcionários</span>
        </RouterLink>
        
        <RouterLink to="/itens" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white" active-class="bg-slate-800 text-white">
          <PhPackage :size="24" />
          <span>Peças/Serviços</span>
        </RouterLink>
        
        <RouterLink to="/ordens" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white" active-class="bg-slate-800 text-white">
          <PhClipboardText :size="24" />
          <span>Ordens de Serviço</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto p-8">
      <RouterView />
    </main>
  </div>
</template>