import React, { useCallback } from 'react'
import { Session, Program, Trainer } from '../../../types'
import { Plus, Edit2, Trash2, Calendar, Clock, Users } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { format, parseISO } from 'date-fns'
import { ProgramService } from '../../../services/ProgramService.ts'
import { SessionService } from '../../../services/SessionService.ts'
import { TrainerService } from '../../../services/TrainerService.ts'
import { PaginationControls } from '../../../components/pagination/PaginationControls.tsx'
import PopupModal from '../../../components/popup/PopUpModal.tsx'

export function AdminSession() {
    const [session, setSession] = React.useState<Session[]>([])
    const [programs, setPrograms] = React.useState<Program[]>([])
    const [trainers, setTrainers] = React.useState<Trainer[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [isAdding, setIsAdding] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [editingSchedule, setEditingSchedule] = React.useState<Session | null>(null)
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageSize] = React.useState(10)
    const [totalPages, setTotalPages] = React.useState(0)
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedSessionId, setSelectedSessionId] = React.useState('')
    const [formData, setFormData] = React.useState<{
        program: Program | null
        trainer: Trainer | null
        date: string
        startTime: string
        endTime: string
        maxCapacity: number
        currentBookings: number
    }>({
        program: null,
        trainer: null,
        date: '',
        startTime: '',
        endTime: '',
        maxCapacity: 10,
        currentBookings: 0,
    })

    const { getAllPrograms } = ProgramService()
    const { getSessionsPaginated, update, create, deleteById } = SessionService()
    const { getTrainers } = TrainerService()

    const fetchData = useCallback(async () => {
        await Promise.all([getAllPrograms(), getSessionsPaginated(currentPage), getTrainers()])
            .then(([programs, schedules, trainers]) => {
                setPrograms(programs)
                setTotalPages(schedules.totalPages)
                setSession(schedules.content)
                setTrainers(trainers)
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }, [getSessionsPaginated, getAllPrograms, getTrainers])

    React.useEffect(() => {
        fetchData().then()
    }, [currentPage, pageSize])

    const handleAddNew = () => {
        setEditingSchedule(null)
        setFormData({
            program: null,
            trainer: null,
            date: '',
            startTime: '',
            endTime: '',
            maxCapacity: 10,
            currentBookings: 0,
        })
        setIsAdding(true)
    }

    const handleEdit = (schedule: Session) => {
        setEditingSchedule(schedule)
        setFormData({
            program: schedule.program,
            trainer: schedule.trainer,
            date: schedule.date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            maxCapacity: schedule.maxCapacity,
            currentBookings: schedule.currentBookings,
        })
        setIsEditing(true)
    }

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault()

        await create(formData)
            .then(() => {
                fetchData()
                setIsAdding(false)
            })
            .catch((error) => setError(error.message))
    }

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!editingSchedule) return

        await update(editingSchedule.id, formData)
            .then(() => {
                fetchData()
                setIsEditing(false)
                setEditingSchedule(null)
            })
            .catch((error) => setError(error.message))
    }

    const confirmDelete = (sessionId: string) => {
        setSelectedSessionId(sessionId)
        setIsPopupOpen(true)
    }

    const handleDelete = async () => {
        await deleteById(selectedSessionId)
            .then(fetchData)
            .catch((error) => setError(error.message))
            .finally(() => setIsPopupOpen(false))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage program schedules and sessions
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Schedule
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {session.map((schedule) => {
                    const program = schedule.program
                    const trainer = schedule.trainer

                    return (
                        <div
                            key={schedule.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {program?.name}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            program?.type === 'GROUP'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {program?.type}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>
                                            {format(parseISO(schedule.date), 'MMMM d, yyyy')}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>
                                            {schedule.startTime} - {schedule.endTime}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>
                                            {schedule.currentBookings} / {schedule.maxCapacity}{' '}
                                            spots filled
                                        </span>
                                    </div>

                                    {trainer && (
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {trainer.firstName[0]}
                                                    {trainer.lastName[0]}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {trainer.firstName} {trainer.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {trainer.specialization}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => handleEdit(schedule)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Edit2 className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(schedule.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-8">
                {/* Display programs here */}
                <PaginationControls
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            </div>
            <PopupModal
                title="Confirm Deletion"
                message="Are you sure you want to delete this session?"
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleDelete}
                confirmText="Delete"
                cancelText="Cancel"
                type="confirmation"
            />

            {/* Add/Edit AdminSession Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingSchedule ? 'Edit Session' : 'Add New Session'}
                        </h3>
                        <form onSubmit={handleSubmitAdd} className="space-y-4">
                            <div className="form-group">
                                <label
                                    htmlFor="select-program"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Program
                                </label>
                                <select
                                    id="select-program"
                                    value={JSON.stringify(formData.program)}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            program: JSON.parse(e.target.value),
                                        })
                                    }
                                    className="form-input"
                                    required
                                >
                                    <option value={JSON.stringify(formData.program)}>
                                        {formData.program == null
                                            ? 'Select a program'
                                            : formData.program?.name}
                                    </option>
                                    {programs.map((program) => (
                                        <option key={program.id} value={JSON.stringify(program)}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="select-trainer"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Trainer
                                </label>
                                <select
                                    id="select-trainer"
                                    value={JSON.stringify(formData.trainer)}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            trainer: JSON.parse(e.target.value),
                                        })
                                    }
                                    className="form-input"
                                    required
                                >
                                    <option value={JSON.stringify(formData.trainer)}>
                                        {formData.trainer != null
                                            ? `${formData.trainer?.firstName} ${formData.trainer?.lastName} - ${formData.trainer?.specialization}`
                                            : 'Select a trainer'}
                                    </option>
                                    {trainers.map((trainer) => (
                                        <option key={trainer.id} value={JSON.stringify(trainer)}>
                                            {trainer.firstName} {trainer.lastName} -{' '}
                                            {trainer.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="input-date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Date
                                </label>
                                <input
                                    id="input-date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label
                                        htmlFor="input-start-time"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Start Time
                                    </label>
                                    <input
                                        id="input-start-time"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, startTime: e.target.value })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="input-end-time"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        End Time
                                    </label>
                                    <input
                                        id="input-end-time"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, endTime: e.target.value })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="input-capasity"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Maximum Capacity
                                </label>
                                <input
                                    id="input-capasity"
                                    type="number"
                                    min="1"
                                    value={formData.maxCapacity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            maxCapacity: parseInt(e.target.value),
                                        })
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {setIsAdding(false); setFormData({
                                        program: null,
                                        trainer: null,
                                        date: '',
                                        startTime: '',
                                        endTime: '',
                                        maxCapacity: 10,
                                        currentBookings: 0,
                                    })}}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingSchedule ? 'Edit Session' : 'Add New Session'}
                        </h3>
                        <form onSubmit={handleSubmitEdit} className="space-y-4">
                            <div className="form-group">
                                <label
                                    htmlFor="select-program-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Program
                                </label>
                                <select
                                    id="select-program-edit"
                                    value={JSON.stringify(formData.program)}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            program: JSON.parse(e.target.value),
                                        })
                                    }
                                    className="form-input"
                                    required
                                >
                                    <option value={JSON.stringify(formData.program)}>
                                        {formData.program?.name}
                                    </option>
                                    {programs.map((program) => (
                                        <option key={program.id} value={JSON.stringify(program)}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div  className="form-group">
                                <label
                                    htmlFor="select-trainer-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Trainer
                                </label>
                                <select
                                    id="select-trainer-edit"
                                    value={JSON.stringify(formData.trainer)}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            trainer: JSON.parse(e.target.value),
                                        })
                                    }
                                    className="form-input"
                                    required
                                >
                                    <option value={JSON.stringify(formData.trainer)}>
                                        {`${formData.trainer?.firstName} ${formData.trainer?.lastName} - ${formData.trainer?.specialization}`}
                                    </option>
                                    {trainers.map((trainer) => (
                                        <option key={trainer.id} value={JSON.stringify(trainer)}>
                                            {trainer.firstName} {trainer.lastName} -{' '}
                                            {trainer.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="input-date-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Date
                                </label>
                                <input
                                    id="input-date-edit"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label
                                        htmlFor="input-start-time-edit"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Start Time
                                    </label>
                                    <input
                                        id="input-start-time-edit"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, startTime: e.target.value })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="input-end-time-edit"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        End Time
                                    </label>
                                    <input
                                        id="input-end-time-edit"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, endTime: e.target.value })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="input-capacity-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Maximum Capacity
                                </label>
                                <input
                                    id="input-capacity-edit"
                                    type="number"
                                    min="1"
                                    value={formData.maxCapacity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            maxCapacity: parseInt(e.target.value),
                                        })
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
