'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Funcionario extends Model {
    static associate(models) {
      // Um Funcionário atende/tem muitas Ordens de Serviço
      Funcionario.hasMany(models.OrdemServico, {
        foreignKey: 'funcionario_id',
        as: 'ordens_servico'
      });
    }
  }
  Funcionario.init({
    cpf: DataTypes.STRING,
    telefone: DataTypes.STRING,
    salario: DataTypes.DECIMAL,
    cargo: DataTypes.STRING,
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Funcionario',
  });
  return Funcionario;
};