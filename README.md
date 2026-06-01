# 🚀 Enterprise Management System

Um sistema completo de gestão empresarial desenvolvido com foco em organizações, equipes, projetos e colaboração em tempo real.

O objetivo deste projeto foi simular uma aplicação corporativa moderna, utilizando tecnologias amplamente adotadas pelo mercado para construir uma arquitetura fullstack robusta e escalável.

---

# ✨ Funcionalidades

## 🔐 Autenticação

- Login com JWT
- Refresh Token
- Rotas protegidas
- Controle de sessão
- Middleware de autenticação

---

## 🏢 Organizações

- Criar organizações
- Gerenciar membros
- Controle de permissões
- Associação de usuários

---

## 👥 Equipes

- Criação de equipes
- Associação de membros
- Organização de times internos

---

## 📁 Projetos

- Criar projetos
- Atualizar projetos
- Excluir projetos
- Listagem de projetos

---

## ✅ Tarefas

- Criar tarefas
- Atualizar tarefas
- Remover tarefas
- Atribuir responsáveis
- Definir prioridades
- Alterar status
- Definir prazo

### Status

- TODO
- IN_PROGRESS
- DONE

### Prioridades

- LOW
- MEDIUM
- HIGH

---

## 💬 Comentários

- Comentários em tarefas
- Histórico de interações

---

## 🔔 Notificações

- Criação de notificações
- Listagem de notificações
- Marcar como lida

---

## ⚡ Chat em Tempo Real

Implementado utilizando Socket.IO.

### Recursos

- Mensagens em tempo real
- Salas por projeto
- Indicador de digitação
- Persistência das mensagens

Eventos:

```text
join-project
send-message
receive-message
typing
user-typing
```

---

## 📎 Upload de Arquivos

- Upload de PDFs
- Upload de imagens
- Associação a projetos
- Armazenamento local

---

## 📊 Dashboard

- Métricas gerais
- Cards informativos
- Gráficos de tarefas
- Estatísticas dos projetos

---

## 🌙 Tema

- Dark Mode
- Light Mode
- Alternância dinâmica

---

# 🛠️ Tecnologias Utilizadas

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Socket.IO
- Swagger
- Multer
- Bcrypt

---

## Frontend

- Next.js
- TypeScript
- TailwindCSS
- Shadcn/UI
- Axios
- Recharts
- Next Themes
- Lucide React

---

# 🏗️ Arquitetura

## Backend

```text
src/
├── auth/
├── users/
├── organizations/
├── memberships/
├── projects/
├── tasks/
├── task-comments/
├── notifications/
├── teams/
├── files/
├── chat/
├── prisma/
└── common/
```

---

## Frontend

```text
app/
├── auth/
├── dashboard/
├── projects/
├── tasks/
├── notifications/
└── settings/

components/
├── dashboard/
├── layout/
├── ui/
└── providers/

services/
hooks/
contexts/
lib/
```

---

# 🗄️ Banco de Dados

Principais entidades:

- User
- Organization
- Membership
- Team
- Project
- Task
- TaskComment
- Notification
- ChatMessage
- File

---

# 📚 Documentação da API

Swagger disponível em:

```text
http://localhost:3000/api
```

---

# ⚙️ Instalação

## Clone o projeto

```bash
git clone https://github.com/AlissonDiaspi/Projeto-Gest-o-Empresarial
```

---

# Backend

```bash
cd backend

npm install
```

Configure o arquivo:

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Execute o servidor:

```bash
npm run start:dev
```

Servidor:

```text
http://localhost:3000
```

---

# Frontend

```bash
cd frontend

npm install
```

Execute:

```bash
npm run dev
```

Aplicação:

```text
http://localhost:3001
```

---

# 🔗 Principais Endpoints

## Auth

```http
POST /auth/login
POST /auth/refresh
GET /auth/me
```

## Projects

```http
GET /projects
POST /projects
PATCH /projects/:id
DELETE /projects/:id
```

## Tasks

```http
GET /tasks
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

## Notifications

```http
GET /notifications
PATCH /notifications/:id/read
```

## Teams

```http
GET /teams
POST /teams
PATCH /teams/:id
DELETE /teams/:id
```

---

# 🎯 Objetivos de Aprendizado

Durante o desenvolvimento deste projeto foram praticados conceitos importantes como:

- Arquitetura Fullstack
- APIs REST
- Autenticação JWT
- Refresh Tokens
- Prisma ORM
- Modelagem relacional
- WebSockets
- Upload de arquivos
- Organização de código escalável
- Integração Frontend + Backend
- Gestão de estado
- Componentização
- Dashboards corporativos

---



---

# 👨‍💻 Autor

**Alisson Dias Pinheiro**

Desenvolvedor de Software

- LinkedIn: https://www.linkedin.com/in/alisson-dias-0a8b77356/
- GitHub: https://github.com/AlissonDiaspi

---

⭐ Se gostou do projeto, deixe uma estrela no repositório!
