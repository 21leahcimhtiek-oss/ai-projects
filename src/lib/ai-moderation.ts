// AI Moderation System
// This simulates the AI moderation that would run on the backend

interface ModerationResult {
  isApproved: boolean
  confidence: number
  flags: string[]
  recommendation: 'approve' | 'review' | 'reject'
  reasons: string[]
}

// Seller/bot detection patterns
const SELLER_PATTERNS = [
  /\b(cash|pay|money|venmo|cashapp|paypal|onlyfans|premium|snapchat)\b/gi,
  /\b(sell|selling|buy|buying)\b/gi,
  /\b(\$[0-9]+|[0-9]+\s*dollars)\b/gi,
  /\b(meet.*\$\$?\d|\$\$?\d+.*meet)\b/gi,
  /\b(content|pics|videos|custom)\s*(for|for\s*sale)\b/gi,
  /\b(dm.*rates|rates.*dm)\b/gi,
]

const SPAM_PATTERNS = [
  /\b(click\s*here|visit\s*my|check\s*out)\b/gi,
  /\b(www\.|https?:\/\/|\.com|\.net|\.org)\b/gi,
  /\b(free\s*trial|limited\s*offer|act\s*now)\b/gi,
  /(.)\1{4,}/g, // Repeated characters
]

const HARASSMENT_PATTERNS = [
  /\b(stupid|idiot|ugly|fat|loser|pathetic)\b/gi,
  /\b(kill\s*yourself|kys|die)\b/gi,
  /\b(rape|rapist)\b/gi,
]

const BOT_INDICATORS = [
  /^hi+\s*[.!]?$/i,
  /^hey+\s*[.!]?$/i,
  /^hello+\s*[.!]?$/i,
  /^(what'?s?\s*up|wazz?up|sup)\s*[.!]?$/i,
  /^how\s*(are|r)\s*(you|u)\s*[.?]?$/i,
]

// Message timing analysis (would be server-side)
interface MessageTiming {
  timestamps: number[]
  averageInterval: number
  consistency: number
}

export function analyzeMessageTiming(timestamps: number[]): MessageTiming {
  if (timestamps.length < 2) {
    return { timestamps, averageInterval: 0, consistency: 1 }
  }
  
  const intervals = []
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1])
  }
  
  const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
  const variance = intervals.reduce((sum, i) => sum + Math.pow(i - averageInterval, 2), 0) / intervals.length
  const stdDev = Math.sqrt(variance)
  const consistency = averageInterval > 0 ? 1 - (stdDev / averageInterval) : 0
  
  return { timestamps, averageInterval, consistency }
}

export function detectBotBehavior(timing: MessageTiming): { isBot: boolean; confidence: number } {
  // Bots often have very consistent timing (low standard deviation)
  if (timing.consistency > 0.95 && timing.timestamps.length > 5) {
    return { isBot: true, confidence: 0.85 }
  }
  
  // Very fast responses consistently
  if (timing.averageInterval < 3000 && timing.consistency > 0.8) {
    return { isBot: true, confidence: 0.75 }
  }
  
  return { isBot: false, confidence: 0.5 }
}

export function moderateMessage(content: string, messageHistory: string[] = []): ModerationResult {
  const flags: string[] = []
  const reasons: string[] = []
  let maxConfidence = 0
  
  // Check for seller patterns
  for (const pattern of SELLER_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      flags.push('seller_content')
      reasons.push(`Detected potential solicitation: "${matches[0]}"`)
      maxConfidence = Math.max(maxConfidence, 0.85)
    }
  }
  
  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      flags.push('spam')
      reasons.push(`Detected potential spam: "${matches[0]}"`)
      maxConfidence = Math.max(maxConfidence, 0.75)
    }
  }
  
  // Check for harassment
  for (const pattern of HARASSMENT_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      flags.push('harassment')
      reasons.push(`Detected potential harassment: "${matches[0]}"`)
      maxConfidence = Math.max(maxConfidence, 0.90)
    }
  }
  
  // Check for bot-like messages
  if (BOT_INDICATORS.some(pattern => pattern.test(content.trim()))) {
    // Only flag if multiple similar messages
    const similarMessages = messageHistory.filter(m => 
      m.toLowerCase().trim() === content.toLowerCase().trim()
    )
    if (similarMessages.length >= 2) {
      flags.push('bot_behavior')
      reasons.push('Repetitive messages detected')
      maxConfidence = Math.max(maxConfidence, 0.70)
    }
  }
  
  // Personal info detection (phone, email)
  const phonePattern = /\b(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})\b/g
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  
  if (phonePattern.test(content)) {
    flags.push('personal_info')
    reasons.push('Phone number detected - sharing personal info too early')
    maxConfidence = Math.max(maxConfidence, 0.65)
  }
  
  if (emailPattern.test(content)) {
    flags.push('personal_info')
    reasons.push('Email detected - sharing personal info too early')
    maxConfidence = Math.max(maxConfidence, 0.60)
  }
  
  const recommendation = maxConfidence >= 0.80 ? 'reject' : 
                         maxConfidence >= 0.60 ? 'review' : 'approve'
  
  return {
    isApproved: recommendation === 'approve',
    confidence: maxConfidence,
    flags,
    recommendation,
    reasons
  }
}

export function moderateProfile(profile: {
  bio: string
  username: string
  displayName: string
}): ModerationResult {
  const flags: string[] = []
  const reasons: string[] = []
  let maxConfidence = 0
  
  const allText = `${profile.bio} ${profile.username} ${profile.displayName}`.toLowerCase()
  
  // Check for seller indicators in profile
  for (const pattern of SELLER_PATTERNS) {
    const matches = allText.match(pattern)
    if (matches) {
      flags.push('seller_profile')
      reasons.push(`Profile may be soliciting: "${matches[0]}"`)
      maxConfidence = Math.max(maxConfidence, 0.80)
    }
  }
  
  // Check for spam in profile
  for (const pattern of SPAM_PATTERNS) {
    const matches = allText.match(pattern)
    if (matches) {
      flags.push('spam_profile')
      reasons.push(`Profile contains suspicious links`)
      maxConfidence = Math.max(maxConfidence, 0.70)
    }
  }
  
  // Fake name detection
  const fakeNamePatterns = [
    /^(user\d+|anonymous|secret\d*|unknown|nobody)/i,
    /^(test|demo|sample)/i,
  ]
  
  for (const pattern of fakeNamePatterns) {
    if (pattern.test(profile.username) || pattern.test(profile.displayName)) {
      flags.push('suspicious_name')
      reasons.push('Username appears to be fake or placeholder')
      maxConfidence = Math.max(maxConfidence, 0.60)
    }
  }
  
  const recommendation = maxConfidence >= 0.80 ? 'reject' : 
                         maxConfidence >= 0.50 ? 'review' : 'approve'
  
  return {
    isApproved: recommendation === 'approve',
    confidence: maxConfidence,
    flags,
    recommendation,
    reasons
  }
}

// Photo verification simulation
export function analyzePhotoVerification(
  selfieData: string,
  profilePhotoData: string
): { isMatch: boolean; confidence: number } {
  // In production, this would use facial recognition APIs
  // For demo purposes, we simulate the result
  const simulatedConfidence = 0.85 + Math.random() * 0.15
  return {
    isMatch: simulatedConfidence > 0.80,
    confidence: simulatedConfidence
  }
}

// Trust score calculation
export function calculateTrustScore(user: {
  verificationStatus: {
    emailVerified: boolean
    phoneVerified: boolean
    photoVerified: boolean
    idVerified: boolean
  }
  accountAge: number // days
  reportCount: number
  messageCount: number
  responseRate: number // 0-1
}): number {
  let score = 0
  
  // Verification bonuses
  if (user.verificationStatus.emailVerified) score += 10
  if (user.verificationStatus.phoneVerified) score += 15
  if (user.verificationStatus.photoVerified) score += 20
  if (user.verificationStatus.idVerified) score += 25
  
  // Account age bonus
  if (user.accountAge > 30) score += 5
  if (user.accountAge > 90) score += 5
  if (user.accountAge > 365) score += 10
  
  // Activity bonus
  if (user.messageCount > 10) score += 5
  if (user.messageCount > 50) score += 5
  if (user.responseRate > 0.5) score += 5
  if (user.responseRate > 0.8) score += 5
  
  // Report penalty
  score -= user.reportCount * 10
  
  return Math.max(0, Math.min(100, score))
}