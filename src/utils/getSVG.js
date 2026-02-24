import { getDimensions } from "./getDimensions.js";
import { getContent } from "./getContent.js";
import { getStats } from "./getStats.js";
import { getLanguages } from "./getLanguages.js";

import { renderLanguageBar } from "../components/Bar.js";
import { Badge } from "../components/Badge.js";

export const getSVG = (params, dados) => {

    // Extrai os parâmetros de estilo e configuração
    const {
        bgColor, titleColor, statColor,
        borderColor, glowColor, focus, type, count
    } = params;

    // Extrai os Dados do GitHub usando a função getStats
    const { usuario, commits, prs, issues, repos, stars } = getStats(dados);

    // Processa as linguagens para o gráfico de barras
    const linguagensFinais = getLanguages(usuario, count);
    
    // Calcula as dimensões do SVG com base no tipo e na quantidade de linguagens
    const { width, height } = getDimensions(params, linguagensFinais.length);

    // Gera o SVG do badge de rank
    const rankBadgeSVG = Badge(stars, width);

    // Gera o SVG da barra de linguagens (se aplicável)
    const { clipPath, barSVG } = renderLanguageBar(linguagensFinais, width);

    // Gera o conteúdo principal do SVG com base no tipo selecionado
    const content = getContent({
            type,
            stats: { commits, prs, issues, repos, stars },
            linguagens: linguagensFinais, width, focus
        });

    // Monta o SVG final combinando todos os elementos
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
                ${content}
            </svg>
        `;

    return svgCard;
}