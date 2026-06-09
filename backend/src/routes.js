const { Router } = require("express");
const FuncionarioController = require("./controllers/FuncionarioController");
const ClienteController = require("./controllers/ClienteController");
const VeiculoController = require("./controllers/VeiculoController");
const ItemController = require("./controllers/ItemController");
const OrdemServicoController = require("./controllers/OrdemServicoController");

const routes = Router();

routes.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server on" });
});

routes.post('/funcionarios', FuncionarioController.criar);
routes.get('/funcionarios', FuncionarioController.listar);
routes.get('/funcionarios/:id', FuncionarioController.buscarPorId);
routes.put('/funcionarios/:id', FuncionarioController.atualizar);
routes.delete('/funcionarios/:id', FuncionarioController.deletar);

routes.post('/clientes', ClienteController.criar);
routes.get('/clientes', ClienteController.listar);
routes.get('/clientes/:id', ClienteController.buscarPorId);
routes.put('/clientes/:id', ClienteController.atualizar);
routes.delete('/clientes/:id', ClienteController.deletar);  

routes.post('/veiculos', VeiculoController.criar);
routes.get('/veiculos', VeiculoController.listar);
routes.get('/veiculos/:id', VeiculoController.buscarPorId);
routes.put('/veiculos/:id', VeiculoController.atualizar);
routes.delete('/veiculos/:id', VeiculoController.deletar);

routes.post('/itens', ItemController.criar);
routes.get('/itens', ItemController.listar);
routes.get('/itens/:id', ItemController.buscarPorId);
routes.put('/itens/:id', ItemController.atualizar);
routes.delete('/itens/:id', ItemController.deletar);

routes.post('/ordens-servico', OrdemServicoController.criar);
routes.get('/ordens-servico', OrdemServicoController.listar);
routes.get('/ordens-servico/:id', OrdemServicoController.buscarPorId);
routes.put('/ordens-servico/:id', OrdemServicoController.atualizar);
routes.delete('/ordens-servico/:id', OrdemServicoController.deletar);

module.exports = routes;
