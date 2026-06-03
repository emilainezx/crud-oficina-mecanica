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
    console.log('🧹 --- Limpando banco de dados antigo ---');
    // A ordem aqui é inversa para evitar erro de Foreign Key
    await OrdemItem.destroy({ where: {}, truncate: true, cascade: true });
    await OrdemServico.destroy({ where: {}, truncate: true, cascade: true });
    await Item.destroy({ where: {}, truncate: true, cascade: true });
    await Veiculo.destroy({ where: {}, truncate: true, cascade: true });
    await Cliente.destroy({ where: {}, truncate: true, cascade: true });
    await Funcionario.destroy({ where: {}, truncate: true, cascade: true });

    console.log('🌱 --- Semeando novos dados ---');

    // 1. Criando Mecânicos
    const funcionarios = await Funcionario.bulkCreate([
      { nome: 'Marcos Silva', cargo: 'Mecânico Sênior', telefone: '81999990001' },
      { nome: 'Roberto Motor', cargo: 'Mecânico Pleno', telefone: '81999990002' },
      { nome: 'Ana Souza', cargo: 'Supervisora de Oficina', telefone: '81999990003' }
    ]);

    // 2. Criando Clientes
    const clientes = await Cliente.bulkCreate([
      { nome: 'João Pedro', email: 'joao@email.com', telefone: '81988881111' },
      { nome: 'Maria Clara', email: 'maria@email.com', telefone: '81988882222' },
      { nome: 'Carlos Eduardo', email: 'cadu@email.com', telefone: '81988883333' }
    ]);

    // 3. Criando a Frota
    const veiculos = await Veiculo.bulkCreate([
      { cliente_id: clientes[0].id, marca: 'Toyota', modelo: 'Corolla', placa: 'ABC1D23', ano: 2021 },
      { cliente_id: clientes[1].id, marca: 'Honda', modelo: 'Civic', placa: 'XYZ9W87', ano: 2020 },
      { cliente_id: clientes[2].id, marca: 'Chevrolet', modelo: 'Onix', placa: 'QWE4R56', ano: 2022 },
      { cliente_id: clientes[0].id, marca: 'Jeep', modelo: 'Compass', placa: 'JEP0K99', ano: 2023 } // João tem 2 carros
    ]);

    // 4. Criando Estoque e Serviços
    const itens = await Item.bulkCreate([
      { nome: 'Óleo Sintético 5W30', descricao: 'Troca de óleo padrão', valor: 65.00 },
      { nome: 'Filtro de Óleo', descricao: 'Filtro original', valor: 35.00 },
      { nome: 'Pastilha de Freio', descricao: 'Jogo de pastilhas dianteiras', valor: 150.00 },
      { nome: 'Alinhamento 3D', descricao: 'Serviço de alinhamento e balanceamento', valor: 120.00 },
      { nome: 'Correia Dentada', descricao: 'Kit completo de correia e tensor', valor: 380.00 }
    ]);

    // 5. Criando Ordens de Serviço (Cobrindo todos os status)
    const ordens = await OrdemServico.bulkCreate([
      // OS Concluída (Faturou)
      { veiculo_id: veiculos[0].id, funcionario_id: funcionarios[0].id, status: 'Concluída', data_abertura: new Date('2026-06-01'), data_conclusao: new Date('2026-06-02'), valor_total: 220.00 },
      
      // OS Em Andamento (Mão na graxa)
      { veiculo_id: veiculos[1].id, funcionario_id: funcionarios[1].id, status: 'Em Andamento', data_abertura: new Date(), valor_total: 500.00 },
      
      // OS Aberta (Aguardando começar)
      { veiculo_id: veiculos[2].id, funcionario_id: funcionarios[0].id, status: 'Aberta', data_abertura: new Date(), valor_total: 120.00 },
      
      // OS Cancelada (Cliente desistiu)
      { veiculo_id: veiculos[3].id, funcionario_id: funcionarios[2].id, status: 'Cancelada', data_abertura: new Date('2026-06-03'), valor_total: 380.00 }
    ]);

    // 6. Vinculando Itens nas Ordens de Serviço
    await OrdemItem.bulkCreate([
      // OS 1 usou: Óleo e Filtro e Alinhamento
      { ordem_servico_id: ordens[0].id, item_id: itens[0].id, quantidade: 1 },
      { ordem_servico_id: ordens[0].id, item_id: itens[1].id, quantidade: 1 },
      { ordem_servico_id: ordens[0].id, item_id: itens[3].id, quantidade: 1 },
      
      // OS 2 usou: Alinhamento e Correia Dentada
      { ordem_servico_id: ordens[1].id, item_id: itens[3].id, quantidade: 1 },
      { ordem_servico_id: ordens[1].id, item_id: itens[4].id, quantidade: 1 },

      // OS 3 usou: Apenas Alinhamento
      { ordem_servico_id: ordens[2].id, item_id: itens[3].id, quantidade: 1 },

      // OS 4 (Cancelada) ia usar: Correia Dentada
      { ordem_servico_id: ordens[3].id, item_id: itens[4].id, quantidade: 1 }
    ]);

    console.log('✅ --- Banco populado com sucesso! Painel pronto para uso! ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
}

popular();