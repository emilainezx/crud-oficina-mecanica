'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Veiculo extends Model {
    static associate(models) {
      // Um Veículo pertence a um Cliente
      Veiculo.belongsTo(models.Cliente, { 
        foreignKey: 'cliente_id', 
        as: 'cliente' 
      });
    }
  }
  Veiculo.init({
    cliente_id: DataTypes.INTEGER,
    marca: DataTypes.STRING,
    ano: DataTypes.INTEGER,
    placa: DataTypes.STRING,
    modelo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Veiculo',
  });
  return Veiculo;
};