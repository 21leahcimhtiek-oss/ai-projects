export interface User {
  id: string
  email: string
  username: string
  displayName: string
  birthdate: string
  gender: 'male' | 'female' | 'non-binary' | 'other'
  interestedIn: ('male' | 'female' | 'non-binary' | 'other')[]
  location: {
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  photos: Photo[]
  bio: string
  interests: string[]
  kinks: Kink[]
  relationshipStatus: 'single' | 'married' | 'attached' | 'complicated'
  lookingFor: ('casual' | 'discreet' | 'ongoing' | 'online')[]
  verificationStatus: VerificationStatus
  subscriptionTier: 'free' | 'premium' | 'vip'
  createdAt: Date
  lastActive: Date
  settings: UserSettings
}

export interface Photo {
  id: string
  url: string
  isPrimary: boolean
  isVerified: boolean
  uploadedAt: Date
}

export interface Kink {
  id: string
  name: string
  category: KinkCategory
  level: 'curious' | 'experienced' | 'expert'
}

export type KinkCategory = 
  | 'bdsm'
  | 'roleplay'
  | 'fetish'
  | 'group'
  | 'voyeurism'
  | 'sensory'
  | 'power'
  | 'other'

export interface VerificationStatus {
  emailVerified: boolean
  phoneVerified: boolean
  photoVerified: boolean
  idVerified: boolean
  trustScore: number // 0-100
}

export interface UserSettings {
  ageRange: [number, number]
  maxDistance: number
  showOnline: boolean
  showLastActive: boolean
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  newMatches: boolean
  messages: boolean
  likes: boolean
  promotions: boolean
}

export interface PrivacySettings {
  showLocation: boolean
  showKinks: boolean
  showRelationshipStatus: boolean
  incognitoMode: boolean
}

export interface Match {
  id: string
  users: [string, string]
  matchedAt: Date
  lastMessage?: Message
  compatibilityScore: number
}

export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  type: 'text' | 'photo' | 'gift'
  isRead: boolean
  createdAt: Date
  flagged: boolean
  flagReason?: string
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId: string
  reason: ReportReason
  description: string
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  createdAt: Date
  resolvedAt?: Date
  resolvedBy?: string
  action?: string
}

export type ReportReason = 
  | 'fake_profile'
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'solicitation'
  | 'underage'
  | 'other'

export interface ModerationLog {
  id: string
  action: 'flag' | 'warn' | 'suspend' | 'ban' | 'delete_content'
  targetUserId: string
  reason: string
  aiConfidence: number
  reviewedBy?: string
  createdAt: Date
}

export interface AIAnalysis {
  isSuspicious: boolean
  confidence: number
  flags: string[]
  recommendation: 'allow' | 'review' | 'block'
}