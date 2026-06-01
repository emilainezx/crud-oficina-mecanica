# 🚗 OficinaPro | Sistema de Gerenciamento Mecânico

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

> **Projeto desenvolvido para a AV2 da disciplina de Backend.**

O **OficinaPro** é uma aplicação CRUD completa e escalável projetada para o gerenciamento de ponta a ponta de uma oficina mecânica. O sistema moderniza o fluxo de trabalho, permitindo o controle preciso de clientes, frota de veículos, equipe técnica, estoque de peças/serviços e faturamento através de Ordens de Serviço (OS).

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/AllyPts/crud-oficina-mecanica.git
cd crud-oficina-mecanica
```

### 2. Instalar Dependências do Back-end

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=db.ogbenbueelrbbuxzcatz.supabase.co
DB_USER=postgres
DB_PASSWORD=Oficina@2026
DB_NAME=postgres
DB_PORT=5432
DB_DIALECT=postgres
PORT=3333
```

### 4. Executar as Migrações

```bash
npx sequelize-cli db:migrate
```

### 5. Iniciar o Back-end

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3333
```

### 6. Iniciar o Front-end

Abra um novo terminal:

```bash
cd oficina-frontend
npm install
npm run dev
```

O sistema estará disponível em:

```text
http://localhost:5173
```

---

## 🖼️ Demonstração do Sistema

| Funcionalidade | Print da Interface | Dados no Supabase |
| :--- | :---: | :---: |
| **Dashboard** | ![Dashboard](assets/Dashboard.png) | |
| **Clientes** | ![Clientes](assets/Clientes.png) | ![Clientes Supabase](assets/Clientes_sup.png) |
| **Veículos** | ![Veículos](assets/Veículos.png) | ![Veículos Supabase](assets/Veículos_sup.png) |
| **Funcionários** | ![Funcionários](assets/Funcionários.png) | ![Funcionários Supabase](assets/Funcionários_sup.png) |
| **Peças/Serviços** | ![Peças e Serviços](assets/Peças_Serviços.png) | ![Peças e Serviços Supabase](assets/Peças_Serviços_sup.png) |
| **Ordens de Serviço** | ![Ordens de Serviço](assets/Ordens_de_Serviço.png) | ![Ordens de Serviço Supabase](assets/Ordens_de_Serviço_sup.png) |
---

## ✨ Funcionalidades

- 👥 **Gestão de Clientes:** Cadastro e controle de proprietários.
- 🚗 **Frota de Veículos:** Registro detalhado de veículos vinculados aos clientes (1:N).
- 🛠️ **Equipe Técnica:** Gerenciamento de mecânicos e funcionários.
- ⚙️ **Catálogo de Estoque:** Controle de peças e serviços oferecidos.
- 📋 **Ordens de Serviço (OS):** Abertura, acompanhamento de status (Aberta, Em Andamento, Concluída, Cancelada) e faturamento de serviços vinculando veículos, mecânicos e itens (N:N).
- 🔌 **Integração Full-Stack:** API RESTful robusta no back-end alimentando um dashboard interativo no front-end em tempo real.

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as ferramentas mais modernas do mercado, separando a aplicação em uma arquitetura Full-Stack (Client-Server):

### 💻 Front-end (Interface)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

* **[React](https://react.dev/):** Biblioteca JavaScript para construção de interfaces dinâmicas e reativas.
* **[Vite](https://vitejs.dev/):** Build tool ultra-rápido utilizado para iniciar e empacotar o projeto React.
* **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS utilitário para estilização rápida, responsiva e moderna direto no HTML.
* **[Axios](https://axios-http.com/):** Cliente HTTP baseado em Promises para consumo da nossa API.+
* **[Phosphor Icons](https://phosphoricons.com/):** Biblioteca de ícones vetoriais consistentes e limpos.
* **[React Router](https://reactrouter.com/):** Gerenciamento de rotas e navegação fluida (Single Page Application - SPA).

### ⚙️ Back-end (API REST)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

* **[Node.js](https://nodejs.org/):** Ambiente de execução JavaScript no servidor.
* **[Express.js](https://expressjs.com/):** Framework web minimalista para criação das rotas e middlewares da API.
* **[Sequelize](https://sequelize.org/):** ORM (Object-Relational Mapper) poderoso para modelagem de dados, migrations e queries sem escrever SQL puro.
* **[Cors](https://expressjs.com/en/resources/middleware/cors.html):** Middleware para liberar a comunicação segura entre as portas do Front-end e Back-end.

### 🗄️ Banco de Dados e Infraestrutura
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

* **[PostgreSQL](https://www.postgresql.org/):** Banco de dados relacional robusto para garantir a integridade das entidades (Clientes, Veículos, OS).
* **[Supabase](https://supabase.com/):** Plataforma de Backend-as-a-Service (BaaS) utilizada para hospedar nosso banco de dados PostgreSQL na nuvem de forma gratuita e escalável.
* **[Insomnia](https://insomnia.rest/):** Utilizado durante o desenvolvimento para testes e documentação dos endpoints REST.

---

## 👨‍💻 Integrantes do Projeto

Este software foi projetado e desenvolvido pelo time:

- Allyson Allan Martins Pontes — Matrícula: 01854829  
- Emilaine Bernardo da Silva — Matrícula: 01763693  
- Marcelo Travassos Lima de Souza — Matrícula: 01818937  

---

## 📂 Estrutura do Projeto

O repositório está dividido em duas frentes principais (Monorepo), separando perfeitamente a lógica da API (Back-end) e a interface do usuário (Front-end):

```text
📦 crud-oficina-mecanica
├── 📂 oficina-frontend/          # Aplicação Front-end (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 pages/             # Telas da interface (Dashboard, Clientes, Veículos, etc.)
│   │   ├── 📂 services/          # Configuração de consumo da API (Axios)
│   │   ├── 📄 App.jsx            # Layout principal e Sidebar de navegação
│   │   ├── 📄 global.css         # Estilos globais e TailwindCSS
│   │   └── 📄 main.jsx           # Ponto de entrada e roteamento (React Router)
│   ├── 📄 package.json
│   └── 📄 vite.config.js
│
├── 📂 src/                       # Aplicação Back-end (Node.js + Express)
│   ├── 📂 config/
│   │   └── 📄 database.js        # Credenciais de conexão com o PostgreSQL (Supabase)
│   ├── 📂 controllers/           # Regras de negócio e manuseio de requisições da API
│   ├── 📂 database/
│   │   └── 📂 migrations/        # Histórico de criação e versionamento das tabelas
│   ├── 📂 models/                # Modelagem de dados e relacionamentos (Sequelize ORM)
│   ├── 📂 seeders/               # Scripts para carga inicial de dados
│   ├── 📄 app.js                 # Configurações, CORS e middlewares do Express
│   ├── 📄 routes.js              # Definição dos endpoints REST
│   └── 📄 server.js              # Inicialização do servidor na porta 3333
│
├── 📄 .env.example               # Exemplo de configuração de variáveis de ambiente
├── 📄 package.json               # Dependências do Back-end
└── 📄 README.md                  # Documentação principal do projeto