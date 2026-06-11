const { OrdemServico, Veiculo, Funcionario } = require("../models");
const { Op } = require("sequelize");

class OrdemServicoController {
  async criar(req, res) {
    try {
      const {
        veiculo_id,
        funcionario_id,
        status,
        data_abertura,
        data_conclusao,
        valor_total,
      } = req.body;

      if (!veiculo_id || !funcionario_id || !status || !valor_total) {
        return res
          .status(400)
          .json({ error: "Preencha todos os campos obrigatórios." });
      }

      const veiculoExistente = await Veiculo.findByPk(veiculo_id);
      const funcionarioExistente = await Funcionario.findByPk(funcionario_id);

      if (!veiculoExistente) {
        return res.status(404).json({ error: "Veículo não encontrado." });
      }

      if (!funcionarioExistente) {
        return res.status(404).json({ error: "Funcionário não encontrado." });
      }

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
        where: search
          ? { status: { [Op.iLike]: `%${search}%` } }
          : {},
        include: [
          {
            model: Veiculo,
            as: "veiculo",
            ...(search
              ? {
                  where: {
                    [Op.or]: [
                      { marca: { [Op.iLike]: `%${search}%` } },
                      { modelo: { [Op.iLike]: `%${search}%` } },
                      { placa: { [Op.iLike]: `%${search}%` } },
                    ],
                  },
                  required: false,
                }
              : { required: false }),
          },
          {
            model: Funcionario,
            as: "funcionario",
            ...(search
              ? {
                  where: {
                    nome: { [Op.iLike]: `%${search}%` },
                  },
                  required: false,
                }
              : { required: false }),
          },
        ],
      });

      const resultado = search
        ? ordensServico.filter((os) => {
            const termo = search.toLowerCase();
            const bateuStatus = os.status.toLowerCase().includes(termo);
            const bateuVeiculo =
              os.veiculo &&
              [os.veiculo.marca, os.veiculo.modelo, os.veiculo.placa].some(
                (campo) => campo?.toLowerCase().includes(termo),
              );
            const bateuMecanico =
              os.funcionario &&
              os.funcionario.nome?.toLowerCase().includes(termo);
            return bateuStatus || bateuVeiculo || bateuMecanico;
          })
        : ordensServico;

      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao listar ordens de serviço." });
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

      const {
        veiculo_id,
        funcionario_id,
        status,
        data_abertura,
        data_conclusao,
        valor_total,
      } = req.body;

      await OrdemServico.update(
        {
          veiculo_id,
          funcionario_id,
          status,
          data_abertura,
          data_conclusao,
          valor_total,
        },
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