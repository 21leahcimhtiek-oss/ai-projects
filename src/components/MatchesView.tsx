'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Star, Crown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Match } from '@/types'

export default function MatchesView() {
  const { matches, setCurrentView, setSelectedMatch } = useStore()
  const [filter, setFilter] = useState<'all' | 'new' | 'messages'>('all')

  // Mock matches for demo
  const mockMatches: Match[] = [
    { id: 'm1', users: ['current-user', 'u1'], compatibilityScore: 85, matchedAt: new Date(), lastMessage: { id: 'msg1', matchId: 'm1', senderId: 'u1', content: 'Hey! How are you?', type: 'text', isRead: false, createdAt: new Date(), flagged: false } },
    { id: 'm2', users: ['current-user', 'u2'], compatibilityScore: 78, matchedAt: new Date(Date.now() - 86400000) },
    { id: 'm3', users: ['current-user', 'u3'], compatibilityScore: 92, matchedAt: new Date(Date.now() - 172800000), lastMessage: { id: 'msg2', matchId: 'm3', senderId: 'u3', content: 'Nice to meet you!', type: 'text', isRead: true, createdAt: new Date(Date.now() - 3600000), flagged: false } },
  ]

  // Mock user data for display
  const mockUsers: Record<string, { displayName: string; photos: { url: string }[] }> = {
    'u1': { displayName: 'Sarah', photos: [{ url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }] },
    'u2': { displayName: 'Jennifer', photos: [{ url: 'https://images.unsplash.com/photo-1524504388940-b1c172266319?w=200' }] },
    'u3': { displayName: 'Michael', photos: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }] },
  }

  const displayMatches = matches.length > 0 ? matches : mockMatches

  const newMatches = displayMatches.filter(m => !m.lastMessage)
  const messageMatches = displayMatches.filter(m => m.lastMessage)

  const handleOpenChat = (matchId: string) => {
    const match = displayMatches.find(m => m.id === matchId)
    setSelectedMatch(match || null)
    setCurrentView('messages')
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display text-white font-bold">Matches</h1>
          <div className="flex gap-2">
            {(['all', 'new', 'messages'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  filter === f ? 'bg-primary-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* New Matches (Likes You) */}
        {(filter === 'all' || filter === 'new') && newMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-400" />
              New Matches
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {newMatches.map((match, index) => {
                const otherUserId = match.users.find(id => id !== 'current-user') || match.users[0]
                const userData = mockUsers[otherUserId]
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => handleOpenChat(match.id)}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <img
                        src={userData?.photos?.[0]?.url || '/placeholder.jpg'}
                        alt={userData?.displayName || 'User'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-white text-sm font-medium mt-2 text-center truncate">
                      {userData?.displayName || 'User'}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Messages */}
        {(filter === 'all' || filter === 'messages') && messageMatches.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-400" />
              Messages
            </h2>
            <div className="space-y-3">
              {messageMatches.map((match, index) => {
                const otherUserId = match.users.find(id => id !== 'current-user') || match.users[0]
                const userData = mockUsers[otherUserId]
                return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleOpenChat(match.id)}
                  className="glass rounded-2xl p-4 cursor-pointer hover:border-primary-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={userData?.photos?.[0]?.url || '/placeholder.jpg'}
                        alt={userData?.displayName || 'User'}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {!match.lastMessage?.isRead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 border-2 border-dark-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">{userData?.displayName || 'User'}</h3>
                        <span className="text-gray-500 text-xs">
                          {match.lastMessage?.createdAt ? new Date(match.lastMessage.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className={cn(
                        'text-sm truncate',
                        match.lastMessage?.isRead ? 'text-gray-400' : 'text-white font-medium'
                      )}>
                        {match.lastMessage?.content || 'Start a conversation!'}
                      </p>
                    </div>
                  </div>
                </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {displayMatches.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No Matches Yet</h3>
            <p className="text-gray-400 mb-6">Start swiping to find your perfect match</p>
            <button
              onClick={() => setCurrentView('discover')}
              className="btn-primary"
            >
              Start Discovering
            </button>
          </div>
        )}
      </div>
    </div>
  )
}