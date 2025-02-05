import { Outlet, Link, useLocation } from 'react-router-dom'
import {
    Users,
    Dumbbell,
    Calendar,
    Bell,
    UserCheck,
    LayoutDashboard,
    UserPen,
    Menu,
    X,
} from 'lucide-react'
import React from 'react'

export function AdminDashboard() {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = React.useState(false)
    const navigation = [
        { name: 'Overview', href: 'overview', icon: LayoutDashboard },
        { name: 'Registration Requests', href: 'requests', icon: UserCheck },
        { name: 'Users', href: 'users', icon: UserPen },
        { name: 'Trainers', href: 'trainers', icon: Users },
        { name: 'Programs', href: 'programs', icon: Dumbbell },
        { name: 'Schedule', href: 'schedule', icon: Calendar },
        { name: 'Announcements', href: 'announcements', icon: Bell },
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex justify-between items-center p-4 bg-white shadow">
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div
                    className={`fixed inset-0 z-40 flex md:relative md:flex md:w-64 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                >
                    {/* Sidebar Background for Mobile */}
                    {sidebarOpen && (
                        <button
                            tabIndex={0}
                            className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        ></button>
                    )}

                    <div className="relative flex flex-col w-64 bg-white border-r shadow-md">
                        {/* Close Button for Mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 md:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center px-4 py-5">
                            <Dumbbell className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                Admin Panel
                            </span>
                        </div>

                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname.includes(item.href)
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                            isActive
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon
                                            className={`mr-3 h-5 w-5 ${
                                                isActive
                                                    ? 'text-indigo-600'
                                                    : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1">
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
