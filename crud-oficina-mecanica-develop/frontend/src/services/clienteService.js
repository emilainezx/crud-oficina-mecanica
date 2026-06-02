import api from './api.js'

export const listarClientes = () => api.get('/clientes')
export const criarCliente = (dados) => api.post('/clientes', dados)
export const atualizarCliente = (id, dados) => api.put(`/clientes/${id}`, dados)
export const deletarCliente = (id) => api.delete(`/clientes/${id}`)