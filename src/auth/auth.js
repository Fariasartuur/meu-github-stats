export const auth = () => {
    const myUser = process.env.MY_GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    if (!myUser || !token) {
        return res.status(500).json({ erro: "Servidor mal configurado: Faltam variáveis." });
    }

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

    return { token, query };
};

