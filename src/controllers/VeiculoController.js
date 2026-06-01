const { Veiculo } = require("../models");

class VeiculoController {
  async criar(req, res) {
    try {
      const { cliente_id, marca, modelo, ano, placa } = req.body;

      if (!cliente_id || !marca || !modelo || !ano || !placa) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      const placaExistente = await Veiculo.findOne({ where: { placa } });
      if (placaExistente) {
        return res.status(400).json({ error: "Placa já cadastrada." });
      }

      const novoVeiculo = await Veiculo.create({ cliente_id, marca, modelo, ano, placa });
      res.status(201).json(novoVeiculo);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar veículo." });
    }
  }

  async listar(req, res) {
    try {
      const veiculos = await Veiculo.findAll();
      res.status(200).json(veiculos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar veículos." });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id);
      
      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado." });
      }
      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar veículo." });
    }
  }
  
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { cliente_id, marca, modelo, ano, placa } = req.body;

      const [linhasAtualizadas] = await Veiculo.update(
        { cliente_id, marca, modelo, ano, placa },
        { where: { id } }
      );

      if (linhasAtualizadas === 0) {
        return res.status(404).json({ error: "Veículo não encontrado para atualização." });
      }

      res.status(200).json({ message: "Veículo atualizado com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar veículo." });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const linhasDeletadas = await Veiculo.destroy({ where: { id } });
      
      if (linhasDeletadas === 0) {
        return res.status(404).json({ error: "Veículo não encontrado para exclusão." });
      }

      res.status(200).json({ message: "Veículo deletado com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar veículo." });
    }
  }
}

module.exports = new VeiculoController();