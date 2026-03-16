'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Star, Info, MapPin, ChevronUp, Shield, CheckCircle } from 'lucide-react'
import { useStore } from '@/lib/store'
import { User } from '@/types'
import { cn } from '@/lib/utils'

// Mock potential matches
const mockUsers: User[] = [
  {
    id: '1', email: 'user1@test.com', username: 'sarah_la', displayName: 'Sarah', birthdate: '1992-05-15',
    gender: 'female', interestedIn: ['male'], location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
    photos: [{ id: 'p1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', isPrimary: true, isVerified: true, uploadedAt: new Date() }],
    bio: 'Adventurous spirit seeking genuine connections. Love hiking, wine tasting, and deep conversations.',
    interests: ['Hiking', 'Wine', 'Travel', 'Yoga'], kinks: [], relationshipStatus: 'attached', lookingFor: ['discreet', 'ongoing'],
    verificationStatus: { emailVerified: true, phoneVerified: true, photoVerified: true, idVerified: false, trustScore: 85 },
    subscriptionTier: 'premium', createdAt: new Date(), lastActive: new Date(),
    settings: { ageRange: [28, 45], maxDistance: 25, showOnline: true, showLastActive: true, notifications: { newMatches: true, messages: true, likes: true, promotions: false }, privacy: { showLocation: true, showKinks: true, showRelationshipStatus: true, incognitoMode: false } }
  },
  {
    id: '2', email: 'user2@test.com', username: 'jenny_ny', displayName: 'Jennifer', birthdate: '1990-08-22',
    gender: 'female', interestedIn: ['male', 'female'], location: { city: 'New York', state: 'NY', country: 'USA' },
    photos: [{ id: 'p2', url: 'https://images.unsplash.com/photo-1524504388940-b1c172266319?w=400', isPrimary: true, isVerified: true, uploadedAt: new Date() }],
    bio: 'Artist and dreamer. Looking for someone who appreciates creativity and spontaneity.',
    interests: ['Art', 'Music', 'Coffee', 'Photography'], kinks: [], relationshipStatus: 'single', lookingFor: ['casual', 'ongoing'],
    verificationStatus: { emailVerified: true, phoneVerified: true, photoVerified: false, idVerified: false, trustScore: 65 },
    subscriptionTier: 'free', createdAt: new Date(), lastActive: new Date(Date.now() - 86400000),
    settings: { ageRange: [25, 40], maxDistance: 50, showOnline: true, showLastActive: true, notifications: { newMatches: true, messages: true, likes: true, promotions: false }, privacy: { showLocation: true, showKinks: true, showRelationshipStatus: true, incognitoMode: false } }
  },
  {
    id: '3', email: 'user3@test.com', username: 'mike_chi', displayName: 'Michael', birthdate: '1988-03-10',
    gender: 'male', interestedIn: ['female'], location: { city: 'Chicago', state: 'IL', country: 'USA' },
    photos: [{ id: 'p3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', isPrimary: true, isVerified: true, uploadedAt: new Date() }],
    bio: 'Business professional by day, adventure seeker by night. Looking for chemistry and connection.',
    interests: ['Fitness', 'Travel', 'Cooking', 'Wine'], kinks: [], relationshipStatus: 'married', lookingFor: ['discreet'],
    verificationStatus: { emailVerified: true, phoneVerified: true, photoVerified: true, idVerified: true, trustScore: 92 },
    subscriptionTier: 'vip', createdAt: new Date(), lastActive: new Date(),
    settings: { ageRange: [25, 45], maxDistance: 100, showOnline: true, showLastActive: true, notifications: { newMatches: true, messages: true, likes: true, promotions: false }, privacy: { showLocation: true, showKinks: true, showRelationshipStatus: false, incognitoMode: false } }
  },
]

export default function DiscoverView() {
  const { potentialMatches, setPotentialMatches, removePotentialMatch, addMatch } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  
  // Use mock data if no potential matches
  const users = potentialMatches.length > 0 ? potentialMatches : mockUsers
  const currentUser = users[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    
    setTimeout(() => {
      if (direction === 'right' && currentUser) {
        // Create a match
        addMatch({
          id: Math.random().toString(36).substr(2, 9),
          users: ['me', currentUser.id],
          matchedAt: new Date(),
          compatibilityScore: 85 + Math.random() * 15
        })
      }
      
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
      
      setSwipeDirection(null)
    }, 300)
  }

  const handleSuperLike = () => {
    if (currentUser) {
      addMatch({
        id: Math.random().toString(36).substr(2, 9),
        users: ['me', currentUser.id],
        matchedAt: new Date(),
        compatibilityScore: 95
      })
    }
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No More Profiles</h3>
          <p className="text-gray-400">Check back later for new matches in your area</p>
        </div>
      </div>
    )
  }

  const age = new Date().getFullYear() - new Date(currentUser.birthdate).getFullYear()

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Card Stack */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: swipeDirection ? 0.9 : 1, 
              opacity: swipeDirection ? 0 : 1,
              x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-4 md:inset-8 max-w-md mx-auto w-full"
          >
            <div className="glass rounded-3xl overflow-hidden h-full flex flex-col">
              {/* Photo */}
              <div className="relative flex-1 min-h-[300px]">
                <img 
                  src={currentUser.photos[0]?.url || '/placeholder.jpg'} 
                  alt={currentUser.displayName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                
                {/* Trust Badge */}
                <div className="absolute top-4 right-4">
                  <div className={cn(
                    "px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium",
                    currentUser.verificationStatus.trustScore >= 80 ? "bg-green-500/20 text-green-400" :
                    currentUser.verificationStatus.trustScore >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    <Shield className="w-3 h-3" />
                    {currentUser.verificationStatus.trustScore}% Trust
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {currentUser.verificationStatus.photoVerified && (
                    <div className="p-1.5 rounded-full bg-primary-500/20" title="Photo Verified">
                      <CheckCircle className="w-4 h-4 text-primary-400" />
                    </div>
                  )}
                </div>
                
                {/* Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-white text-3xl font-bold">{currentUser.displayName}, {age}</h2>
                      <div className="flex items-center gap-2 text-gray-300 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{currentUser.location.city}</span>
                        {currentUser.relationshipStatus !== 'single' && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-xs">
                            {currentUser.relationshipStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDetails(!showDetails)}
                      className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <Info className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Panel */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      <p className="text-gray-300">{currentUser.bio}</p>
                      
                      {currentUser.interests.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Interests</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentUser.interests.map(interest => (
                              <span key={interest} className="px-3 py-1 rounded-full bg-dark-700 text-gray-300 text-sm">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-white font-medium mb-2">Looking For</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.lookingFor.map(type => (
                            <span key={type} className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm capitalize">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 p-6 pb-24 md:pb-6">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all group"
        >
          <X className="w-7 h-7 text-gray-400 group-hover:text-red-400 transition-colors" />
        </button>
        
        <button
          onClick={handleSuperLike}
          className="w-14 h-14 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/50 transition-all group"
        >
          <Star className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/50 transition-all group"
        >
          <Heart className="w-7 h-7 text-gray-400 group-hover:text-green-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}