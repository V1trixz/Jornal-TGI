# Guia Completo de Deploy no Render - Jornal TGI

## Introdução

Este guia fornece instruções detalhadas para fazer o deploy do projeto Jornal TGI na plataforma Render. O Render é uma plataforma de hospedagem moderna que oferece deploy automático, SSL gratuito e escalabilidade.

## Pré-requisitos

- Conta no GitHub, GitLab ou Bitbucket
- Projeto Jornal TGI em um repositório Git
- Conta no Render (gratuita disponível)

## Estrutura do Projeto

O projeto Jornal TGI consiste em:
- **Backend**: API FastAPI (Python)
- **Frontend**: Aplicação React (Node.js)

## Parte 1: Preparação do Repositório

### 1.1 Estrutura de Arquivos

Certifique-se de que seu repositório tenha a seguinte estrutura:

```
jornal-tgi/
├── backend/
│   ├── src/
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

### 1.2 Configurações Necessárias

**Backend (requirements.txt):**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
python-multipart==0.0.6
pydantic==2.5.0
```

**Frontend (package.json):**
Certifique-se de que os scripts estão configurados:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Parte 2: Deploy do Backend

### 2.1 Acessar o Render

1. Acesse [render.com](https://render.com)
2. Faça login ou crie uma conta
3. Conecte sua conta do GitHub/GitLab/Bitbucket

### 2.2 Criar Web Service para o Backend

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório:
   - Clique em **"Connect a repository"**
   - Selecione o repositório do Jornal TGI
   - Clique em **"Connect"**

### 2.3 Configurar o Backend

Preencha as configurações:

**Basic Settings:**
- **Name**: `jornal-tgi-backend`
- **Environment**: `Python 3`
- **Region**: Escolha a região mais próxima
- **Branch**: `main` (ou sua branch principal)
- **Root Directory**: `backend`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python src/main.py`

**Advanced Settings:**
- **Auto-Deploy**: `Yes` (recomendado)

### 2.4 Variáveis de Ambiente (Opcional)

Se necessário, adicione variáveis de ambiente:
- Clique em **"Environment Variables"**
- Adicione as variáveis necessárias

### 2.5 Deploy do Backend

1. Clique em **"Create Web Service"**
2. Aguarde o processo de build e deploy
3. Anote a URL gerada (ex: `https://jornal-tgi-backend.onrender.com`)

## Parte 3: Deploy do Frontend

### 3.1 Criar Static Site para o Frontend

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Static Site"**
3. Conecte o mesmo repositório

### 3.2 Configurar o Frontend

Preencha as configurações:

**Basic Settings:**
- **Name**: `jornal-tgi-frontend`
- **Branch**: `main` (ou sua branch principal)
- **Root Directory**: `frontend`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 3.3 Configurar Variáveis de Ambiente

**IMPORTANTE**: Configure a URL do backend:
1. Clique em **"Environment Variables"**
2. Adicione:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://jornal-tgi-backend.onrender.com` (URL do seu backend)

### 3.4 Deploy do Frontend

1. Clique em **"Create Static Site"**
2. Aguarde o processo de build e deploy
3. Anote a URL gerada (ex: `https://jornal-tgi-frontend.onrender.com`)

## Parte 4: Configurações Pós-Deploy

### 4.1 Atualizar CORS no Backend

Edite o arquivo `backend/src/main.py` para incluir a URL do frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

# Adicione após criar a instância do FastAPI
origins = [
    "http://localhost:5173",
    "https://jornal-tgi-frontend.onrender.com",  # Substitua pela URL real
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Atualizar URLs no Frontend

Se não estiver usando variáveis de ambiente, atualize manualmente as URLs da API nos componentes React:

```javascript
// Substitua todas as ocorrências de:
const response = await fetch('http://localhost:5000/api/...')

// Por:
const response = await fetch('https://jornal-tgi-backend.onrender.com/api/...')
```

### 4.3 Configurar Redirects para SPA

Para o frontend React, crie um arquivo `_redirects` na pasta `public/`:

```
/*    /index.html   200
```

## Parte 5: Monitoramento e Manutenção

### 5.1 Logs e Debugging

**Backend:**
- Acesse o dashboard do backend no Render
- Clique em **"Logs"** para ver os logs em tempo real
- Use para debuggar problemas de API

**Frontend:**
- Acesse o dashboard do frontend no Render
- Clique em **"Logs"** para ver o processo de build
- Erros de build aparecerão aqui

### 5.2 Atualizações Automáticas

Com Auto-Deploy ativado:
- Qualquer push para a branch principal triggera um novo deploy
- O processo é automático e leva alguns minutos

### 5.3 Domínio Customizado (Opcional)

Para usar um domínio próprio:
1. No dashboard do serviço, clique em **"Settings"**
2. Vá para **"Custom Domains"**
3. Adicione seu domínio
4. Configure os DNS conforme instruído

## Parte 6: Troubleshooting

### 6.1 Problemas Comuns do Backend

**Erro: "Application failed to start"**
- Verifique se o comando start está correto
- Confirme que todas as dependências estão no requirements.txt
- Verifique os logs para erros específicos

**Erro: "Port already in use"**
- Certifique-se de que o backend está configurado para usar a porta fornecida pelo Render:
```python
import os
port = int(os.environ.get("PORT", 5000))
uvicorn.run(app, host="0.0.0.0", port=port)
```

### 6.2 Problemas Comuns do Frontend

**Erro: "Build failed"**
- Verifique se o package.json está correto
- Confirme que o comando de build está funcionando localmente
- Verifique se todas as dependências estão listadas

**Erro: "Page not found" em rotas**
- Certifique-se de que o arquivo `_redirects` está configurado
- Verifique se o React Router está configurado corretamente

### 6.3 Problemas de CORS

**Erro: "CORS policy"**
- Verifique se a URL do frontend está nas origens permitidas do backend
- Confirme que o middleware CORS está configurado corretamente

## Parte 7: Otimizações

### 7.1 Performance do Backend

- Use gunicorn para produção:
```bash
pip install gunicorn
# Start command: gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main:app
```

### 7.2 Performance do Frontend

- Otimize o build do Vite:
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
}
```

### 7.3 Banco de Dados

**Importante**: O SQLite não persiste no Render entre deploys.

Para produção, considere:
- PostgreSQL (Render oferece instâncias gratuitas)
- MongoDB Atlas
- Supabase

## Parte 8: Custos e Limites

### 8.1 Plano Gratuito

**Limitações:**
- Web Services: Dormem após 15 minutos de inatividade
- 750 horas/mês de runtime
- Static Sites: Ilimitados

**Recomendações:**
- Para projetos de produção, considere o plano pago
- Planos pagos não têm sleep e ofmecem mais recursos

### 8.2 Upgrade para Plano Pago

Benefícios:
- Sem sleep automático
- Mais CPU e RAM
- Suporte prioritário
- Métricas avançadas

## Conclusão

Seguindo este guia, você terá o Jornal TGI funcionando completamente no Render. Lembre-se de:

1. Testar localmente antes do deploy
2. Configurar as URLs corretamente
3. Monitorar os logs após o deploy
4. Considerar um banco de dados persistente para produção

Para suporte adicional, consulte a [documentação oficial do Render](https://render.com/docs).

