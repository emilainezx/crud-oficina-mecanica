<script setup></script>

<template>
  <nav>
    <RouterLink to="/clientes">Clientes</RouterLink>
    <RouterLink to="/veiculos">Veículos</RouterLink>
    <RouterLink to="/funcionarios">Funcionários</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
nav {
  padding: 16px;
  background-color: #1a1a2e;
  display: flex;
  gap: 16px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  color: #e94560;
}
</style>