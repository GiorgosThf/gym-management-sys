export const intercept = {
    fetchWithAuth: async (
        url: RequestInfo | URL,
        token: string | null,
        options: RequestInit | null = {}
    ) => {
        const headers = {
            ...(options?.headers || {}),
            Authorization: token ? `${token}` : '',
        }

        return await fetch(url, { ...options, headers })
            .then(async (response) => {
                if (!response.ok) {
                    const json = await response.json()
                    throw new Error(json.description)
                }
                return response
            })
            .catch((error) => {
                throw new Error(error.message)
            })
    },
}
