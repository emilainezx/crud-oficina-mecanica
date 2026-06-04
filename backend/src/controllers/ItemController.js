const { Item } = require("../models");

class ItemController {
  async criar(req, res) {
    try {
      const { nome, descricao, preco, tipo, quantidade } = req.body;

      if (!nome || !descricao || !preco) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios." });
      }

      const novoItem = await Item.create({
        nome,
        descricao,
        preco,
        tipo,
        quantidade
      });

      return res.status(201).json(novoItem);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar item." });
    }
  }

  async listar(req, res) {
    try {
      const itens = await Item.findAll();
      return res.status(200).json(itens);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao listar itens." });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const itemEncontrado = await Item.findByPk(id);

      if (!itemEncontrado) {
        return res.status(404).json({ error: "Item não encontrado." });
      }

      return res.status(200).json(itemEncontrado);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao buscar item." });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, tipo, quantidade } = req.body;

      await Item.update({ nome, descricao, preco, tipo, quantidade }, { where: { id } });

      return res.status(200).json({ message: "Item atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao atualizar item." });
    }
  }
  async deletar(req, res) {
    try {
      const { id } = req.params;

      await Item.destroy({ where: { id } });

      return res.status(200).json({ message: "Item deletado com sucesso." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao deletar item." });
    }
  }
}

module.exports = new ItemController();