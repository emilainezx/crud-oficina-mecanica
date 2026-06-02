# Como rodar o projeto

## Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 14 ou superior)

## Passo a passo

### 1. Clonar o repositório

```bash
git clone <url do repositório>
cd crud-oficina-mecanica-teste
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o banco de dados

- Abra o pgAdmin
- Crie um banco de dados com o nome que desejar
- Copie o arquivo `.env.example`, renomeie para `.env` e preencha com suas credenciais

### 4. Rodar as migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Rodar o projeto

```bash
npm run dev
```

O servidor vai rodar em `http://localhost:3333`