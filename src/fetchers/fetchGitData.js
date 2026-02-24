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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `GitHub API: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            throw new Error(`GraphQL Error: ${data.errors[0].message}`);
        }

        return data;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
    }
};