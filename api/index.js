import { fetchGitData } from "../src/fetchers/fetchGitData";

import { getStats } from "../src/utils/getStats";
import { getLanguages } from "../src/utils/getLanguages";
import { getParams } from "../src/utils/getParams";
import { getContent } from "../src/utils/getContent";

import { Badge } from "../src/components/Badge";
import { renderLanguageBar } from "../src/components/LanguageBar";

export default async (req, res) => {
    const {
        hideCommit,
        bgc,
        tc,
        st,
        bc,
        gc,
        f,
        t,
        c,
        w,
        h
    } = req.query;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=7200');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const params = getParams(req.query);
    const { 
        hideDefaultCommitText, bgColor, titleColor, statColor, 
        borderColor, glowColor, focus, type, count, 
        widthParam, heightParam 
    } = params;

    const dados = await fetchGitData();
    const { usuario, commits, prs, issues, repos, stars } = getStats(dados);
    const linguagensFinais = getLanguages(usuario, count);

    let width = 450;
    let height = 280;

    try {
        if (type === 'full' || (type === 'langs' && linguagensFinais.length > 4)) {
            width = Math.min(Math.max(widthParam || 550, 500), 650);
        }else {
            width = Math.min(Math.max(widthParam || 450, 300), 550);
        }

        const rankBadgeSVG = Badge(stars, width);
        const { clipPath, barSVG } = renderLanguageBar(linguagensFinais, width);

        const content = getContent({ 
            type, 
            stats: { commits, prs, issues, repos, stars }, 
            linguagens: linguagensFinais, width, focus });

        if (!heightParam) {
            if (type === 'full') height = 125 + Math.max(5, linguagensFinais.length) * 30;
            else if (type === 'langs') height = linguagensFinais.length > 4 ? 200 : 110 + (linguagensFinais.length * 25) + 35;
            else if (type === 'stats') height = 230;
            else height = 145 + (linguagensFinais.length * 25) + 35;
        } else {
            height = heightParam;
        }

        const svgCard = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${glowColor}" flood-opacity="0.4"/>
                    </filter>
                    ${(type !== 'stats') ? clipPath : ''}
                </defs>
                <style>
                    .title { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: ${titleColor}; } 
                    .stat { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${statColor}; }
                    .lang-text { font: 500 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${statColor}; }
                </style>
                <rect width="${width - 40}" height="${height - 40}" x="20" y="20" rx="25" fill="${bgColor}" stroke="${borderColor}" stroke-width="1.5" filter="url(#neonGlow)" />
                <text x="45" y="55" class="title">${usuario.name}'s GitHub Stats</text>
                ${rankBadgeSVG}
                ${(type !== 'stats') ? barSVG : ''}
                ${hideDefaultCommitText ? '' : `<text x="45" y="115" class="stat">🔥 Total de Commits: ${commits}</text>`}
                ${content}
            </svg>
        `;

        return res.status(200).send(svgCard);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
}