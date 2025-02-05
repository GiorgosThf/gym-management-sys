import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout.tsx'
import { Home } from './pages/Home'
import { Programs } from './pages/Programs'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AdminDashboard } from './pages/admin/dashboard/Dashboard.tsx'
import { UserDashboard } from './pages/user/dashboard/Dashboard.tsx'
import { ProtectedRoute } from './components/route/ProtectedRoute.tsx'
import { RegistrationRequests } from './pages/admin/requests/RegistrationRequests.tsx'
import { Users } from './pages/admin/users/Users.tsx'
import { AdminPrograms } from './pages/admin/programs/Programs.tsx'
import { AdminSession } from './pages/admin/session/AdminSession.tsx'
import { Announcements } from './pages/admin/announcement/Announcement.tsx'
import { UserBookings } from './pages/user/booking/Bookings.tsx'
import { UserSchedule } from './pages/user/schedule/Schedule.tsx'
import { UserAnnouncements } from './pages/user/announcement/Announcement.tsx'
import { AdminOverview } from './pages/admin/overview/Overview.tsx'
import { Trainers } from './pages/admin/trainers/Trainers.tsx'
import { UserProfile } from './pages/user/profile/Profile.tsx'
import { UserOverview } from './pages/user/overview/Overview.tsx'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="programs" element={<Programs />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    {/* Protected Admin Routes */}
                    <Route path="admin" element={<ProtectedRoute role="ROLE_ADMIN" />}>
                        <Route path="dashboard" element={<AdminDashboard />}>
                            <Route index element={<AdminOverview />} />
                            <Route path="overview" element={<AdminOverview />} />
                            <Route path="requests" element={<RegistrationRequests />} />
                            <Route path="users" element={<Users />} />
                            <Route path="trainers" element={<Trainers />} />
                            <Route path="programs" element={<AdminPrograms />} />
                            <Route path="schedule" element={<AdminSession />} />
                            <Route path="announcements" element={<Announcements />} />
                        </Route>
                    </Route>

                    {/* Protected User Routes */}
                    <Route path="user" element={<ProtectedRoute role="ROLE_USER" />}>
                        <Route path="dashboard" element={<UserDashboard />}>
                            <Route index element={<UserOverview />} />
                            <Route path="overview" element={<UserOverview />} />
                            <Route path="profile" element={<UserProfile />} />
                            <Route path="bookings" element={<UserBookings />} />
                            <Route path="schedule" element={<UserSchedule />} />
                            <Route path="announcements" element={<UserAnnouncements />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
