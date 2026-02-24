export default async function handle(req, res) {

    const myUser = process.env.MY_GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    if( !myUser || !token ) {
        return res.status(500).json({ erro: "Servidor mal configurado: Faltam variáveis." });
    }

    const url = `https://api.github.com/graphql`;

    const query = `
      query {
        user(login: "${myUser}") {
          name
          contributionsCollection {
            totalCommitContributions
          }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            nodes {
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const dados = await response.json();

        if(dados.errors) {
            console.error("Erro na Query GraphQL:", dados.errors);
            return res.status(500).json({ erro: "Erro ao consultar o GraphQL do GitHub." });
        }

        const usuario = dados.data.user;
        const nome = usuario.name;
        const totalCommits = usuario.contributionsCollection.totalCommitContributions;
        const repositorios = usuario.repositories.nodes;

        return res.status(200).json({
            nome: nome,
            commits: totalCommits,
            repositorios_brutos: repositorios
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar dados do GitHub." });
    }




}