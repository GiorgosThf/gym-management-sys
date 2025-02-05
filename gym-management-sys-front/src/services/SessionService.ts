import { useApi } from '../utils/api.ts'
import { Session } from '../types'

export const SessionService = () => {
    const api = useApi()
    return {
        getSessionsPaginated: async (currentPage: number) => {
            return api.get(`/sessions/page?page=${currentPage}`, true).then(async (response) => {
                return await response.json()
            })
        },
        findAll: async (): Promise<Session[]> => {
            return api.get('/sessions', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        findAllRecent: async (): Promise<Session[]> => {
            return api.get('/sessions/recent', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        create: async (sessionId: Partial<Session>): Promise<Session> => {
            return api.post('/sessions', sessionId, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        update: async (sessionId: string, updates: Partial<Session>): Promise<Session> => {
            return api.put(`/sessions/${sessionId}`, updates, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        deleteById: async (sessionId: string): Promise<void> => {
            return api.delete(`/sessions/${sessionId}`, true).then(async (response) => {
                return await response.json()
            })
        },
    }
}
