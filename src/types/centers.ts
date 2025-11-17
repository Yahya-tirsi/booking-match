import type { Stadium } from './booking'

export interface Center {
    id: string
    name: string
    location: string
    address: string
    city: string
    country: string
    contactEmail: string
    contactPhone: string
    ownerId: string
    ownerName: string
    isActive: boolean
    stadiums: Stadium[]
    images?: string[]
    description?: string
    openingHours?: OpeningHours
    createdAt: string
    updatedAt: string
}

export interface OpeningHours {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
}

export interface CreateCenterData {
    name: string
    location: string
    address: string
    city: string
    country: string
    contactEmail: string
    contactPhone: string
    description?: string
}

export interface UpdateCenterData {
    name?: string
    location?: string
    address?: string
    city?: string
    country?: string
    contactEmail?: string
    contactPhone?: string
    description?: string
    isActive?: boolean
}