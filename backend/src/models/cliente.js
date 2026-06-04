'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      // Um Cliente tem muitos Veículos
      Cliente.hasMany(models.Veiculo, { 
        foreignKey: 'cliente_id', 
        as: 'veiculos' 
      });
    }
  }
  Cliente.init({
    nome: DataTypes.STRING,
    telefone: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};