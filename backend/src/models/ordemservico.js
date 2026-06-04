'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrdemServico extends Model {
    static associate(models) {
      // Uma OS sempre pertence a um Veículo e a um Funcionário responsável
      OrdemServico.belongsTo(models.Veiculo, { foreignKey: 'veiculo_id', as: 'veiculo' });
      OrdemServico.belongsTo(models.Funcionario, { foreignKey: 'funcionario_id', as: 'funcionario' });
    }
  }
  OrdemServico.init({
    veiculo_id: DataTypes.INTEGER,
    funcionario_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    data_abertura: DataTypes.DATE,
    data_conclusao: DataTypes.DATE,
    valor_total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'OrdemServico',
  });
  return OrdemServico;
};