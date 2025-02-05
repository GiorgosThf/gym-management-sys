import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.ts'
import { Dumbbell, User, LogOut, Menu, X, UserPlus, LayoutDashboard } from 'lucide-react'
import './Layout.css'

export function Layout() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const location = useLocation()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return (
        <div className="layout-container">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-content">
                        {/* Logo and Mobile Menu Button */}
                        <div className="navbar-left">
                            <Link to="/" className="navbar-logo" onClick={closeMenu}>
                                <Dumbbell className="logo-icon" />
                                <span className="logo-text">GymPro</span>
                            </Link>
                            <button className="mobile-menu-button" onClick={toggleMenu}>
                                {isMenuOpen ? (
                                    <X className="menu-icon" />
                                ) : (
                                    <Menu className="menu-icon" />
                                )}
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
                            <Link
                                to="/programs"
                                className={`nav-link ${location.pathname === '/programs' ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                <Dumbbell className="program-icon-nav" />
                                Programs
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to={
                                        user?.role === 'ROLE_ADMIN'
                                            ? '/admin/dashboard'
                                            : '/user/dashboard'
                                    }
                                    className={`nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    <LayoutDashboard className="dashboard-icon-nav" />
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        {/* Auth Buttons */}
                        <div className={`navbar-auth ${isMenuOpen ? 'show' : ''}`}>
                            {isAuthenticated ? (
                                <div className="auth-user">
                                    <span className="user-name-nav">
                                        <User className="user-icon" />
                                        Hi, {user?.firstName}
                                    </span>

                                    <button
                                        onClick={() => {
                                            logout()
                                            closeMenu()
                                        }}
                                        className="logout-button"
                                    >
                                        <LogOut className="logout-icon" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link to="/login" className="login-button" onClick={closeMenu}>
                                        <User className="login-icon" />
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="register-button"
                                        onClick={closeMenu}
                                    >
                                        <UserPlus className="register-button-icon" />
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
