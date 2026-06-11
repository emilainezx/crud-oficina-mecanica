import api from './api.js'

export const listarItens = (search = "") => api.get('/itens', { params: { search } })
export const criarItem = (dados) => api.post('/itens', dados)
export const atualizarItem = (id, dados) => api.put(`/itens/${id}`, dados)
export const deletarItem = (id) => api.delete(`/itens/${id}`)