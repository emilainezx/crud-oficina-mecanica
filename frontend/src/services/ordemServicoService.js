import api from './api.js'

export const listarOrdens = () => api.get('/ordens-servico')
export const criarOrdem = (dados) => api.post('/ordens-servico', dados)
export const atualizarOrdem = (id, dados) => api.put(`/ordens-servico/${id}`, dados)
export const deletarOrdem = (id) => api.delete(`/ordens-servico/${id}`)