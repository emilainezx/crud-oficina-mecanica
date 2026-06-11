const { Funcionario } = require("../models");
const { Op } = require("sequelize");

class FuncionarioController {
  async criar(req, res) {
    try {
      const { nome, cpf, telefone, cargo, salario } = req.body;

      const funcionarioExistente = await Funcionario.findOne({
        where: { cpf },
      });

      if (funcionarioExistente) {
        return res
          .status(400)
          .json({ error: "Funcionário com este CPF já existe." });
      }

      if (!nome || !cpf || !telefone || !cargo || !salario) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios." });
      }

      const novoFuncionario = await Funcionario.create({
        nome,
        cpf,
        telefone,
        cargo,
        salario,
      });

      return res.status(201).json(novoFuncionario);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar funcionário." });
    }
  }

  async listar(req, res) {
    try {
      const termo = req.query.search?.trim();

      const funcionarios = await Funcionario.findAll({
        where: termo
          ? {
              [Op.or]: [
                { nome: { [Op.iLike]: `%${termo}%` } },
                { cpf: { [Op.iLike]: `%${termo}%` } },
                { cargo: { [Op.iLike]: `%${termo}%` } },
                { telefone: { [Op.iLike]: `%${termo}%` } },
              ],
            }
          : {},
      });
      return res.status(200).json(funcionarios);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao listar funcionários." });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const funcionarioEncontrado = await Funcionario.findByPk(id);

      if (!funcionarioEncontrado) {
        return res.status(404).json({ error: "Funcionário não encontrado." });
      }

      return res.status(200).json(funcionarioEncontrado);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar funcionário." });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cpf, telefone, cargo, salario } = req.body;

      await Funcionario.update(
        { nome, cpf, telefone, cargo, salario },
        { where: { id } },
      );

      return res
        .status(200)
        .json({ message: "Funcionário atualizado com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar funcionário." });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;

      await Funcionario.destroy({ where: { id } });

      return res
        .status(200)
        .json({ message: "Funcionário deletado com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar funcionário." });
    }
  }
}

module.exports = new FuncionarioController();