'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Shield, CheckCircle, MapPin, Heart, Settings, Crown, Plus, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const INTERESTS_OPTIONS = [
  'Travel', 'Music', 'Art', 'Fitness', 'Cooking', 'Wine', 'Photography', 'Hiking',
  'Yoga', 'Reading', 'Movies', 'Dancing', 'Gaming', 'Fashion', 'Nature', 'Sports'
]

const LOOKING_FOR_OPTIONS = [
  { value: 'casual', label: 'Casual Fun' },
  { value: 'discreet', label: 'Discreet Connection' },
  { value: 'ongoing', label: 'Ongoing Arrangement' },
  { value: 'online', label: 'Online/Virtual' }
]

const KINKS_OPTIONS = [
  { name: 'BDSM', category: 'bdsm' },
  { name: 'Role Play', category: 'roleplay' },
  { name: 'Sensory Play', category: 'sensory' },
  { name: 'Power Exchange', category: 'power' },
  { name: 'Voyeurism', category: 'voyeurism' },
  { name: 'Group Play', category: 'group' },
]

export default function ProfileView() {
  const { user, setUser } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    lookingFor: user?.lookingFor || ['casual', 'discreet'],
    kinks: user?.kinks || []
  })

  // Mock user data for display
  const displayUser = user || {
    id: 'mock',
    displayName: 'Demo User',
    birthdate: '1995-06-15',
    gender: 'female',
    location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', isPrimary: true, isVerified: true },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1517841905240-476988535085?w=400', isPrimary: false, isVerified: false },
    ],
    bio: 'Adventurous and looking for genuine connections. Love to explore new experiences and meet interesting people.',
    interests: ['Travel', 'Wine', 'Yoga', 'Photography'],
    lookingFor: ['casual', 'discreet'],
    kinks: [],
    verificationStatus: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: false,
      idVerified: false,
      trustScore: 65
    },
    subscriptionTier: 'free'
  }

  const age = new Date().getFullYear() - new Date(displayUser.birthdate).getFullYear()

  const handleSave = () => {
    // In production, this would save to backend
    setIsEditing(false)
  }

  const toggleInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const toggleLookingFor = (value: string) => {
    setEditData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value as any)
        ? prev.lookingFor.filter(l => l !== value)
        : [...prev.lookingFor, value as any]
    }))
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 md:pb-6">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display text-white font-bold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Photos Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Photos</h2>
          <div className="grid grid-cols-3 gap-3">
            {displayUser.photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="aspect-[3/4] rounded-2xl overflow-hidden relative group"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {photo.isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary-500 text-white text-xs font-medium">
                    Primary
                  </div>
                )}
                {photo.isVerified && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-dark-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-full bg-white/10 text-white">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
            {/* Add Photo Button */}
            {displayUser.photos.length < 6 && isEditing && (
              <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-400 text-sm">Add Photo</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.displayName}
                  onChange={e => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/20 focus:border-primary-500 outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{displayUser.displayName}, {age}</h2>
              )}
              <div className="flex items-center gap-2 text-gray-400 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{displayUser.location.city}, {displayUser.location.state}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium",
                displayUser.verificationStatus.trustScore >= 80 ? "bg-green-500/20 text-green-400" :
                displayUser.verificationStatus.trustScore >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              )}>
                {displayUser.verificationStatus.trustScore}% Trust Score
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about yourself..."
                className="w-full p-3 rounded-xl bg-dark-800 text-white border border-white/10 focus:border-primary-500 outline-none resize-none h-24"
              />
            ) : (
              <p className="text-gray-300">{displayUser.bio || 'No bio yet...'}</p>
            )}
          </div>

          {/* Verification Status */}
          <div className="flex flex-wrap gap-2">
            {displayUser.verificationStatus.emailVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3" />
                Email Verified
              </div>
            )}
            {displayUser.verificationStatus.phoneVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3" />
                Phone Verified
              </div>
            )}
            {displayUser.verificationStatus.photoVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3" />
                Photo Verified
              </div>
            )}
          </div>
        </div>

        {/* Looking For */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-400" />
            Looking For
          </h3>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => isEditing && toggleLookingFor(option.value)}
                disabled={!isEditing}
                className={cn(
                  'px-4 py-2 rounded-xl transition-all',
                  (isEditing ? editData.lookingFor : displayUser.lookingFor).includes(option.value as any)
                    ? 'bg-primary-500/20 border border-primary-500 text-primary-300'
                    : 'bg-dark-800 border border-white/10 text-gray-400',
                  isEditing && 'cursor-pointer hover:border-primary-500/50'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_OPTIONS.map(interest => (
              <button
                key={interest}
                onClick={() => isEditing && toggleInterest(interest)}
                disabled={!isEditing}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-all',
                  (isEditing ? editData.interests : displayUser.interests).includes(interest)
                    ? 'bg-primary-500/20 border border-primary-500 text-primary-300'
                    : 'bg-dark-800 border border-white/10 text-gray-400',
                  isEditing && 'cursor-pointer hover:border-primary-500/50'
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {displayUser.subscriptionTier === 'free' ? 'Free Member' : 
                   displayUser.subscriptionTier === 'premium' ? 'Premium Member' : 'VIP Member'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {displayUser.subscriptionTier === 'free' ? 'Upgrade for unlimited matches' : 'Enjoy all premium features'}
                </p>
              </div>
            </div>
            {displayUser.subscriptionTier === 'free' && (
              <button className="btn-primary px-4 py-2">Upgrade</button>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 md:bottom-8 left-0 right-0 p-4 bg-dark-950/90 backdrop-blur-lg"
          >
            <button onClick={handleSave} className="w-full btn-primary py-4">
              Save Changes
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}