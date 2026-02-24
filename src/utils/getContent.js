import { LangItem } from "../components/LangItem.js";

export const getContent = (props) => {
    const { type, stats, linguagens, width, focus } = props;
    const { commits, prs, issues, repos, stars } = stats;

    const rowHeight = 30;

    switch (type) {
        case 'full':
            return `
                <g transform="translate(45, 120)">
                    <text y="0" class="stat">🔥 Commits: ${commits}</text>
                    <text y="25" class="stat">⭐ Stars: ${stars}</text>
                    <text y="50" class="stat">📂 Repos: ${repos}</text>
                    <text y="75" class="stat">🔀 PRs: ${prs}</text>
                    <text y="100" class="stat">🛠️ Issues: ${issues}</text>
                </g>
                <g transform="translate(${width * 0.55}, 115)">
                    ${linguagens.map((lang, i) => LangItem(lang, i, 0, focus)).join('')}
                </g>`;

        case 'langs':
            if (linguagens.length > 4) {
                const mid = Math.ceil(linguagens.length / 2) + 1;
                return `
                    <g transform="translate(45, 115)">
                        ${linguagens.slice(0, mid).map((lang, i) => LangItem(lang, i, 0, focus)).join('')}
                    </g>
                    <g transform="translate(${width * 0.55}, 115)">
                        ${linguagens.slice(mid).map((lang, i) => LangItem(lang, i, 0, focus)).join('')}
                    </g>`;
            }
            return `
                <g transform="translate(45, 115)">
                    ${linguagens.map((lang, i) => LangItem(lang, i, 0, focus)).join('')}
                </g>`;

        case 'stats':
            return `
                <g transform="translate(45, 95)">
                    <text y="0" class="stat">🔥 Commits: ${commits}</text>
                    <text y="25" class="stat">⭐ Stars: ${stars}</text>
                    <text y="50" class="stat">📂 Repos: ${repos}</text>
                    <text y="75" class="stat">🔀 PRs: ${prs}</text>
                    <text y="100" class="stat">🛠️ Issues: ${issues}</text>
                </g>`;

        default:
            return `
                <text x="45" y="115" class="stat">🔥 Total de Commits: ${commits}</text>
                <g transform="translate(45, 145)">
                    ${linguagens.map((lang, i) => LangItem(lang, i, 0, focus)).join('')}
                </g>`;
    }
};