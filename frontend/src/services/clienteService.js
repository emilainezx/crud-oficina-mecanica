import api from './api.js'

export const listarClientes = (search = "") => api.get('/clientes', { params: { search } })
export const criarCliente = (dados) => api.post('/clientes', dados)
export const atualizarCliente = (id, dados) => api.put(`/clientes/${id}`, dados)
export const deletarCliente = (id) => api.delete(`/clientes/${id}`)