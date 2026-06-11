import api from './api.js'

export const listarVeiculos = (search = "") => api.get('/veiculos', { params: { search } })
export const criarVeiculo = (dados) => api.post('/veiculos', dados)
export const atualizarVeiculo = (id, dados) => api.put(`/veiculos/${id}`, dados)
export const deletarVeiculo = (id) => api.delete(`/veiculos/${id}`)