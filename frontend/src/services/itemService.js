import api from './api.js'

export const listarItens = () => api.get('/itens')
export const criarItem = (dados) => api.post('/itens', dados)
export const atualizarItem = (id, dados) => api.put(`/itens/${id}`, dados)
export const deletarItem = (id) => api.delete(`/itens/${id}`)