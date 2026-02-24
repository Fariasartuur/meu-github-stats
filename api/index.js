export default async function handle(req, res) {
    const myUser = process.env.MY_GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    if (!myUser || !token) {
        return res.status(500).json({ erro: "Servidor mal configurado: Faltam variáveis." });
    }

    const bgColor = req.query.bg ? `#${req.query.bg}` : '#3c0366';
    const titleColor = req.query.t ? `#${req.query.t}` : '#d8b4fe';
    const statColor = req.query.st ? `#${req.query.st}` : '#f3e8ff';
    const borderColor = req.query.bc ? `#${req.query.bc}` : 'rgba(126, 34, 206, 0.5)';
    const glowColor = req.query.gc ? `#${req.query.gc}` : '#7e22ce';
    const foco = req.query.focus ? req.query.focus.toLowerCase() : null;
    const type = req.query.type ? req.query.type.toLowerCase() : 'default';
    const langCount = Math.min(Math.max(parseInt(req.query.count) || 5, 4), 8);

    const query = `
      query {
        user(login: "${myUser}") {
          name
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
          }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            totalCount
            nodes {
              stargazerCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges { size node { name color } }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await fetch(`https://api.github.com/graphql`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const dados = await response.json();
        if (dados.errors) return res.status(500).json({ erro: "Erro no GraphQL" });

        const usuario = dados.data.user;
        const commits = usuario.contributionsCollection.totalCommitContributions;
        const prs = usuario.contributionsCollection.totalPullRequestContributions;
        const issues = usuario.contributionsCollection.totalIssueContributions;
        const repos = usuario.repositories.totalCount;
        const stars = usuario.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);

        const statusLinguagens = {};
        let totalBytes = 0;
        usuario.repositories.nodes.forEach(repo => {
            repo.languages.edges.forEach(edge => {
                const lNome = edge.node.name;
                if (!statusLinguagens[lNome]) statusLinguagens[lNome] = { nome: lNome, cor: edge.node.color, tamanho: 0 };
                statusLinguagens[lNome].tamanho += edge.size;
                totalBytes += edge.size;
            });
        });

        const linguagensFinais = Object.values(statusLinguagens)
            .sort((a, b) => b.tamanho - a.tamanho)
            .slice(0, langCount)
            .map(lang => ({
                nome: lang.nome,
                cor: lang.cor,
                porcentagem: totalBytes > 0 ? ((lang.tamanho / totalBytes) * 100).toFixed(2) : "0.00"
            }));

        let rank = 'BRONZE'; let rankColor = '#cd7f32';
        if (commits >= 1500) { rank = 'DIAMANTE'; rankColor = '#00e5ff'; }
        else if (commits > 1000) { rank = 'OURO'; rankColor = '#ffd700'; }
        else if (commits > 400) { rank = 'PRATA'; rankColor = '#c0c0c0'; }

        let widthParam = parseInt(req.query.w);
        let heightParam = parseInt(req.query.h);
        let width = 450; 
        let height = 280;
        let content = '';
        let hideDefaultCommitText = false;

        if (type === 'full' || (type === 'langs' && linguagensFinais.length > 4)) width = Math.min(Math.max(widthParam || 550, 500), 650);
        else width = Math.min(Math.max(widthParam || 450, 300), 550);

        let currentBarX = 0;
        const barWidth = width - 90;
        const barSegments = linguagensFinais.map((lang, index) => {
            const isLast = index === linguagensFinais.length - 1;
            const segmentWidth = isLast ? (barWidth - currentBarX) : (parseFloat(lang.porcentagem) / 100) * barWidth;
            const rect = `<rect x="${45 + currentBarX}" y="80" width="${segmentWidth}" height="8" fill="${lang.cor}" />`;
            currentBarX += segmentWidth;
            return rect;
        }).join('');

        const languageBarSVG = `
            <clipPath id="barClip"><rect x="45" y="80" width="${barWidth}" height="8" rx="4" /></clipPath>
            <g clip-path="url(#barClip)">${barSegments}</g>
        `;

        // Função auxiliar para renderizar itens da lista
        const renderLangItem = (lang, i, yOffset = 0) => {
            const isFocus = foco === lang.nome.toLowerCase();
            return `
            <g transform="translate(0, ${i * 25 + yOffset})" ${isFocus ? `filter="drop-shadow(0 0 3px ${lang.cor})"` : ''}>
                <circle cx="5" cy="5" r="5" fill="${lang.cor}" />
                <text x="20" y="9" class="lang-text">${lang.nome} - ${lang.porcentagem}% ${isFocus ? '🎯' : ''}</text>
            </g>`;
        };

        switch(type) {
            case 'full':
                height = heightParam || (125 + Math.max(5, Math.ceil(linguagensFinais.length)) * 30);
                hideDefaultCommitText = true;
                content = `
                    <g transform="translate(45, 115)">
                        <text y="0" class="stat">🔥 Commits: ${commits}</text>
                        <text y="25" class="stat">⭐ Stars: ${stars}</text>
                        <text y="50" class="stat">📂 Repos: ${repos}</text>
                        <text y="75" class="stat">🔀 PRs: ${prs}</text>
                        <text y="100" class="stat">🛠️ Issues: ${issues}</text>
                    </g>
                    <g transform="translate(${width * 0.55}, 120)">
                        ${linguagensFinais.map((lang, i) => renderLangItem(lang, i)).join('')}
                    </g>`;
                break;

            case 'langs':
                hideDefaultCommitText = true;
                if (linguagensFinais.length > 4) {
                    // DUAS COLUNAS PARA MAIS DE 4 LANGS
                    height = heightParam || 200;
                    const mid = Math.ceil(linguagensFinais.length / 2) + 1;
                    content = `
                        <g transform="translate(45, 115)">
                            ${linguagensFinais.slice(0, mid).map((lang, i) => renderLangItem(lang, i)).join('')}
                        </g>
                        <g transform="translate(${width * 0.55}, 115)">
                            ${linguagensFinais.slice(mid).map((lang, i) => renderLangItem(lang, i)).join('')}
                        </g>`;
                } else {
                    height = heightParam || (110 + (linguagensFinais.length * 25) + 35);
                    content = `<g transform="translate(45, 115)">
                        ${linguagensFinais.map((lang, i) => renderLangItem(lang, i)).join('')}
                    </g>`;
                }
                break;

            case 'stats':
                width = Math.min(Math.max(widthParam || 400, 300), 500);
                height = heightParam || 230;
                hideDefaultCommitText = true;
                content = `
                    <g transform="translate(45, 95)">
                        <text y="0" class="stat">🔥 Commits: ${commits}</text>
                        <text y="25" class="stat">⭐ Stars: ${stars}</text>
                        <text y="50" class="stat">📂 Repos: ${repos}</text>
                        <text y="75" class="stat">🔀 PRs: ${prs}</text>
                        <text y="100" class="stat">🛠️ Issues: ${issues}</text>
                    </g>`;
                break;

            default:
                height = heightParam || (145 + (linguagensFinais.length * 25) + 35);
                content = `<g transform="translate(45, 145)">
                    ${linguagensFinais.map((lang, i) => renderLangItem(lang, i)).join('')}
                </g>`;
        }

        const svgCard = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${glowColor}" flood-opacity="0.4"/>
                    </filter>
                    ${(type !== 'stats') ? `<clipPath id="barClip"><rect x="45" y="80" width="${barWidth}" height="8" rx="4" /></clipPath>` : ''}
                </defs>
                <style>
                    .title { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: ${titleColor}; } 
                    .stat { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${statColor}; }
                    .lang-text { font: 500 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${statColor}; }
                </style>
                <rect width="${width - 40}" height="${height - 40}" x="20" y="20" rx="25" fill="${bgColor}" stroke="${borderColor}" stroke-width="1.5" filter="url(#neonGlow)" />
                <text x="45" y="55" class="title">${usuario.name}'s GitHub Stats</text>
                <g transform="translate(${width - 125}, 38)">
                    <rect width="85" height="22" rx="11" fill="${rankColor}" fill-opacity="0.2" stroke="${rankColor}" stroke-width="1.2" />
                    <text x="42" y="15" text-anchor="middle" style="font: 700 10px sans-serif; fill: ${rankColor}; text-transform: uppercase;">${rank}</text>
                </g>
                ${(type !== 'stats') ? `<g clip-path="url(#barClip)">${barSegments}</g>` : ''}
                ${hideDefaultCommitText ? '' : `<text x="45" y="115" class="stat">🔥 Total de Commits: ${commits}</text>`}
                ${content}
            </svg>
        `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=7200');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).send(svgCard);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
}