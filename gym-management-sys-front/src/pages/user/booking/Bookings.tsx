import React from 'react'
import { Booking } from '../../../types'
import { useAuthStore } from '../../../store/authStore.ts'
import { BookingService } from '../../../services/BookingService.ts'
import { Calendar, Clock, MapPin, X } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { format, parseISO } from 'date-fns'
import PopupModal from '../../../components/popup/PopUpModal.tsx'
import './Bookings.css'

export function UserBookings() {
    const [bookings, setBookings] = React.useState<Booking[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string>('')
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedBookingId, setSelectedBookingId] = React.useState('')
    const { user } = useAuthStore()

    const { getUserBookings, cancelBooking } = BookingService()

    const fetchBookings = async () => {
        await getUserBookings(user?.id)
            .then(setBookings)
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }

    React.useEffect(() => {
        fetchBookings().then()
    }, [])

    const handleCancelBooking = async () => {
        setLoading(true)
        await cancelBooking(selectedBookingId)
            .then(fetchBookings)
            .catch((error) => setError(error.message))
            .finally(() => {
                setIsPopupOpen(false)
                setLoading(false)
                setSelectedBookingId('')
            })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        )
    }
    return (
        <div className="bookings-container">
            <div className="bookings-header">
                <h1 className="bookings-title">My Bookings</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="bookings-grid">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-content">
                                <div className="booking-header">
                                    <h3 className="booking-program-name">
                                        {booking.session.program?.name}
                                    </h3>
                                    <span
                                        className={`booking-status ${booking.cancelled ? 'cancelled' : 'active'}`}
                                    >
                                        {booking.cancelled ? 'cancelled' : 'active'}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <Calendar className="detail-icon" />
                                        <span>
                                            {format(parseISO(booking.session.date), 'MMMM d, yyyy')}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <Clock className="detail-icon" />
                                        <span>
                                            {booking.session.startTime} - {booking.session.endTime}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <MapPin className="detail-icon" />
                                        <span>Main Gym Area</span>
                                    </div>
                                </div>

                                {!booking.cancelled &&
                                    new Date(booking.session.date) > new Date() && (
                                        <button
                                            onClick={() => {
                                                setIsPopupOpen(true)
                                                setSelectedBookingId(booking.id)
                                            }}
                                            className="cancel-button"
                                        >
                                            <X className="cancel-icon" />
                                            Cancel Booking
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No bookings found.</p>
                )}
            </div>
            {/* PopupModal for confirmation */}
            <PopupModal
                title="Confirm Cancellation"
                message="Are you sure you want to cancel this booking?"
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleCancelBooking}
                confirmText="Cancel Booking"
                cancelText="Close"
                type="confirmation"
            />
        </div>
    )
}
