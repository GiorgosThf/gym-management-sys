import { useApi } from '../utils/api.ts'

export const StatsService = () => {
    const api = useApi()
    return {
        getStatsUser: async (id: string | undefined) => {
            return api.get(`/stats/user/${id}`, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        getStatsAdmin: async () => {
            return api.get('/stats/admin', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        getActivitiesAdmin: async (currentPage: number) => {
            return api
                .get(`/stats/admin/activity/page?page=${currentPage}`, true)
                .then(async (response) => {
                    return await response.json()
                })
        },
        getActivitiesUser: async (id: string | undefined, currentPage: number) => {
            return api
                .get(`/stats/user/${id}/activity/page?page=${currentPage}`, true)
                .then(async (response) => {
                    return await response.json()
                })
        },
    }
}
