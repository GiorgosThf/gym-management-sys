import React from 'react'
import { useAuthStore } from '../../../store/authStore.ts'
import { Calendar, Award, ClipboardList, Users, Bell } from 'lucide-react'
import { StatsService } from '../../../services/StatsService.ts'
import { UserActivity } from '../../../types'
import '../../../styles/Overview.css'
import { PaginationControls } from '../../../components/pagination/PaginationControls.tsx'

export function UserOverview() {
    const { user } = useAuthStore()
    const [stats, setStats] = React.useState({
        totalBookings: 0,
        upcomingBookings: 0,
        completedPrograms: 0,
    })
    const { getStatsUser, getActivitiesUser } = StatsService()
    const [activities, setActivities] = React.useState<UserActivity[]>([])
    const [loading, setLoading] = React.useState(true)
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageSize] = React.useState(10)
    const [totalPages, setTotalPages] = React.useState(0)
    const [error, setError] = React.useState<string>('')

    React.useEffect(() => {
        const fetchStats = async () => {
            await Promise.all([getStatsUser(user?.id), getActivitiesUser(user?.id, currentPage)])
                .then(([stats, activities]) => {
                    setStats(stats)
                    setActivities(activities.content)
                    setTotalPages(activities.totalPages)
                })
                .catch((error) => setError(error.message))
                .finally(() => setLoading(false))
        }

        fetchStats().then()
    }, [pageSize, currentPage])
    const getActivityIcon = (type: UserActivity['type']) => {
        switch (type) {
            case 'USER_REGISTERED':
            case 'USER_UPDATED':
            case 'USER_DELETED':
                return <Users className="h-5 w-5 text-blue-500" />
            case 'BOOKING_MADE':
            case 'BOOKING_CANCELLED':
                return <Calendar className="h-5 w-5 text-blue-500" />
            case 'ANNOUNCEMENT_POSTED':
                return <Bell className="h-5 w-5 text-yellow-500" />
        }
    }
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'short',
        }).format(date)
    }
    const cards = [
        { name: 'Total Bookings', value: stats.totalBookings, icon: ClipboardList, color: 'blue' },
        {
            name: 'Upcoming Sessions',
            value: stats.upcomingBookings,
            icon: Calendar,
            color: 'green',
        },
        {
            name: 'Completed Programs',
            value: stats.completedPrograms,
            icon: Award,
            color: 'purple',
        },
    ]

    return (
        <div className="overview-container">
            <h1 className="overview-title">Welcome back, {user?.firstName}!</h1>
            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.name} className={`stat-card ${card.color}`}>
                            <div className="stat-content">
                                <div className={`stat-icon-wrapper ${card.color}`}>
                                    <Icon className="stat-icon" />
                                </div>
                                <div className="stat-info">
                                    <dt className="stat-label">{card.name}</dt>
                                    <dd className="stat-value">{card.value}</dd>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                <div className="mt-4 bg-white shadow rounded-lg divide-y divide-gray-200">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">
                            Loading activities...
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No recent activities</div>
                    ) : (
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-200">
                                {activities.map((activity) => (
                                    <li key={activity.id} className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {activity.message}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-sm text-gray-500">
                                                {formatTimestamp(activity.timestamp)}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {activities.length > 0 && (
                    <div className="mt-8">
                        {/* Display programs here */}
                        <PaginationControls
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
