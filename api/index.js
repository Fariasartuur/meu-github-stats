export default async function handle(req, res) {

    const myUser = process.env.MY_GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    if( !myUser || !token ) {
        return res.status(500).json({ erro: "Servidor mal configurado: Faltam variáveis." });
    }

    const url = `https://api.github.com/graphql`;

    const query = `
      query {
        user(login: "${myUser}") {
          name
          contributionsCollection {
            totalCommitContributions
          }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            nodes {
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const dados = await response.json();

        if(dados.errors) {
            console.error("Erro na Query GraphQL:", dados.errors);
            return res.status(500).json({ erro: "Erro ao consultar o GraphQL do GitHub." });
        }

        const usuario = dados.data.user;
        const nome = usuario.name;
        const totalCommits = usuario.contributionsCollection.totalCommitContributions;
        const repositorios = usuario.repositories.nodes;

        const statusLinguagens = {};
        let totalBytes = 0;

        repositorios.forEach(repo => {
            if(repo.languages.edges.length > 0) {
                repo.languages.edges.forEach(edge => {
                    const nome = edge.node.name;
                    const cor = edge.node.color;
                    const tamanho = edge.size;

                    if(!statusLinguagens[nome]) {
                        statusLinguagens[nome] = { nome: nome, cor: cor, tamanho: 0 };
                    }

                    statusLinguagens[nome].tamanho += tamanho;
                    totalBytes += tamanho;
                });
            }
        });

        const linguagensFinais = Object.values(statusLinguagens)
            .sort((a, b) => b.tamanho - a.tamanho)
            .map(lang => {
                return {
                    nome: lang.nome,
                    cor: lang.cor,
                    porcentagem: totalBytes > 0 ? ((lang.tamanho / totalBytes) * 100).toFixed(2) : "0.00"
                };
            })
            .slice(0, 5);

        let linguagensSVG = ''

        linguagensFinais.forEach((lang, index) => {
            let yPos = 130 + (index * 25);

            linguagensSVG += `
                <g transform="translate(45, ${yPos})">
                    <circle cx="5" cy="5" r="5" fill="${lang.cor}" />
                    <text x="20" y="9" class="lang-text">${lang.nome} - ${lang.porcentagem}%</text>
                </g>
            `;
        });

        const svgCard = `
            <svg width="400" height="280" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#7e22ce" flood-opacity="0.4"/>
                    </filter>
                </defs>

                <style>
                    .title { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: #d8b4fe; } 
                    .stat { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: #f3e8ff; }
                    .lang-text { font: 500 13px 'Segoe UI', Ubuntu, sans-serif; fill: #f3e8ff; }
                </style>
                
                <rect width="360" height="240" x="20" y="20" rx="25" 
                      fill="#3c0366" 
                      stroke="rgba(126, 34, 206, 0.5)" 
                      stroke-width="1.5" 
                      filter="url(#neonGlow)" />
                
                <text x="45" y="55" class="title">${nome}'s GitHub Stats</text>
                <text x="45" y="95" class="stat">🔥 Total de Commits: ${commits}</text>
                
                ${linguagensSVG}
            </svg>
        `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=7200');
        res.setHeader('Access-Control-Allow-Origin', '*');

        return res.status(200).send(svgCard);

    } catch (error) {
        return res.status(500).json({ 
            erro: error.message, 
            stack: error.stack,
            detalhe: "Verifique os Logs no Dashboard da Vercel"
        });
    }




}