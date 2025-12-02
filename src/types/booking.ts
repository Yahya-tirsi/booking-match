export interface Stadium {
    id: string
    name: string
    sportType: 'football' | 'basketball' | 'volleyball' | 'tennis' | 'badminton'
    pricePerHour: number
    capacity: number
    facilities: string[]
    centerId: string
    images?: string[]
    description?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface TimeSlot {
    startTime: string
    endTime: string
    isAvailable: boolean
    price?: number
}

export interface Booking {
    id: string
    stadiumId: string
    userId: string
    userName: string
    stadiumName: string
    date: string
    startTime: string
    endTime: string
    totalPrice: number
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
    createdAt: string
    updatedAt: string
}

export interface BookingRequest {
    stadiumId: string
    date: string
    startTime: string
    endTime: string
    notes?: string
}

export interface BookingFilters {
    date?: string
    sportType?: string
    minPrice?: number
    maxPrice?: number
    centerId?: string
}

