import React from 'react'
import { Announcement } from '../../../types'
import { Plus, Edit2, Trash2, Bell, Clock } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { format, parseISO } from 'date-fns'
import { AnnouncementService } from '../../../services/AnnouncementService.ts'
import PopupModal from '../../../components/popup/PopUpModal.tsx'
import '../../../styles/Announcement.css'

export function Announcements() {
    const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedAnnouncementId, setSelectedAnnouncementId] = React.useState<string>('')

    const [newAnnouncement, setNewAnnouncement] = React.useState({
        title: '',
        content: '',
        type: 'NEWS' as 'NEWS' | 'OFFER',
    })

    const [editingAnnouncement, setEditingAnnouncement] = React.useState<Announcement | null>(null)

    const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } =
        AnnouncementService()

    React.useEffect(() => {
        fetchAnnouncements().then()
    }, [])

    const fetchAnnouncements = async () => {
        await getAnnouncements()
            .then(setAnnouncements)
            .catch((err) => setError(err.message || 'An error occurred'))
            .finally(() => setLoading(false))
    }

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await createAnnouncement(newAnnouncement)
            .then(() => {
                fetchAnnouncements()
                setIsAddModalOpen(false)
                setNewAnnouncement({ title: '', content: '', type: 'NEWS' })
            })
            .catch((err) => setError(err.message || 'An error occurred'))
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingAnnouncement) return
        await updateAnnouncement(editingAnnouncement.id, editingAnnouncement)
            .then(() => {
                fetchAnnouncements()
                setIsEditModalOpen(false)
                setEditingAnnouncement(null)
            })
            .catch((err) => setError(err.message || 'An error occurred'))
    }

    const confirmDelete = (announcementId: string) => {
        setSelectedAnnouncementId(announcementId)
        setIsPopupOpen(true)
    }

    const handleDelete = async () => {
        await deleteAnnouncement(selectedAnnouncementId)
            .then(() => fetchAnnouncements())
            .catch((err) => setError(err.message || 'An error occurred'))
            .finally(() => setIsPopupOpen(false))
    }

    if (loading) {
        return (
            <div className="announcements-container flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="announcements-container">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage gym news and special offers</p>
                    </div>
                <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Announcement
                </button>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="announcement-card">
                        <div className="card-content">
                            <div className="card-header">
                                <div className="flex items-center">
                                    <span
                                        className={`badge ${announcement.type === 'OFFER' ? 'badge-offer' : 'badge-news'}`}
                                    >
                                        <Bell
                                            className={`h-5 w-5 mr-1 ${announcement.type === 'OFFER' ? 'text-green-500' : 'text-blue-500'}`}
                                        />{' '}
                                        {announcement.type}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>
                                        {format(parseISO(announcement.createdAt), 'MMMM d, yyyy')}
                                    </span>
                                </div>
                            </div>

                            <h3 className="card-title">{announcement.title}</h3>
                            <p className="card-text">{announcement.content}</p>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        setEditingAnnouncement({ ...announcement })
                                        setIsEditModalOpen(true)
                                    }}
                                    className="button button-secondary"
                                >
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(announcement.id ?? '')}
                                    className="button button-primary bg-red-100 text-red-700 hover:bg-red-200"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <PopupModal
                title="Confirm Deletion"
                message="Are you sure you want to delete this announcement?"
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleDelete}
                confirmText="Delete"
                cancelText="Cancel"
                type="confirmation"
            />

            {/* Add Announcement Modal */}
            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3 className="modal-header">Add New Announcement</h3>
                        <form onSubmit={handleAddSubmit} className="modal-form">
                            <label>Title</label>
                            <input
                                type="text"
                                value={newAnnouncement.title}
                                onChange={(e) =>
                                    setNewAnnouncement({
                                        ...newAnnouncement,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Content</label>
                            <textarea
                                value={newAnnouncement.content}
                                onChange={(e) =>
                                    setNewAnnouncement({
                                        ...newAnnouncement,
                                        content: e.target.value,
                                    })
                                }
                                rows={4}
                                required
                            />

                            <label>Type</label>
                            <select
                                value={newAnnouncement.type}
                                onChange={(e) =>
                                    setNewAnnouncement({
                                        ...newAnnouncement,
                                        type: e.target.value as 'NEWS' | 'OFFER',
                                    })
                                }
                            >
                                <option value="NEWS">News</option>
                                <option value="OFFER">Special Offer</option>
                            </select>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="button button-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="button button-primary">
                                    Add Announcement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Add Announcement Modal */}
            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3 className="modal-header">Edit Announcement</h3>
                        <form onSubmit={handleEditSubmit} className="modal-form">
                            <label>Title</label>
                            <input
                                type="text"
                                value={editingAnnouncement?.title}
                                onChange={(e) =>
                                    setEditingAnnouncement({
                                        ...editingAnnouncement,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Content</label>
                            <textarea
                                value={editingAnnouncement?.content}
                                onChange={(e) =>
                                    setEditingAnnouncement({
                                        ...editingAnnouncement,
                                        content: e.target.value,
                                    })
                                }
                                rows={4}
                                required
                            />

                            <label>Type</label>
                            <select
                                value={editingAnnouncement?.type}
                                onChange={(e) =>
                                    setEditingAnnouncement({
                                        ...editingAnnouncement,
                                        type: e.target.value as 'NEWS' | 'OFFER',
                                    })
                                }
                            >
                                <option value="NEWS">News</option>
                                <option value="OFFER">Special Offer</option>
                            </select>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="button button-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="button button-primary">
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
