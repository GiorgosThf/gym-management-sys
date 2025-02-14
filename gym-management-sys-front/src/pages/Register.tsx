import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/AuthService.ts'
import { Dumbbell, Loader2 } from 'lucide-react'
import { LocationService } from '../services/LocationService.ts'
import { Country } from '../types'
import { useAuthStore } from '../store/authStore.ts'

export function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        address: '',
    })
    const [error, setError] = useState('')
    const [countries, setCountries] = useState<Country[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [loading, setLoading] = useState({
        countries: true,
        cities: false,
        submit: false,
    })
    const { user } = useAuthStore()

    const { registerUser } = AuthService()
    const { getCountries, getCities } = LocationService()

    React.useEffect(() => {
        if (user) {
            navigate('/')
        }
        fetchCountries()
            .then(console.log)
            .catch((error) => setError(error.message))
    }, [])

    React.useEffect(() => {
        if (formData.country) {
            fetchCities(formData.country)
                .then(console.log)
                .catch((error) => setError(error.message))
        }
    }, [formData.country])

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        await registerUser(formData)
            .then(() => {
                navigate('/login', {
                    state: {
                        message:
                            'Registration successful! Please wait for admin approval before logging in.',
                    },
                })
            })
            .catch((error) => setError(error.message))
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
                <Dumbbell className="size-24" />
            </div>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Join our gym community</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
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
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                required
                                value={formData.country}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        <div>
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-700"
                            >
                                City
                            </label>
                            <select
                                id="city"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={!formData.country || loading.cities}
                            >
                                <option value="">Select a city</option>
                                {cities.map((city) => (
                                    <option key={cities.indexOf(city)} value={city}>
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
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                required
                                value={formData.address}
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
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
