import React from 'react'
import { Program } from '../../../types'
import { Plus, Edit2, Trash2, Users, Clock } from 'lucide-react'
import { ProgramService } from '../../../services/ProgramService.ts'
import { PaginationControls } from '../../../components/pagination/PaginationControls.tsx'
import PopupModal from '../../../components/popup/PopUpModal.tsx'

export function AdminPrograms() {
    const [programs, setPrograms] = React.useState<Program[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageSize] = React.useState(10)
    const [totalPages, setTotalPages] = React.useState(0)
    const [isAdding, setIsAdding] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [editingProgram, setEditingProgram] = React.useState<Program | null>(null)
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedProgramId, setSelectedProgramId] = React.useState('')
    const [formData, setFormData] = React.useState<{
        id: string
        name: string
        description: string
        maxCapacity: number
        type: 'GROUP' | 'INDIVIDUAL'
    }>({
        id: '',
        name: '',
        description: '',
        maxCapacity: 10,
        type: 'GROUP',
    })

    const { getProgramsPaginated, updateProgram, createProgram, deleteProgram } = ProgramService()

    const fetchPrograms = async () => {
        setLoading(true)
        await getProgramsPaginated(currentPage)
            .then((programs) => {
                setPrograms(programs.content)
                setTotalPages(programs.totalPages)
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }

    React.useEffect(() => {
        fetchPrograms().then()
    }, [currentPage, pageSize])

    // Handle Add New Program
    const handleAddNew = () => {
        setEditingProgram(null)
        setFormData({
            id: '',
            name: '',
            description: '',
            maxCapacity: 10,
            type: 'GROUP',
        })
        setIsAdding(true)
    }

    // Handle Edit Program
    const handleEdit = (program: Program) => {
        setEditingProgram(program)
        setFormData({
            id: program.id,
            name: program.name,
            description: program.description,
            maxCapacity: program.maxCapacity,
            type: program.type,
        })
        setIsEditing(true)
    }

    // Handle Submit for Adding Program
    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await createProgram(formData)
            .then(() => {
                fetchPrograms()
                setIsAdding(false)
            })
            .catch((error) => setError(error.message))
            .finally(() => setTimeout(() => setLoading(false), 200))
    }

    // Handle Submit for Editing Program
    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (!editingProgram) return
        await updateProgram(editingProgram.id, formData)
            .then(() => {
                fetchPrograms()
                setIsEditing(false)
                setEditingProgram(null)
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }

    const confirmDelete = (programId: string) => {
        setSelectedProgramId(programId)
        setIsPopupOpen(true)
    }

    const handleDelete = async () => {
        setLoading(true)
        await deleteProgram(selectedProgramId)
            .then(fetchPrograms)
            .catch((error) => setError(error.message))
            .finally(() => {
                setLoading(false)
                setIsPopupOpen(false)
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
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Programs</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage fitness programs and classes
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Program
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {programs.map((program) => (
                    <div
                        key={program.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {program.name}
                                </h3>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        program.type === 'GROUP'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
                                    {program.type}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4">{program.description}</p>

                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Max Capacity: {program.maxCapacity}</span>
                                <Clock className="h-4 w-4 ml-4 mr-2" />
                                <span>60 min</span>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(program)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(program.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
                message="Are you sure you want to delete this program?"
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleDelete}
                confirmText="Delete"
                cancelText="Cancel"
                type="confirmation"
            />

            {/* Add/Edit Program Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Program</h3>
                        <form onSubmit={handleSubmitAdd} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Program Name
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="program-description-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="program-description-edit"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="program-capacity-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Maximum Capacity
                                </label>
                                <input
                                    id="program-capacity-edit"
                                    type="number"
                                    min="1"
                                    value={formData.maxCapacity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            maxCapacity: parseInt(e.target.value),
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="program-type-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Type
                                </label>
                                <select
                                    id="program-type-edit"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value as 'GROUP' | 'INDIVIDUAL',
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="GROUP">Group</option>
                                    <option value="INDIVIDUAL">Individual</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false)
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Program
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Program</h3>
                        <form onSubmit={handleSubmitEdit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="program-name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Program Name
                                </label>
                                <input
                                    id="program-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="program-description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="program-description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="program-capacity"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Maximum Capacity
                                </label>
                                <input
                                    id="program-capacity"
                                    type="number"
                                    min="1"
                                    value={formData.maxCapacity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            maxCapacity: parseInt(e.target.value),
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="program-type"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Type
                                </label>
                                <select
                                    id="program-type"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value as 'GROUP' | 'INDIVIDUAL',
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="GROUP">Group</option>
                                    <option value="INDIVIDUAL">Individual</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditingProgram(null)
                                    }}
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
