# 🚀 My GitHub Stats API

Uma API Serverless desenvolvida em **Node.js** e hospedada na **Vercel** que gera cards de estatísticas dinâmicos com efeito Neon/Glassmorphism para perfis do GitHub.

<div align="center">
  <img src="https://meu-github-stats.vercel.app/api?bg=020618&t=d8b4fe&st=f3e8ff&bc=7e22ce&gc=7e22ce" alt="Estatísticas Demo" />
</div>

## 🛠️ Tecnologias Utilizadas

* **Runtime:** Node.js
* **Plataforma:** Vercel (Serverless Functions)
* **Dados:** GitHub GraphQL API
* **Renderização:** SVG (Scalable Vector Graphics)

## 📡 Como funciona?

Diferente de outros geradores de widgets, esta API foi construída para ser **self-hosted**, garantindo que você nunca sofra com *rate limit* da API do GitHub, pois ela utiliza o seu próprio Personal Access Token.

1.  A requisição chega à Vercel.
2.  A função faz uma query **GraphQL** para o GitHub buscando Commits e Linguagens.
3.  O backend processa as linguagens, soma os bytes e calcula as porcentagens.
4.  Um arquivo **SVG** é gerado dinamicamente e retornado com cabeçalhos de cache.



## 🚀 Como fazer o seu (Self-Hosting)

1.  **Faça um Fork** deste repositório.
2.  **Gere um Token:** Vá em [GitHub Settings](https://github.com/settings/tokens) e crie um *Personal Access Token (Classic)* com a permissão `public_repo` (ou `repo` para incluir dados privados).
3.  **Deploy na Vercel:**
    * Crie um novo projeto na Vercel e importe seu fork.
    * Configure as seguintes **Environment Variables**:
        * `GITHUB_TOKEN`: O token que você gerou.
        * `MY_GITHUB_USER`: Seu nome de usuário do GitHub.
4.  **Acesse:** `https://seu-projeto.vercel.app/api`

## 🎨 Customização (Query Params)

A API aceita parâmetros via URL para customizar o tema sem precisar mexer no código:

| Parâmetro | Descrição | Exemplo |
| :--- | :--- | :--- |
| `bg` | Cor de fundo (Hex sem #) | `bg=000000` |
| `t` | Cor do título | `t=ff00ea` |
| `st` | Cor dos textos | `st=ffffff` |
| `bc` | Cor da borda | `bc=444444` |
| `gc` | Cor do brilho (Glow) | `gc=7e22ce` |

**Exemplo de uso no Markdown:**
```markdown
![Stats](https://seu-projeto.vercel.app/api?bg=020618&t=d8b4fe&bc=7e22ce)
