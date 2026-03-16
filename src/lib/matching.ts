import { User } from '@/types'

export interface MatchScore {
  userId: string
  score: number
  reasons: string[]
}

export function calculateCompatibility(user: User, candidate: User): MatchScore {
  let score = 0
  const reasons: string[] = []
  
  // Gender preference matching (critical)
  if (candidate.interestedIn.includes(user.gender) && user.interestedIn.includes(candidate.gender)) {
    score += 30
    reasons.push('Gender preferences align')
  } else {
    return { userId: candidate.id, score: 0, reasons: ['Gender preferences don\'t match'] }
  }
  
  // Age range matching
  const userAge = calculateAge(user.birthdate)
  const candidateAge = calculateAge(candidate.birthdate)
  
  if (candidateAge >= user.settings.ageRange[0] && candidateAge <= user.settings.ageRange[1]) {
    score += 15
    reasons.push('Within your age preference')
  }
  
  if (userAge >= candidate.settings.ageRange[0] && userAge <= candidate.settings.ageRange[1]) {
    score += 10
    reasons.push('You match their age preference')
  }
  
  // Location proximity
  if (user.location.coordinates && candidate.location.coordinates) {
    const distance = calculateDistance(
      user.location.coordinates.lat,
      user.location.coordinates.lng,
      candidate.location.coordinates.lat,
      candidate.location.coordinates.lng
    )
    
    if (distance <= user.settings.maxDistance) {
      score += 20
      reasons.push(`${distance} miles away`)
    }
  }
  
  // Interest overlap
  const sharedInterests = user.interests.filter(i => candidate.interests.includes(i))
  if (sharedInterests.length > 0) {
    score += Math.min(sharedInterests.length * 5, 15)
    if (sharedInterests.length >= 3) {
      reasons.push(`${sharedInterests.length} shared interests`)
    }
  }
  
  // Kink compatibility
  const userKinkNames = user.kinks.map(k => k.name)
  const candidateKinkNames = candidate.kinks.map(k => k.name)
  const sharedKinks = userKinkNames.filter(k => candidateKinkNames.includes(k))
  
  if (sharedKinks.length > 0) {
    score += Math.min(sharedKinks.length * 8, 24)
    if (sharedKinks.length >= 2) {
      reasons.push(`${sharedKinks.length} shared kinks`)
    }
  }
  
  // Looking for alignment
  const lookingForMatch = user.lookingFor.filter(l => candidate.lookingFor.includes(l))
  if (lookingForMatch.length > 0) {
    score += lookingForMatch.length * 5
    reasons.push('Similar relationship goals')
  }
  
  // Verification bonus
  if (candidate.verificationStatus.photoVerified) {
    score += 5
    reasons.push('Photo verified')
  }
  
  if (candidate.verificationStatus.phoneVerified) {
    score += 3
  }
  
  // Trust score bonus
  if (candidate.verificationStatus.trustScore >= 70) {
    score += 5
    reasons.push('High trust score')
  }
  
  // Activity recency bonus
  const daysSinceActive = (Date.now() - new Date(candidate.lastActive).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceActive < 1) {
    score += 5
    reasons.push('Active today')
  } else if (daysSinceActive < 7) {
    score += 2
  }
  
  return { userId: candidate.id, score: Math.min(score, 100), reasons }
}

function calculateAge(birthdate: string): number {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R * c)
}

export function rankCandidates(user: User, candidates: User[]): User[] {
  const scores = candidates.map(c => ({
    user: c,
    ...calculateCompatibility(user, c)
  }))
  
  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.user)
}