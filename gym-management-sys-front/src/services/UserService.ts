import { useApi } from '../utils/api.ts'
import { User } from '../types'

export const UserService = () => {
    const api = useApi()
    return {
        getUsers: async (): Promise<User[]> => {
            return api.get('/users', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        updateUser: async (userId: string | undefined, updates: Partial<User>): Promise<User> => {
            return api.put(`/users/${userId}`, updates, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        deleteUser: async (userId: string) => {
            return api.delete(`/users/${userId}`, true).then(async (response) => {
                return response
            })
        },
    }
}
