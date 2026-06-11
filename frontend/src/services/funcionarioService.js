import api from './api.js'

export const listarFuncionarios = (search = "") => api.get('/funcionarios', { params: { search } })
export const criarFuncionario = (dados) => api.post('/funcionarios', dados)
export const atualizarFuncionario = (id, dados) => api.put(`/funcionarios/${id}`, dados)
export const deletarFuncionario = (id) => api.delete(`/funcionarios/${id}`)