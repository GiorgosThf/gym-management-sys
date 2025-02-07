import React from 'react'
import {Trainer} from '../../../types'
import {Mail, Award, UserCog, Search, Plus, Trash2} from 'lucide-react'
import { TrainerService } from '../../../services/TrainerService.ts'
import PopupModal from "../../../components/popup/PopUpModal.tsx";

export function Trainers() {
    const [trainers, setTrainers] = React.useState<Trainer[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [searchTerm, setSearchTerm] = React.useState('')
    const [editingTrainer, setEditingTrainer] = React.useState<Trainer | null>(null)
    const [isAdding, setIsAdding] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedTrainerId, setSelectedTrainerId] = React.useState('')
    const [formData, setFormData] = React.useState<{
        email: string
        firstName: string
        lastName: string
        specialization: string
        bio: string
        enabled: boolean
    }>({
        email: '',
        firstName: '',
        lastName: '',
        specialization: '',
        bio: '',
        enabled: true
    })

    const { getTrainers, updateTrainer, createTrainer, deleteTrainer } = TrainerService()

    const fetchTrainers = async () => {
        setError('');
        await getTrainers()
            .then(setTrainers)
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }

    React.useEffect(() => {
        fetchTrainers().then()
    }, [])

    const handleAddNew = () => {
        setEditingTrainer(null)
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            specialization: '',
            bio: '',
            enabled: true
        })
        setIsAdding(true)
    }

    const handleEdit = (trainer: Trainer) => {
        setEditingTrainer(trainer)
        setIsEditing(true)
    }

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault()

        await createTrainer(formData)
            .then(() => {
                fetchTrainers()
                setIsAdding(false)
            })
            .catch((error) => setError(error.message))
    }

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!editingTrainer) return

        await updateTrainer(editingTrainer.id, editingTrainer)
            .then(() => {
                fetchTrainers()
                setIsEditing(false)
                setEditingTrainer(null)
            })
            .catch((error) => setError(error.message))
    }
    const confirmDelete = (trainerId: string) => {
        setSelectedTrainerId(trainerId)
        setIsPopupOpen(true)
    }

    const handleDeleteTrainer = async () => {
        await deleteTrainer(selectedTrainerId)
            .then(fetchTrainers)
            .catch((error) => setError(error.message))
            .finally(() => setIsPopupOpen(false))
    }

    const filteredTrainers = trainers.filter(
        (trainer) =>
            trainer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                    <h1 className="text-2xl font-semibold text-gray-900">Trainers</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage all trainers in the system</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Trainer
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mt-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="Search trainers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 md:w-1/4">
                                            Trainer
                                        </th>
                                        {/* Hide Contact and Specialization on mobile */}
                                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                                            Contact
                                        </th>
                                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                                            Specialization
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredTrainers.map((trainer) => (
                                        <tr key={trainer.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-lg font-medium text-gray-600">
                                                            {trainer.firstName[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {trainer.firstName} {trainer.lastName}
                                                        </div>
                                                        {/* Show email instead */}
                                                        <div className="text-gray-500 text-sm md:hidden">
                                                            {trainer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Hide Contact and Specialization on mobile */}
                                            <td className="hidden whitespace-nowrap px-3 py-4 lg:table-cell">
                                                <div className="flex items-center">
                                                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-gray-900">
                                                        {trainer.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="hidden whitespace-nowrap px-3 py-4 lg:table-cell">
                                                <div className="flex items-center">
                                                    <Award className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-gray-900">
                                                        {trainer.specialization}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        trainer.enabled
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {/* Fix enabled status display */}
                                                    {trainer.enabled ? 'ENABLED' : 'DISABLED'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(trainer)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <UserCog className="h-5 w-5"/>
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(trainer.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-5 w-5"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <PopupModal
                title="Confirm Deletion"
                message="Are you sure you want to delete this user?"
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleDeleteTrainer}
                confirmText="Delete"
                cancelText="Cancel"
                type="confirmation"
            />

            {/* Add/Edit AdminSession Modal */}
            {isAdding && (
                <div className="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Add New Trainer
                        </h3>
                        <form onSubmit={handleSubmitAdd} className="space-y-4">
                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) =>
                                        setFormData({...formData, firstName: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        setFormData({...formData, lastName: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({...formData, email: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Specialization
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={formData.specialization}
                                    onChange={(e) =>
                                        setFormData({...formData, specialization: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bio
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={formData.bio}
                                    onChange={(e) =>
                                        setFormData({...formData, bio: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={formData.enabled ? 'true' : 'false'}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            enabled: e.target.value === 'true',
                                        })
                                    }
                                    className="form-input"
                                >
                                    <option value="true">Enabled</option>
                                    <option value="false">Disabled</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {setIsAdding(false); setFormData({
                                        email: '',
                                        firstName: '',
                                        lastName: '',
                                        specialization: '',
                                        bio: '',
                                        enabled: true
                                    })}}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Trainer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditing && editingTrainer &&(
                <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Edit Trainer
                        </h3>
                        <form onSubmit={handleSubmitEdit} className="space-y-4">
                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={editingTrainer.firstName}
                                    onChange={(e) =>
                                        setEditingTrainer({...editingTrainer, firstName: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={editingTrainer.lastName}
                                    onChange={(e) =>
                                        setEditingTrainer({...editingTrainer, lastName: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={editingTrainer.email}
                                    onChange={(e) =>
                                        setEditingTrainer({...editingTrainer, email: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Specialization
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={editingTrainer.specialization}
                                    onChange={(e) =>
                                        setEditingTrainer({...editingTrainer, specialization: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="program-name-edit"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bio
                                </label>
                                <input
                                    id="program-name-edit"
                                    type="text"
                                    value={editingTrainer.bio}
                                    onChange={(e) =>
                                        setEditingTrainer({...editingTrainer, bio: e.target.value})
                                    }
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={editingTrainer.enabled ? 'true' : 'false'}
                                    onChange={(e) =>
                                        setEditingTrainer({
                                            ...editingTrainer,
                                            enabled: e.target.value === 'true',
                                        })
                                    }
                                    className="form-input"
                                >
                                    <option value="true">Enabled</option>
                                    <option value="false">Disabled</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingTrainer(null)
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
