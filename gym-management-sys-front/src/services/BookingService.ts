import { useApi } from '../utils/api.ts'
import { Booking, Session, User } from '../types'

export const BookingService = () => {
    const api = useApi()
    return {
        getBookings: async (): Promise<Booking[]> => {
            return api.get('/bookings', true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        getUserBookings: async (userId: string | undefined): Promise<Booking[]> => {
            return api.get(`/bookings/user/${userId}/all`, true).then(async (response) => {
                return await response.json().then((json) => {
                    return json.data
                })
            })
        },

        createBooking: async (user: User | null, session: Session | null): Promise<Booking> => {
            return api
                .post('/bookings', { user: user, session: session }, true)
                .then(async (response) => {
                    return await response.json().then((json) => {
                        return json.data
                    })
                })
        },

        cancelBooking: async (bookingId: string) => {
            return api.get(`/bookings/cancel/${bookingId}`, true).then(async (response) => {
                return response
            })
        },
    }
}
