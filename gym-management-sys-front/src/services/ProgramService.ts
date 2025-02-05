import { useApi } from '../utils/api.ts'
import { Program } from '../types'

export const ProgramService = () => {
    const api = useApi()
    return {
        getProgramsPaginated: async (currentPage: number) => {
            return api.get(`/programs/page?page=${currentPage}`, true).then(async (response) => {
                return await response.json()
            })
        },

        getAllPrograms: async () => {
            return api.get('/programs', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        getProgramDetails: async (programId: number): Promise<Program> => {
            return api.get(`/programs/${programId}`, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        createProgram: async (program: Partial<Program>): Promise<Program> => {
            return api.post('/programs', program, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        updateProgram: async (programId: string, updates: Partial<Program>): Promise<Program> => {
            return api.put(`/programs/${programId}`, updates, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        deleteProgram: async (programId: string) => {
            return api.delete(`/programs/${programId}`, true).then(async (response) => {
                return await response.json()
            })
        },
    }
}
