import { useAuthStore } from '../../../store/authStore.ts'
import React, { useState } from 'react'
import { Country, User } from '../../../types'
import { Loader2, Mail, MapPin, UserIcon } from 'lucide-react'
import { UserService } from '../../../services/UserService.ts'
import { LocationService } from '../../../services/LocationService.ts'
import PopupModal from '../../../components/popup/PopUpModal.tsx'
import '../../../styles/Profile.css'

export function UserProfile() {
    const { user, token, login } = useAuthStore()
    const [editing, setEditing] = React.useState(false)
    const [formData, setFormData] = React.useState<Partial<User>>({})
    const [error, setError] = React.useState('')
    const [countries, setCountries] = useState<Country[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [isPopupOpen, setIsPopupOpen] = React.useState(false)
    const [loading, setLoading] = useState({
        countries: true,
        cities: false,
        submit: false,
    })
    const { updateUser } = UserService()

    const { getCountries, getCities } = LocationService()

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                country: user.country,
                city: user.city,
                address: user.address,
                id: user.id,
                role: user.role,
                enabled: user.enabled,
            })
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        await updateUser(user?.id, formData)
            .then((user) => {
                login(user, token)
                setEditing(false)
            })
            .catch((error) => setError(error.message))
            .finally(() => setIsPopupOpen(false))
    }

    if (!user) return null

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 className="profile-title">My Profile</h1>
                <button onClick={() => setEditing(!editing)} className="edit-button">
                    {editing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {editing ? (
                <form className="profile-form">
                    {/* PopupModal for confirmation */}
                    <PopupModal
                        title="Confirm Changes"
                        message="Are you sure you want to save these changes?"
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Save"
                        cancelText="Cancel"
                        type="form"
                    />
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                value={formData.firstName ?? ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
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
                                value={formData.lastName ?? ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, lastName: e.target.value })
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
                                value={formData.email ?? ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
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
                                value={formData.country ?? ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, country: e.target.value })
                                }
                                className="form-input"
                                disabled={loading.countries}
                            >
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                    <option key={country.iso2} value={country.name}>
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
                                value={formData.city ?? ''}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="form-input"
                                disabled={!formData.country || loading.cities}
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
                                value={formData.address ?? ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="form-input"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="save-button"
                            onClick={() => setIsPopupOpen(true)}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="profile-info">
                    <div className="info-header">
                        <div className="avatar">
                            <UserIcon className="avatar-icon" />
                        </div>
                        <div className="user-name">
                            {user.firstName} {user.lastName}
                        </div>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <Mail className="info-icon" />
                            <div className="info-content">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <MapPin className="info-icon" />
                            <div className="info-content">
                                <span className="info-label">Location</span>
                                <span className="info-value">
                                    {user.city}, {user.country}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Confirmation Modal */}
            <PopupModal
                title="Confirm Changes"
                message="Are you sure you want to save these changes?"
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleSubmit}
                confirmText="Save"
                cancelText="Cancel"
                type="confirmation"
            />
        </div>
    )
}
