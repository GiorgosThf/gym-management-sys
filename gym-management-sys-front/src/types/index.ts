export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    country: string
    city: string
    address: string
    role: 'ROLE_USER' | 'ROLE_ADMIN'
    enabled: boolean
}

export interface AdminActivity {
    id: string
    type:
        | 'TRAINER_ADDED'
        | 'TRAINER_UPDATED'
        | 'TRAINER_DELETED'
        | 'USER_REGISTERED'
        | 'USER_UPDATED'
        | 'USER_DELETED'
        | 'BOOKING_MADE'
        | 'PROGRAM_ADDED'
        | 'PROGRAM_UPDATED'
        | 'PROGRAM_DELETED'
        | 'ANNOUNCEMENT_POSTED'
        | 'ANNOUNCEMENT_UPDATED'
        | 'ANNOUNCEMENT_DELETED'
    message: string
    timestamp: string
    metadata?: {
        userId?: string
        userName?: string
        programId?: string
        programName?: string
    }
}

export interface UserActivity {
    id: string
    type:
        | 'BOOKING_MADE'
        | 'BOOKING_CANCELLED'
        | 'ANNOUNCEMENT_POSTED'
        | 'USER_REGISTERED'
        | 'USER_UPDATED'
        | 'USER_DELETED'
    message: string
    timestamp: string
    metadata?: {
        programId?: string
        programName?: string
        achievementName?: string
        announcementId?: string
    }
}

export interface Country {
    name: string
    iso3: string
}
export interface Cities {
    data: string[]
}
export interface Program {
    id: string
    name: string
    description: string
    maxCapacity: number
    type: 'INDIVIDUAL' | 'GROUP'
}

export interface Trainer {
    id: string
    email: string
    firstName: string
    lastName: string
    specialization: string
    bio: string
    enabled: boolean
}

export interface Session {
    id: string
    program: Program | null
    trainer: Trainer | null
    date: string
    startTime: string
    endTime: string
    currentBookings: number
    maxCapacity: number
}

export interface Booking {
    id: string
    user: User
    session: Session
    cancelled: boolean
    createdAt: string
}

export interface Announcement {
    id?: string
    title?: string
    content?: string
    type?: 'NEWS' | 'OFFER'
    createdAt?: string | Date
}
