const { Cliente } = require("../models");

class ClienteController {
  async criar(req, res) {
    try {
      const { nome, telefone, email } = req.body;
      const clienteExistente = await Cliente.findOne({ where: { email } });

      if (clienteExistente) {
        return res.status(400).json({ error: "Cliente com este email já existe." });
      }
      if (!nome || !telefone || !email) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      const novoCliente = await Cliente.create({ nome, telefone, email });
      return res.status(201).json(novoCliente);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar cliente." });
    }
  }

  async listar(req, res) {
    try {
      const clientes = await Cliente.findAll();
      return res.status(200).json(clientes);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar clientes." });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }
      return res.status(200).json(cliente);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar cliente." });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, telefone, email } = req.body;

      // O update retorna um array, pegamos o primeiro item (linhas afetadas)
      const [linhasAtualizadas] = await Cliente.update({ nome, telefone, email }, { where: { id } });
      
      if (linhasAtualizadas === 0) {
        return res.status(404).json({ error: "Cliente não encontrado para atualização." });
      }

      return res.status(200).json({ message: "Cliente atualizado com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar cliente." });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      
      // O destroy retorna o número de linhas deletadas
      const linhasDeletadas = await Cliente.destroy({ where: { id } });
      
      if (linhasDeletadas === 0) {
        return res.status(404).json({ error: "Cliente não encontrado para exclusão." });
      }

      return res.status(200).json({ message: "Cliente deletado com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar cliente." });
    }
  }
}

module.exports = new ClienteController();