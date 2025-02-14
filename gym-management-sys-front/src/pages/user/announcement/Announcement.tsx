import React from 'react'
import { Announcement } from '../../../types'
import { AnnouncementService } from '../../../services/AnnouncementService.ts'
import { formatDateByType } from '../../../utils/time.utils.ts'

export function UserAnnouncements() {
    const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const { getAnnouncements } = AnnouncementService()

    React.useEffect(() => {
        async function fetchAnnouncements() {
            await getAnnouncements()
                .then(setAnnouncements)
                .catch((error) => setError(error.message))
                .finally(() => setLoading(false))
        }
        fetchAnnouncements().then()
    }, [])

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
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Latest News</h1>
                <p className="mt-4 text-xl text-gray-600">
                    Choose from our wide range of fitness programs designed to help you achieve your
                    goals
                </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="space-y-4 mt-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 bg-white shadow rounded-lg">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <p>{announcement.content}</p>
                        <small>
                            Posted on:{' '}
                            {formatDateByType(
                                announcement.createdAt?.toLocaleString() ?? '',
                                'd/M/yyyy'
                            )}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    )
}
