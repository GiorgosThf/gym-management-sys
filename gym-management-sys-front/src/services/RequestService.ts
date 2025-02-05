import { useApi } from '../utils/api.ts'

export const RequestService = () => {
    const api = useApi()
    return {
        getRegistrationRequests: async () => {
            return api
                .get('/registration-requests/type?registrationStatus=PENDING', true)
                .then(async (response) => {
                    return await response.json().then((json) => {
                        return json.data
                    })
                })
        },

        handleRegistrationRequest: async (userId: string, action: boolean) => {
            return api
                .put(`/registration-requests/${userId}?action=${action}`, {}, true)
                .then(async (response) => {
                    return await response.json().then((json) => {
                        return json.data
                    })
                })
        },
    }
}
