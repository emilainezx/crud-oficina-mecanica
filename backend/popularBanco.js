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
    await OrdemItem.destroy({ where: {}, truncate: true, cascade: true });
    await OrdemServico.destroy({ where: {}, truncate: true, cascade: true });
    await Item.destroy({ where: {}, truncate: true, cascade: true });
    await Veiculo.destroy({ where: {}, truncate: true, cascade: true });
    await Cliente.destroy({ where: {}, truncate: true, cascade: true });
    await Funcionario.destroy({ where: {}, truncate: true, cascade: true });

    console.log('--- INICIANDO MODO TURBO: GERANDO CENTENAS DE DADOS ---');

    // 1. GERANDO 10 MECÂNICOS
    const funcData = [];
    for (let i = 1; i <= 10; i++) {
      funcData.push({
        nome: `Mecanico Profissional ${i}`,
        cpf: `111.222.333-${i.toString().padStart(2, '0')}`,
        cargo: i % 3 === 0 ? 'Mecanico Senior' : 'Mecanico Pleno',
        telefone: `(81) 99999-00${i.toString().padStart(2, '0')}`,
        salario: 3000 + (i * 150)
      });
    }
    const funcionarios = await Funcionario.bulkCreate(funcData);

    // 2. GERANDO 50 CLIENTES
    const nomesClientes = ["Allyson", "Marcelo", "Emilaine", "Joao", "Maria", "Carlos", "Ana", "Pedro", "Paulo", "Lucas", "Mariana", "Fernanda", "Rafael", "Juliana", "Diego"];
    const sobrenomes = ["Pontes", "Souza", "Bernardo", "Silva", "Santos", "Oliveira", "Lima", "Ferreira", "Costa", "Gomes", "Alves", "Ribeiro", "Mendes", "Cardoso", "Rocha"];
    const clienteData = [];
    for (let i = 0; i < 50; i++) {
      let nome = `${nomesClientes[i % nomesClientes.length]} ${sobrenomes[(i + 3) % sobrenomes.length]} ${sobrenomes[(i + 7) % sobrenomes.length]}`;
      clienteData.push({
        nome: nome,
        email: `cliente${i + 1}@email.com`,
        telefone: `(81) 98888-${1000 + i}`
      });
    }
    const clientes = await Cliente.bulkCreate(clienteData);

    // 3. GERANDO 80 VEÍCULOS
    const marcas = ["Toyota", "Honda", "Chevrolet", "Jeep", "Fiat", "Volkswagen", "Ford", "Hyundai"];
    const modelos = ["Corolla", "Civic", "Onix", "Compass", "Argo", "Polo", "Ka", "HB20"];
    const veiculoData = [];
    for (let i = 0; i < 80; i++) {
      // Mistura placa Mercosul (ABC1D23) e placa antiga (XYZ-1234)
      let placaFormatada = i % 2 === 0 
        ? `ABC${i % 9}${String.fromCharCode(65 + (i % 26))}${10 + (i % 89)}` 
        : `XYZ-${1000 + i}`;

      veiculoData.push({
        cliente_id: clientes[i % 50].id, // Distribui entre os 50 clientes
        marca: marcas[i % 8],
        modelo: modelos[(i + 2) % 8],
        placa: placaFormatada,
        ano: 2010 + (i % 16)
      });
    }
    const veiculos = await Veiculo.bulkCreate(veiculoData);

    // 4. GERANDO 20 PEÇAS E SERVIÇOS
    const itemData = [];
    for (let i = 1; i <= 20; i++) {
      let isPeca = i % 2 !== 0;
      itemData.push({
        nome: isPeca ? `Peca Automotiva Premium ${i}` : `Servico Especializado ${i}`,
        descricao: isPeca ? `Peca original de fabrica com garantia.` : `Mao de obra qualificada.`,
        preco: 50.0 + (i * 25.5),
        tipo: isPeca ? 'Peca' : 'Servico',
        quantidade: isPeca ? 100 + i : 999
      });
    }
    const itens = await Item.bulkCreate(itemData);

    // 5. GERANDO 200 ORDENS DE SERVIÇO 
    const statusList = ['Concluída', 'Em Andamento', 'Aberta', 'Cancelada', 'Concluída']; // Mais peso para concluídas
    const ordensData = [];
    for (let i = 1; i <= 200; i++) {
      let status = statusList[i % 5];
      // Gera datas aleatórias espalhadas pelos meses de 2026
      let mesAbertura = (i % 6) + 1; // Meses de 1 a 6
      let diaAbertura = (i % 28) + 1;
      
      let dataAbertura = new Date(`2026-0${mesAbertura}-${diaAbertura.toString().padStart(2, '0')}`);
      let dataConclusao = null;

      if (status === 'Concluída') {
        // Conclui 1 ou 2 dias depois
        dataConclusao = new Date(dataAbertura);
        dataConclusao.setDate(dataConclusao.getDate() + (i % 3) + 1);
      }

      ordensData.push({
        veiculo_id: veiculos[i % 80].id,
        funcionario_id: funcionarios[i % 10].id,
        status: status,
        data_abertura: dataAbertura,
        data_conclusao: dataConclusao,
        valor_total: 150 + (i * 12.5) // Valores aleatórios e altos
      });
    }
    const ordens = await OrdemServico.bulkCreate(ordensData);

    // 6. VINCULANDO 600 ITENS NAS 200 ORDENS DE SERVIÇO (3 itens por OS)
    const ordemItemData = [];
    for (let i = 0; i < 200; i++) {
      ordemItemData.push({ os_id: ordens[i].id, item_id: itens[i % 20].id, quantidade: 1 });
      ordemItemData.push({ os_id: ordens[i].id, item_id: itens[(i + 3) % 20].id, quantidade: 2 });
      ordemItemData.push({ os_id: ordens[i].id, item_id: itens[(i + 7) % 20].id, quantidade: 1 });
    }
    
    await OrdemItem.bulkCreate(ordemItemData, { validate: true });

    console.log('--- SUCESSO ABSOLUTO! 200 Ordens e centenas de dados injetados! ---');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular banco:', error);
    process.exit(1);
  }
}

popular();