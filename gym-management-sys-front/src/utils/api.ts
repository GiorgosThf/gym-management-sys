import { intercept } from './intercept'
import { useAuthStore } from '../store/authStore.ts'

const API_BASE_URL = 'http://localhost:8080/api'

export const useApi = () => {
    const { token } = useAuthStore()

    return {
        get: async (endpoint: string, baseApi: boolean) => {
            const actualEndpoint: string = baseApi ? `${API_BASE_URL}${endpoint}` : endpoint
            return await intercept.fetchWithAuth(actualEndpoint, token)
        },

        post: async (endpoint: string, data: object, baseApi: boolean) => {
            const actualEndpoint: string = baseApi ? `${API_BASE_URL}${endpoint}` : endpoint
            return await intercept.fetchWithAuth(actualEndpoint, token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        },

        put: async (endpoint: string, data: object, baseApi: boolean) => {
            const actualEndpoint: string = baseApi ? `${API_BASE_URL}${endpoint}` : endpoint
            return await intercept.fetchWithAuth(actualEndpoint, token, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        },

        delete: async (endpoint: string, baseApi: boolean) => {
            const actualEndpoint: string = baseApi ? `${API_BASE_URL}${endpoint}` : endpoint

            return await intercept.fetchWithAuth(actualEndpoint, token, {
                method: 'DELETE',
            })
        },
    }
}
