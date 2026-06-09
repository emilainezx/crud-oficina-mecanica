import api from './api.js'

export const listarFuncionarios = () => api.get('/funcionarios')
export const criarFuncionario = (dados) => api.post('/funcionarios', dados)
export const atualizarFuncionario = (id, dados) => api.put(`/funcionarios/${id}`, dados)
export const deletarFuncionario = (id) => api.delete(`/funcionarios/${id}`)