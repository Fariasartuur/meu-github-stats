# 🚀 My GitHub Stats API

Uma API Serverless desenvolvida em **Node.js** e hospedada na **Vercel** que gera cards de estatísticas dinâmicos com efeito Neon/Glassmorphism para perfis do GitHub.

<div align="center">
  <img src="https://meu-github-stats.vercel.app/api?bgc=020618&tc=d8b4fe&st=f3e8ff&bc=7e22ce&gc=7e22ce&w=450" alt="Estatísticas Demo" />
</div>

> **URL do Card acima:** `https://meu-github-stats.vercel.app/api?bgc=020618&tc=d8b4fe&stc=f3e8ff&bc=7e22ce&gc=7e22ce&w=450`

## 🛠️ Tecnologias Utilizadas

* **Runtime:** Node.js
* **Plataforma:** Vercel (Serverless Functions)
* **Dados:** GitHub GraphQL API
* **Renderização:** SVG (Scalable Vector Graphics)

## 📡 Como funciona?

Diferente de outros geradores de widgets, esta API foi construída para ser **self-hosted**, garantindo que você nunca sofra com *rate limit* da API do GitHub, pois ela utiliza o seu próprio Personal Access Token.

1. A requisição chega à Vercel.
2. A função faz uma query **GraphQL** para o GitHub buscando Commits e Linguagens.
3. O backend processa as linguagens, soma os bytes e calcula as porcentagens.
4. Um arquivo **SVG** é gerado dinamicamente com dimensões calculadas em tempo real.

## 📊 Dados Coletados

A API utiliza o protocolo **GraphQL** para extrair dados precisos com uma única requisição. Os dados coletados são:

* **Commits:** Total de contribuições de commits no último ano.
* **Repositórios:** Analisa os últimos 100 repositórios de sua propriedade.
* **Filtros:** Forks são automaticamente excluídos para refletir apenas seu código autoral.
* **Linguagens:** Soma o tamanho em *bytes* de cada linguagem para gerar uma média ponderada.

## 🚀 Como fazer o seu (Self-Hosting)

1. **Faça um Fork** deste repositório.
2. **Gere um Token:** No GitHub, crie um *Personal Access Token (Classic)* com a permissão `public_repo` (ou `repo` para dados privados).
3. **Deploy na Vercel:**
    * Importe seu fork na Vercel.
    * Configure as **Environment Variables**: `GITHUB_TOKEN` e `MY_GITHUB_USER`.
4. **Acesse:** `https://seu-projeto.vercel.app/api`

## 🎨 Customização (Query Params)

| Parâmetro | Descrição | Exemplo |
| :--- | :--- | :--- |
| `bgc` | Cor de fundo (Hex sem #) | `bgc=020618` |
| `tc` | Cor do título | `tc=d8b4fe` |
| `st` | Cor dos textos/estatísticas | `st=f3e8ff` |
| `bc` | Cor da borda | `bc=7e22ce` |
| `gc` | Cor do brilho (Glow) | `gc=7e22ce` |
| `f` | Linguagem em foco (Efeito Neon) | `f=java` |
| `t` | Tipo de card (`stats`, `langs`, `full`) | `t=full` |
| `c` | Quantidade de linguagens a exibir | `c=5` |
| `w` | Largura customizada | `w=500` |
| `h` | Altura customizada (Sobrescreve o auto) | `h=300` |

### 📐 Dimensões Inteligentes

As dimensões são ajustadas automaticamente com base no `rowHeight` de 30px para garantir alinhamento perfeito.

| Tipo | Largura Padrão | Faixa Suportada (w) | Altura Automática |
| :--- | :--- | :--- | :--- |
| **Padrão** | `450px` | `300` a `550` | `145 + (langs * 30) + 20` |
| **`stats`** | `400px` | `300` a `500` | `230` (Fixo) |
| **`langs`** | `450px` | `300` a `550` | `110 + (linhas * 30) + 20` |
| **`full`** | `550px` | `500` a `650` | `120 + (max(5, langs) * 30) + 20` |

---

## 🎨 Exemplos de Temas

### 💜 Ultra Violet (Focus em Java)

`?bgc=020617&tc=a855f7&stc=e9d5ff&bc=7e22ce&gc=a855f7&f=java&t=full`

<img src="https://meu-github-stats.vercel.app/api??bgc=020617&tc=a855f7&stc=e9d5ff&bc=7e22ce&gc=a855f7&f=java&t=full" alt="Ultra Violet" />

### 🟢 Matrix Mode

`?bgc=000000&tc=00ff41&stc=d1ffd6&bc=003b00&gc=00ff41&t=stats`

<img src="https://meu-github-stats.vercel.app/api?bgc=000000&tc=00ff41&stc=d1ffd6&bc=003b00&gc=00ff41&t=stats" alt="Matrix  Mode" />

### 🧊 Minimalist Blue

`?bgc=f0f9ff&tc=0ea5e9&stc=075985&bc=bae6fd&gc=0ea5e9&t=langs&c=5`

<img src="https://meu-github-stats.vercel.app/api?bgc=f0f9ff&tc=0ea5e9&stc=075985&bc=bae6fd&gc=0ea5e9&t=langs&c=5" alt="Minimalist Blue" />

---
Criado por [Artur](https://github.com/Artuur)
