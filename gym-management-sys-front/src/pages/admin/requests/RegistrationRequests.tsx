import React from 'react'
import { User } from '../../../types'
import { Check, X, Mail, MapPin } from 'lucide-react'
import { RequestService } from '../../../services/RequestService.ts'

export function RegistrationRequests() {
    const [requests, setRequests] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    const { getRegistrationRequests, handleRegistrationRequest } = RequestService()

    const fetchRequests = React.useCallback(async () => {
        await getRegistrationRequests()
            .then(setRequests)
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }, [getRegistrationRequests])

    React.useEffect(() => {
        fetchRequests().then()
    }, [])

    const handleRequest = async (userId: string, action: boolean) => {
        await handleRegistrationRequest(userId, action).then(fetchRequests).catch(setError)
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
                    <h1 className="text-2xl font-semibold text-gray-900">Registration Requests</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Review and manage new user registration requests
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {requests.length === 0 ? (
                                <div className="text-center py-12 bg-white">
                                    <p className="text-gray-500">
                                        No pending registration requests
                                    </p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Name
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Contact
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Location
                                            </th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {requests.map((user) => (
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
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    <div className="flex items-center">
                                                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                                        <span className="text-gray-900">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                        <span className="text-gray-900">
                                                            {user.city}, {user.country}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleRequest(user.id, true)
                                                            }
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleRequest(user.id, false)
                                                            }
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
