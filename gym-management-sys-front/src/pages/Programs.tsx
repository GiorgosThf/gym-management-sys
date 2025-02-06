import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Program, Session } from '../types'
import { Dumbbell, Users, Timer, Search, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore.ts'
import { PaginationControls } from '../components/pagination/PaginationControls.tsx'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { format, parseISO } from 'date-fns'
import { ProgramService } from '../services/ProgramService.ts'
import { SessionService } from '../services/SessionService.ts'
import { BookingService } from '../services/BookingService.ts'
import PopupModal from '../components/popup/PopUpModal.tsx'
import '../styles/Programs.css'

export function Programs() {
    const [programs, setPrograms] = React.useState<Program[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuthStore()
    const [selectedProgram, setSelectedProgram] = React.useState<Program | null>(null)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageSize] = React.useState(10)
    const [totalPages, setTotalPages] = React.useState(0)
    const [schedules, setSchedules] = React.useState<Session[]>([])
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedSession, setSelectedSession] = React.useState<Session | null>(null)
    const [navigateToDash, setNavigateToDash] = React.useState(false)
    const { getProgramsPaginated } = ProgramService()
    const { findAllRecent } = SessionService()
    const { createBooking } = BookingService()
    const filteredPrograms = programs.filter(
        (program) =>
            program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    React.useEffect(() => {
        const fetchData = async () => {
            setError('')
            setLoading(true)
            await Promise.all([
                getProgramsPaginated(currentPage),
                findAllRecent()
                    .then(setSchedules)
                    .catch((error) => console.error(error.message)),
            ])
                .then(([programs]) => {
                    setPrograms(programs.content)
                    setTotalPages(programs.totalPages)
                })
                .catch((error) => setError(error.message))
                .finally(() => setLoading(false))
        }

        fetchData().then()
    }, [currentPage, pageSize])

    const handleBooking = async () => {
        await createBooking(user, selectedSession)
            .then(() => {
                setIsModalOpen(false)
                setNavigateToDash(true)
            })
            .catch((error) => {
                console.log(error.message)
                setError(error.message)
                setNavigateToDash(false)
                setIsModalOpen(false)
                setIsPopupOpen(false)
            })
            .finally(() => {
                if (navigateToDash) {
                    navigate('/user/dashboard/bookings')
                }
            })
    }

    const getAvailableSchedules = (programId: string) => {
        return schedules.filter(
            (schedule) =>
                schedule.program?.id === programId &&
                schedule.currentBookings < schedule.maxCapacity
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Programs</h1>
                <p className="mt-4 text-xl text-gray-600">
                    Choose from our wide range of fitness programs designed to help you achieve your
                    goals
                </p>
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="mt-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid mt-8">
                <div className="programs-grid">
                    {filteredPrograms.map((program) => (
                        <div key={program.id} className="program-card">
                            <div className="program-content">
                                <div className="program-header">
                                    <div className="program-icon-wrapper">
                                        <Dumbbell className="program-icon" />
                                    </div>
                                    <h3 className="program-name">{program.name}</h3>
                                    <span className={`program-type ${program.type.toLowerCase()}`}>
                                        {program.type}
                                    </span>
                                </div>

                                <p className="program-description">{program.description}</p>

                                <div className="program-details">
                                    <div className="detail-item">
                                        <Users className="detail-icon" />
                                        <span>Max Capacity: {program.maxCapacity}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Timer className="detail-icon" />
                                        <span>60 min</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            navigate('/login')
                                        } else {
                                            setSelectedProgram(program)
                                            setIsModalOpen(true)
                                        }
                                    }}
                                    className="book-button"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8">
                {/* Display programs here */}
                <PaginationControls
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            </div>
            {/* Booking Modal */}
            {isModalOpen && selectedProgram && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Book {selectedProgram.name}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="modal-close">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="modal-body">
                            <h4 className="schedule-title">Available Sessions</h4>
                            <div className="schedules-list">
                                {getAvailableSchedules(selectedProgram.id).map((schedule) => (
                                    <div key={schedule.id} className="schedule-item">
                                        <div className="schedule-info">
                                            <div className="schedule-date">
                                                {format(parseISO(schedule.date), 'MMMM d, yyyy')}
                                            </div>
                                            <div className="schedule-time">
                                                {schedule.startTime} - {schedule.endTime}
                                            </div>
                                            <div className="schedule-capacity">
                                                {schedule.currentBookings} / {schedule.maxCapacity}{' '}
                                                spots filled
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedSession(schedule)
                                                setIsPopupOpen(true)
                                            }}
                                            className="book-session-button"
                                        >
                                            Book Session
                                        </button>
                                    </div>
                                ))}
                                {getAvailableSchedules(selectedProgram.id).length === 0 && (
                                    <p className="no-schedules">
                                        No available sessions at the moment
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* PopupModal for confirmation */}
                    <PopupModal
                        title="Confirm Booking"
                        message="Are you sure you want to book this session?"
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        onConfirm={handleBooking}
                        confirmText="Book"
                        cancelText="Cancel"
                        type="confirmation"
                    />
                </div>
            )}
        </div>
    )
}
