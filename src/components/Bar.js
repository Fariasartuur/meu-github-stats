export const renderLanguageBar = (linguagens, width) => {
    const barWidth = width - 90;
    let currentBarX = 0;

    const barSegments = linguagens.map((lang, index) => {
            const isLast = index === linguagens.length - 1;
            const segmentWidth = isLast ? (barWidth - currentBarX) : (parseFloat(lang.porcentagem) / 100) * barWidth;
            const rect = `<rect x="${45 + currentBarX}" y="80" width="${segmentWidth}" height="8" fill="${lang.cor}" />`;
            currentBarX += segmentWidth;
            return rect;
        }).join('');

    return {
        clipPath: `<clipPath id="barClip"><rect x="45" y="80" width="${barWidth}" height="8" rx="4" /></clipPath>`,
        barSVG: `<g clip-path="url(#barClip)">${barSegments}</g>`
    };
}