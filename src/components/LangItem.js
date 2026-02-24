export const LangItem = (lang, i, yOffset = 0, focus) => {
    const isFocus = focus === lang.nome.toLowerCase();
    return `
            <g transform="translate(0, ${i * 25 + yOffset})" ${isFocus ? `filter="drop-shadow(0 0 3px ${lang.cor})"` : ''}>
                <circle cx="5" cy="5" r="5" fill="${lang.cor}" />
                <text x="20" y="9" class="lang-text">${lang.nome} - ${lang.porcentagem}% ${isFocus ? '🎯' : ''}</text>
            </g>`;
}