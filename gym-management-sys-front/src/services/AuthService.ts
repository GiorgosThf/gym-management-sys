import { useApi } from '../utils/api.ts'
import { User } from '../types'

export const AuthService = () => {
    const api = useApi()

    return {
        loginUser: async (credentials: {
            username: string
            password: string
        }): Promise<Response> => {
            return api.post('/auth/login', credentials, true).then(async (response) => response)
        },

        registerUser: async (userData: Partial<User>) => {
            return api.post('/auth/register', userData, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },
    }
}
