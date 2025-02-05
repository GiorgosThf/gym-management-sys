import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthService } from '../services/AuthService.ts'
import { useAuthStore } from '../store/authStore.ts'
import { Dumbbell } from 'lucide-react'

export function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [message, setMessage] = useState(location.state?.message || null) // Store the success message
    const { loginUser } = AuthService()
    const login = useAuthStore((state) => state.login)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('')
        setMessage(null)
        setCredentials((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage(null)
        loginUser(credentials)
            .then(async (response) => {
                const user = await response.json().then((json) => {
                    return json.data
                })

                login(user, response.headers.get('Authorization'))

                if (user.role === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard')
                } else {
                    navigate('/user/dashboard')
                }
            })
            .catch((error) => setError(error.message))
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
                <Dumbbell className="size-32" />
            </div>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                        {message}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={credentials.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
