const { OrdemServico, Veiculo, Funcionario } = require("../models");
const { Op } = require('sequelize');

class OrdemServicoController {
  async criar(req, res) {
    try {
      // 1. Adiciona as datas aqui para o back-end receber do front-end
      const { veiculo_id, funcionario_id, status, data_abertura, data_conclusao, valor_total } = req.body;

      if (!veiculo_id || !funcionario_id || !status || !valor_total) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
      }

      const veiculoExistente = await Veiculo.findByPk(veiculo_id);
      const funcionarioExistente = await Funcionario.findByPk(funcionario_id);

      if (!veiculoExistente) {
        return res.status(404).json({ error: "Veículo não encontrado." });
      }

      if (!funcionarioExistente) {
        return res.status(404).json({ error: "Funcionário não encontrado." });
      }

      // 2. Repassa as datas para o banco salvar no Supabase
      const novaOrdemServico = await OrdemServico.create({
        veiculo_id,
        funcionario_id,
        status,
        data_abertura, 
        data_conclusao,
        valor_total,
      });

      return res.status(201).json(novaOrdemServico);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar ordem de serviço." });
    }
  }

async listar(req, res) {
    try {
        const { search } = req.query;

        const ordensServico = await OrdemServico.findAll({
            where: search ? {
                status: {
                    [Op.iLike]: `%${search}%`
                }
            } : {},
            include: [
                { model: Veiculo, as: "veiculo" },
                { model: Funcionario, as: "funcionario" },
            ],
        });

        return res.status(200).json(ordensServico);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar ordens de serviço." });
    }
}

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const ordemServico = await OrdemServico.findByPk(id, {
        include: [
          { model: Veiculo, as: "veiculo" },
          { model: Funcionario, as: "funcionario" },
        ],
      });
      if (!ordemServico) {
        return res
          .status(404)
          .json({ error: "Ordem de serviço não encontrada." });
      }
      return res.status(200).json(ordemServico);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar ordem de serviço." });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      
      // 3. Adicionada as datas aqui também no momento da edição
      const { veiculo_id, funcionario_id, status, data_abertura, data_conclusao, valor_total } = req.body;

      // 4. Repassa as datas para o update no banco
      await OrdemServico.update(
        { veiculo_id, funcionario_id, status, data_abertura, data_conclusao, valor_total },
        { where: { id } },
      );
      res
        .status(200)
        .json({ message: "Ordem de serviço atualizada com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar ordem de serviço." });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await OrdemServico.destroy({ where: { id } });
      res
        .status(200)
        .json({ message: "Ordem de serviço deletada com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar ordem de serviço." });
    }
  }
}

module.exports = new OrdemServicoController();