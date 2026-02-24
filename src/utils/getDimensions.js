export const getDimensions = (params, linguagensCount) => {
    const { type, widthParam, heightParam } = params;
    
    const ROW_HEIGHT = 30;
    let width = 450;
    let height = 280;

    if (type === 'full' || (type === 'langs' && linguagensCount > 4)) {
        width = Math.min(Math.max(widthParam || 550, 500), 650);
    } else {
        width = Math.min(Math.max(widthParam || 450, 300), 550);
    }

    if (!heightParam) {
        if (type === 'full') {
            const contentRows = Math.max(5, linguagensCount);
            height = 120 + (contentRows * ROW_HEIGHT) + 20;
        }
        else if (type === 'langs') {
            const rows = linguagensCount > 4 ? Math.ceil(linguagensCount / 2) + 1 : linguagensCount;
            height = 100 + (rows * ROW_HEIGHT) + 20;
        }
        else if (type === 'stats') {
            height = 230;
        }
        else {
            const baseHeight = 145;
            height = baseHeight + (linguagensCount * ROW_HEIGHT) + 20;
        }
    } else {
        height = heightParam;
    }

    return { width, height };
};