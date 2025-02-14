import React from 'react'
import { Users, Dumbbell, Calendar, Bell, Users2 } from 'lucide-react'
import { StatsService } from '../../../services/StatsService.ts'
import { AdminActivity } from '../../../types'
import { PaginationControls } from '../../../components/pagination/PaginationControls.tsx'

export function AdminOverview() {
    const [stats, setStats] = React.useState({
        totalUsers: 0,
        totalPrograms: 0,
        activeBookings: 0,
        pendingRequests: 0,
    })
    const [activities, setActivities] = React.useState<AdminActivity[]>([])
    const { getStatsAdmin, getActivitiesAdmin } = StatsService()
    const [loading, setLoading] = React.useState(true)
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageSize] = React.useState(10)
    const [totalPages, setTotalPages] = React.useState(0)
    const [error, setError] = React.useState<string>('')

    React.useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            await Promise.all([getStatsAdmin(), getActivitiesAdmin(currentPage)])
                .then(([stats, activities]) => {
                    setStats(stats)
                    setActivities(activities.content)
                    setTotalPages(activities.totalPages)
                })
                .catch((error) => setError(error.message))
                .finally(() => setLoading(false))
        }

        fetchStats().then()
    }, [currentPage, pageSize])

    const getActivityIcon = (type: AdminActivity['type']) => {
        switch (type) {
            case 'TRAINER_ADDED':
            case 'TRAINER_UPDATED':
            case 'TRAINER_DELETED':
                return <Users2 className="h-5 w-5 text-blue-500" />
            case 'USER_REGISTERED':
            case 'USER_UPDATED':
            case 'USER_DELETED':
                return <Users className="h-5 w-5 text-blue-500" />
            case 'BOOKING_MADE':
                return <Calendar className="h-5 w-5 text-green-500" />
            case 'PROGRAM_ADDED':
            case 'PROGRAM_UPDATED':
            case 'PROGRAM_DELETED':
                return <Dumbbell className="h-5 w-5 text-purple-500" />
            case 'ANNOUNCEMENT_POSTED':
            case 'ANNOUNCEMENT_UPDATED':
            case 'ANNOUNCEMENT_DELETED':
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
        { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
        {
            name: 'Total Programs',
            value: stats.totalPrograms,
            icon: Dumbbell,
            color: 'bg-green-500',
        },
        {
            name: 'Active Bookings',
            value: stats.activeBookings,
            icon: Calendar,
            color: 'bg-purple-500',
        },
        {
            name: 'Pending Requests',
            value: stats.pendingRequests,
            icon: Bell,
            color: 'bg-yellow-500',
        },
    ]

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
            {error && <div className="error-message">{error}</div>}

            <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {card.name}
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {card.value}
                                            </dd>
                                        </dl>
                                    </div>
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
                                                <p className="text-sm text-gray-500">
                                                    {activity.metadata?.userName &&
                                                        `by ${activity.metadata.userName}`}
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
