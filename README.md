# Vectorizer - Conversor de Imagens

Aplicacao web para converter imagens raster (PNG, JPG, etc) em vetores de alta qualidade usando a API do Vectorizer.AI.

## Funcionalidades

- Upload de imagens ou input via URL
- 4 modos de processamento:
  - **Production**: Qualidade maxima (1.0 credito)
  - **Preview**: Previa com marca dagua (0.2 credito)
  - **Test**: Teste gratuito com marca dagua
  - **Test Preview**: Previa de teste gratuita
- 5 formatos de saida: SVG, EPS, PDF, DXF, PNG
- Status da conta em tempo real (plano, creditos)
- Exibicao de creditos calculados no modo test
- Download e visualizacao no navegador
- Configuracao por variaveis de ambiente (backend)
- Interface moderna e responsiva

## Tecnologias

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icones)
- Vectorizer.AI API

## Instalacao

```bash
npm install
```

## Configuracao

Crie um arquivo `.env` na raiz do projeto:

```env
VECTORIZER_API_ID=seu_api_id
VECTORIZER_API_SECRET=seu_api_secret

# Autenticacao da interface (opcional)
AUTH_USERNAME=seu_usuario
AUTH_PASSWORD=sua_senha
```

### Autenticacao da Interface

Se `AUTH_USERNAME` e `AUTH_PASSWORD` estiverem configurados, a aplicacao exigira login para acessar. Isso e util para proteger a interface em ambientes de producao.

## Obtendo Credenciais

1. Acesse [vectorizer.ai/api](https://vectorizer.ai/api)
2. Crie uma conta ou faca login
3. Copie seu API ID e API Secret

## Desenvolvimento

```bash
cd server
npm install
npm run start
```

Em outro terminal:

```bash
cd ..
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Docker

### Variaveis de Ambiente

| Variavel | Descricao | Obrigatorio |
|----------|-----------|-------------|
| `AUTH_USERNAME` | Usuario para login na interface | Opcional* |
| `AUTH_PASSWORD` | Senha para login na interface | Opcional* |
| `VECTORIZER_API_ID` | API ID do Vectorizer.AI | Obrigatorio |
| `VECTORIZER_API_SECRET` | API Secret do Vectorizer.AI | Obrigatorio |

*Notas:
- Se `AUTH_USERNAME` e `AUTH_PASSWORD` nao forem configurados, a interface sera acessivel sem login.
- As credenciais sao lidas pelo backend. O frontend nao solicita nem armazena API ID/Secret.

### Opcao 1: Docker Compose (recomendado)

1. Crie um arquivo `.env` na raiz do projeto:

```env
AUTH_USERNAME=admin
AUTH_PASSWORD=sua_senha_segura
VECTORIZER_API_ID=seu_api_id
VECTORIZER_API_SECRET=seu_api_secret
```

2. Execute:

```bash
cd docker
docker compose up -d --build
```

### Opcao 2: Docker Run com variaveis de ambiente

```bash
cd docker
docker build -f Dockerfile -t vectorizer ..

docker run -d -p 3000:3000 \
  -e AUTH_USERNAME=admin \
  -e AUTH_PASSWORD=sua_senha_segura \
  -e VECTORIZER_API_ID=seu_api_id \
  -e VECTORIZER_API_SECRET=seu_api_secret \
  vectorizer
```

### Opcao 3: Docker Run com arquivo .env

```bash
cd docker
docker build -f Dockerfile -t vectorizer ..

docker run -d -p 3000:3000 --env-file ../.env vectorizer
```

A aplicacao estara disponivel em `http://localhost:3000`

### Parar o container

```bash
cd docker
docker compose down
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Header.tsx           # Cabecalho com status da conta
│   ├── ImageUploader.tsx    # Upload e URL de imagem
│   ├── ModeSelector.tsx     # Selecao do modo de processamento
│   ├── FormatSelector.tsx   # Selecao do formato de saida
│   └── ResultPanel.tsx      # Exibicao do resultado
├── hooks/
│   └── useAuth.ts           # Login opcional da interface
├── lib/
│   └── vectorizer.ts        # Integracao com API
├── types.ts                 # Tipos TypeScript
├── App.tsx                  # Componente principal
├── main.tsx                 # Entry point
└── index.css               # Estilos globais
```

## API Endpoint

A aplicacao usa a API oficial do Vectorizer.AI:
- Base URL: `https://api.vectorizer.ai/api/v1`
- Autenticacao: Basic Auth com API ID e Secret

## Licenca

MIT
