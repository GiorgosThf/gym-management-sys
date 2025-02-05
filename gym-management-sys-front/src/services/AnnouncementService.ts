import { useApi } from '../utils/api.ts'
import { Announcement } from '../types'

export const AnnouncementService = () => {
    const api = useApi()

    return {
        getAnnouncements: async () => {
            return await api
                .get('/announcements', true)
                .then(async (response) => await response.json())
                .then((json) => json.data)
        },

        createAnnouncement: async (announcement: Partial<Announcement>) => {
            return await api.post('/announcements', announcement, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        updateAnnouncement: async (
            announcementId: string | undefined,
            updates: Partial<Announcement>
        ) => {
            return await api
                .put(`/announcements/${announcementId}`, updates, true)
                .then(async (response) => {
                    return await response.json().then((json) => {
                        return json.data
                    })
                })
        },

        deleteAnnouncement: async (announcementId: string) => {
            return await api
                .delete(`/announcements/${announcementId}`, true)
                .then(async (response) => {
                    return response
                })
        },
    }
}
