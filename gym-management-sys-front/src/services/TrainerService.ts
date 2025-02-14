import { useApi } from '../utils/api.ts'
import { Trainer } from '../types'

export const TrainerService = () => {
    const api = useApi()
    return {
        getTrainers: async () => {
            return api.get('/trainers', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        createTrainer: async (trainer: Partial<Trainer>) => {
            return api.post('/trainers', trainer, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        updateTrainer: async (trainerId: string, updates: Partial<Trainer>) => {
            return api.put(`/trainers/${trainerId}`, updates, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        deleteTrainer: async (trainerId: string) => {
            return api.delete(`/trainers/${trainerId}`, true).then(async (response) => {
                return response
            })
        },
    }
}
