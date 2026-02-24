export const getStats = (dados) => {
    const usuario = dados.data.user;
    const commits = usuario.contributionsCollection.totalCommitContributions;
    const prs = usuario.contributionsCollection.totalPullRequestContributions;
    const issues = usuario.contributionsCollection.totalIssueContributions;
    const repos = usuario.repositories.totalCount;
    const stars = usuario.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);

    return { usuario, commits, prs, issues, repos, stars,  };
}