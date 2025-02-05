import React from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import { Booking } from '../../../types'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../../../styles/Schedule.css'
import { useAuthStore } from '../../../store/authStore.ts'
import moment from 'moment/moment'
import { BookingService } from '../../../services/BookingService.ts'
const localizer = momentLocalizer(moment)

export function UserSchedule() {
    const [bookings, setBookings] = React.useState<Booking[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedSession, setSelectedSession] = React.useState<Booking | null>(null)
    const { user } = useAuthStore()
    const { getUserBookings } = BookingService()

    const handleEventClick = (event: { resource: React.SetStateAction<Booking | null> }) => {
        console.log(event.resource)
        setSelectedSession(event.resource) // Store session details
        setIsModalOpen(true) // Open modal
    }

    React.useEffect(() => {
        const fetchBookings = async () => {
            await getUserBookings(user?.id)
                .then(setBookings)
                .catch((error) => setError(error.message))
                .finally(() => setLoading(false))
        }

        fetchBookings().then()
    }, [])

    const events = bookings
        .filter((booking) => !booking.cancelled)
        .map((booking) => ({
            id: booking.id,
            title: booking.session.program?.name,
            start: new Date(`${booking.session.date}T${booking.session.startTime}`),
            end: new Date(`${booking.session.date}T${booking.session.endTime}`),
            resource: booking,
        }))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="schedule-container">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Schedule</h1>
                <p className="mt-4 text-xl text-gray-600">View and your bookings here.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="calendar-wrapper mt-4">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    views={['month', 'week', 'day']}
                    defaultView={Views.MONTH}
                    onSelectEvent={handleEventClick}
                />
            </div>
            {isModalOpen && selectedSession && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Session Details</h3>
                        <div className="text-gray-700 space-y-2">
                            <p>
                                <strong>Program:</strong> {selectedSession.session.program?.name}
                            </p>
                            <p>
                                <strong>Date:</strong> {selectedSession.session.date}
                            </p>
                            <p>
                                <strong>Time:</strong> {selectedSession.session.startTime} -{' '}
                                {selectedSession.session.endTime}
                            </p>
                            <p>
                                <strong>Trainer:</strong>{' '}
                                {selectedSession.session.trainer?.firstName}{' '}
                                {selectedSession.session.trainer?.lastName}
                            </p>
                            <p>
                                <strong>Capacity:</strong> {selectedSession.session.currentBookings}{' '}
                                / {selectedSession.session.maxCapacity}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
