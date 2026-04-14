# 💪 NoNet GYM

App pra registrar treinos e acompanhar a evolução na academia.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## O que o app faz

- Login e cadastro de usuário
- Registra exercícios com séries, reps e carga
- Salva medidas corporais (peso, braço, cintura...)
- Mostra gráficos de evolução
- Histórico de treinos por data
- Sistema de conquistas

---

## Tecnologias que usei

- **Frontend:** HTML, CSS e JavaScript puro
- **Backend:** Node.js com Express
- **Banco de dados:** MySQL
- **Autenticação:** JWT + bcrypt
- **Gráficos:** Chart.js

---

## Como rodar

**1. Clone o projeto**
```bash
git clone https://github.com/Diasx7/NoNetGym.git
cd NoNetGym
```

**2. Instala as dependências**
```bash
npm install
```

**3. Cria o banco de dados**

Abre o MySQL e executa o arquivo `banco.sql`

**4. Cria o arquivo `.env` na raiz**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nonet_gym
JWT_SECRET=qualquer_coisa_aqui
PORT=3000
```

**5. Roda o servidor**
```bash
npm start
```

**6. Abre o `frontend/index.html` no navegador**

---


