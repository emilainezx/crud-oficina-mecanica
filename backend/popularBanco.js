const {
  Cliente,
  Funcionario,
  Veiculo,
  Item,
  OrdemServico,
  OrdemItem
} = require('./src/models')

async function popular() {
  try {
    console.log('--- Limpando banco de dados ---');
    // A ordem aqui é inversa para evitar erro de Foreign Key
    await OrdemItem.destroy({ where: {}, truncate: true, cascade: true });
    await OrdemServico.destroy({ where: {}, truncate: true, cascade: true });
    await Item.destroy({ where: {}, truncate: true, cascade: true });
    await Veiculo.destroy({ where: {}, truncate: true, cascade: true });
    await Cliente.destroy({ where: {}, truncate: true, cascade: true });
    await Funcionario.destroy({ where: {}, truncate: true, cascade: true });

    console.log('--- Populando banco ---');

    const funcionarios = await Funcionario.bulkCreate([
      { nome: 'João Mecânico', cargo: 'Mecânico', telefone: '81999990001' },
      { nome: 'Carlos Silva', cargo: 'Mecânico', telefone: '81999990002' },
      { nome: 'Pedro Santos', cargo: 'Supervisor', telefone: '81999990003' }
    ]);

    const clientes = await Cliente.bulkCreate([
      { nome: 'Allyson Pontes', email: 'allyson@email.com', telefone: '81999991111' },
      { nome: 'Maria Oliveira', email: 'maria@email.com', telefone: '81999992222' },
      { nome: 'José Lima', email: 'jose@email.com', telefone: '81999993333' }
    ]);

    const veiculos = await Veiculo.bulkCreate([
      { cliente_id: clientes[0].id, marca: 'Toyota', modelo: 'Corolla', placa: 'QWE1A23', ano: 2020 },
      { cliente_id: clientes[1].id, marca: 'Honda', modelo: 'Civic', placa: 'RTY2B34', ano: 2019 },
      { cliente_id: clientes[2].id, marca: 'Chevrolet', modelo: 'Onix', placa: 'UIO3C45', ano: 2022 }
    ]);

    const itens = await Item.bulkCreate([
      { nome: 'Óleo 5W30', descricao: 'Lubrificante sintético', valor: 45 },
      { nome: 'Filtro de Óleo', descricao: 'Filtro para motor', valor: 25 },
      { nome: 'Pastilha de Freio', descricao: 'Jogo dianteiro', valor: 120 },
      { nome: 'Correia Dentada', descricao: 'Kit completo', valor: 280 }
    ]);

    const ordens = await OrdemServico.bulkCreate([
      { veiculo_id: veiculos[0].id, funcionario_id: funcionarios[0].id, status: 'Aberta', data_abertura: new Date(), valor_total: 70 },
      { veiculo_id: veiculos[1].id, funcionario_id: funcionarios[1].id, status: 'Em Andamento', data_abertura: new Date(), valor_total: 145 },
      { veiculo_id: veiculos[2].id, funcionario_id: funcionarios[2].id, status: 'Concluída', data_abertura: new Date(), data_conclusao: new Date(), valor_total: 400 }
    ]);

    await OrdemItem.bulkCreate([
      { ordem_servico_id: ordens[0].id, item_id: itens[0].id, quantidade: 1 },
      { ordem_servico_id: ordens[0].id, item_id: itens[1].id, quantidade: 1 },
      { ordem_servico_id: ordens[1].id, item_id: itens[2].id, quantidade: 1 },
      { ordem_servico_id: ordens[2].id, item_id: itens[3].id, quantidade: 1 }
    ]);

    console.log('--- Banco populado com sucesso! ---');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular banco:', error);
    process.exit(1);
  }
}

popular();