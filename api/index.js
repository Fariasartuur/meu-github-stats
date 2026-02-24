export default async function handle(req, res) {

    const myUser = process.env.MY_GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    const bgColor = req.query.bg ? `#${req.query.bg}` : '#3c0366';
    const titleColor = req.query.t ? `#${req.query.t}` : '#d8b4fe';
    const statColor = req.query.st ? `#${req.query.st}` : '#f3e8ff';
    const width = Math.min(Math.max(parseInt(req.query.w) || 400, 300), 550);

    const borderColor = req.query.bc ? `#${req.query.bc}` : 'rgba(126, 34, 206, 0.5)';
    const glowColor = req.query.gc ? `#${req.query.gc}` : '#7e22ce';

    const foco = req.query.focus ? req.query.focus.toLowerCase() : null;

    

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

        let rank = 'Bronze';
        let rankColor = '#cd7f32';
        if (totalCommits >= 1500) { rank = 'Diamante'; rankColor = '#00e5ff'; }
        else if (totalCommits > 1000) { rank = 'Ouro'; rankColor = '#ffd700'; }
        else if (totalCommits > 400) { rank = 'Prata'; rankColor = '#c0c0c0'; }

        const calculatedHeight = 120 + (linguagensFinais.length * 25) + 30;
        const height = Math.min(Math.max(calculatedHeight, 150), 450);

        let linguagensSVG = ''

        linguagensFinais.forEach((lang, index) => {
            let yPos = 130 + (index * 25);

            const isFocus = foco === lang.nome.toLowerCase();
            const glowStyle = isFocus ? `filter="drop-shadow(0 0 5px ${lang.cor})"` : '';
            const focusIndicator = isFocus ? ' 🎯' : '';

            linguagensSVG += `
                <g transform="translate(45, ${yPos})" ${glowStyle}>
                    <circle cx="5" cy="5" r="5" fill="${lang.cor}" />
                    <text x="20" y="9" class="lang-text">${lang.nome} - ${lang.porcentagem}%${focusIndicator}</text>
                </g>
            `;
        });

        const svgCard = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${glowColor}" flood-opacity="0.4"/>
                    </filter>
                </defs>

                <style>
                    .title { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: ${titleColor}; } 
                    .stat { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${statColor}; }
                    .lang-text { font: 500 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${statColor}; }
                </style>
                
                <rect width="${width - 40}" height="${height - 40}" x="20" y="20" rx="25" 
                      fill="${bgColor}" 
                      stroke="${borderColor}"
                      stroke-width="1.5" 
                      filter="url(#neonGlow)" />
                
                <text x="45" y="55" class="title">${nome}'s GitHub Stats</text>

                <g transform="translate(${width - 100}, 38)">
                    <rect width="70" height="22" rx="11" fill="${rankColor}" fill-opacity="0.2" stroke="${rankColor}" stroke-width="1.2" />
                    <text x="35" y="15" text-anchor="middle" style="font: 700 10px sans-serif; fill: ${rankColor}; text-transform: uppercase;">${rank}</text>
                </g>

                <text x="45" y="95" class="stat">🔥 Total de Commits: ${totalCommits}</text>
                
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