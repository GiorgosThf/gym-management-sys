import { Link } from 'react-router-dom'
import { Dumbbell, Users, Calendar, Award } from 'lucide-react'
import { useAuthStore } from '../store/authStore.ts'

export function Home() {
    const { user } = useAuthStore()

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="relative bg-indigo-800 rounded-3xl overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                        alt="Gym"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                    <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        <span className="block text-white">Transform Your Life at</span>
                        <span className="block text-indigo-200">GymPro</span>
                    </h1>
                    <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                        Join our state-of-the-art facility and experience the perfect blend of
                        professional guidance, modern equipment, and a motivating atmosphere.
                    </p>
                    <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                        <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                            <Link
                                to={user ? '/' : '/register'}
                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                            >
                                Get started
                            </Link>
                            <Link
                                to="/programs"
                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                            >
                                View Programs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                        Features
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Everything you need to succeed
                    </p>
                </div>

                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <Dumbbell className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Modern Equipment
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                State-of-the-art facilities with the latest fitness equipment.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Expert Trainers
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                Professional trainers to guide you through your fitness journey.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Flexible Schedule
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                Book your sessions at times that work best for you.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <Award className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Diverse Programs
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                Wide range of programs to suit all fitness levels and goals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
