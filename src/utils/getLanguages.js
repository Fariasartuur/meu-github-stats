export const getLanguages = (usuario, count = 4) => {
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
        .slice(0, count)
        .map(lang => ({
            nome: lang.nome,
            cor: lang.cor,
            porcentagem: totalBytes > 0 ? ((lang.tamanho / totalBytes) * 100).toFixed(2) : "0.00"
        }));

    return linguagensFinais;
}