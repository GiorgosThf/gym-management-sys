import React from 'react'
import { Country, User } from '../../../types'
import { Mail, MapPin, UserCog, Trash2, Search, Loader2 } from 'lucide-react'
import { UserService } from '../../../services/UserService.ts'
import PopupModal from '../../../components/popup/PopUpModal.tsx'
import { LocationService } from '../../../services/LocationService.ts'
import { createPortal } from 'react-dom'

export function Users() {
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState({
        countries: true,
        cities: false,
        submit: false,
    })
    const [usersLoading, setUsersLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [searchTerm, setSearchTerm] = React.useState('')
    const [editingUser, setEditingUser] = React.useState<User | null>(null)
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [selectedUserId, setSelectedUserId] = React.useState('')
    const [countries, setCountries] = React.useState<Country[]>([])
    const [cities, setCities] = React.useState<string[]>([])

    const { getCountries, getCities } = LocationService()

    const { getUsers, updateUser, deleteUser } = UserService()

    const fetchUsers = async () => {
        await getUsers()
            .then(setUsers)
            .catch((error) => setError(error.message))
            .finally(() => setUsersLoading(false))
    }

    React.useEffect(() => {
        fetchUsers().then()
    }, [])

    React.useEffect(() => {
        fetchCountries()
            .then(console.log)
            .catch((error) => setError(error.message))
    }, [])

    React.useEffect(() => {
        if (editingUser?.country) {
            fetchCities(editingUser.country)
                .then(console.log)
                .catch((error) => setError(error.message))
        }
    }, [editingUser?.country])

    const fetchCountries = async () => {
        setLoading((prev) => ({ ...prev, countries: true }))
        await getCountries()
            .then(setCountries)
            .then(() => setLoading((prev) => ({ ...prev, countries: false })))
            .catch((error) => setError(error.message))
    }

    const fetchCities = async (country: string) => {
        setLoading((prev) => ({ ...prev, cities: true }))
        await getCities(country)
            .then(setCities)
            .then(() => setLoading((prev) => ({ ...prev, cities: false })))
            .catch((error) => setError(error.message))
    }

    const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
        await updateUser(userId, updates)
            .then(() => {
                fetchUsers()
                setEditingUser(null)
            })
            .catch((error) => setError(error.message))
    }

    const confirmDelete = (userId: string) => {
        setSelectedUserId(userId)
        setIsPopupOpen(true)
    }

    const handleDeleteUser = async () => {
        await deleteUser(selectedUserId)
            .then(fetchUsers)
            .catch((error) => setError(error.message))
            .finally(() => setIsPopupOpen(false))
    }

    const filteredUsers = users.filter(
        (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (usersLoading) {
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
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage all registered users in the system
                    </p>
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

            <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                            User
                                        </th>
                                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                                            Contact
                                        </th>
                                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                                            Location
                                        </th>
                                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                                            Role
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Enabled
                                        </th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-lg font-medium text-gray-600">
                                                            {user.firstName[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden whitespace-nowrap px-3 py-4 lg:table-cell">
                                                <div className="flex items-center">
                                                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-gray-900">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="hidden whitespace-nowrap px-3 py-4 lg:table-cell">
                                                <div className="flex items-center">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-gray-900">
                                                        {user.city}, {user.country}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="hidden whitespace-nowrap px-3 py-4 lg:table-cell">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        user.role === 'ROLE_ADMIN'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        user.enabled
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    ENABLED
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <UserCog className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
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
                onConfirm={handleDeleteUser}
                confirmText="Delete"
                cancelText="Cancel"
                type="confirmation"
            />

            {/* Edit User Modal */}
            {editingUser &&
                createPortal(
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={editingUser.firstName}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={editingUser.lastName}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                lastName: e.target.value,
                                            })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                email: e.target.value,
                                            })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        required
                                        value={editingUser.country}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                country: e.target.value,
                                            })
                                        }
                                        className="form-input"
                                        disabled={loading.countries}
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map((country) => (
                                            <option key={country.iso3} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {loading.countries && (
                                        <div className="mt-2 text-sm text-gray-500 flex items-center">
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Loading countries...
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <select
                                        id="city"
                                        name="city"
                                        required
                                        value={editingUser.city}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, city: e.target.value })
                                        }
                                        className="form-input"
                                        disabled={!editingUser.country || loading.cities}
                                    >
                                        <option value="">Select a city</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    {loading.cities && (
                                        <div className="mt-2 text-sm text-gray-500 flex items-center">
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Loading cities...
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={editingUser.address}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                address: e.target.value,
                                            })
                                        }
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                role: e.target.value as 'ROLE_USER' | 'ROLE_ADMIN',
                                            })
                                        }
                                        className="form-input"
                                    >
                                        <option value="ROLE_USER">User</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={editingUser.enabled ? 'true' : 'false'}
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
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
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleUpdateUser(editingUser.id, editingUser)
                                        }
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    )
}
