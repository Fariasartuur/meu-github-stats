import { auth } from '../auth/auth.js'

export const fetchGitData = async () => {
    const { token, query } = auth();

    try {
        const response = await fetch(`https://api.github.com/graphql`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        throw error;
    }
};