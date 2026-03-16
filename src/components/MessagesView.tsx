'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, MoreVertical, Shield, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Message } from '@/types'
import { generateId } from '@/lib/utils'
import { moderateMessage } from '@/lib/ai-moderation'
import { cn } from '@/lib/utils'

export default function MessagesView() {
  const { selectedMatch, matches, messages, addMessage, setCurrentView, setSelectedMatch, user } = useStore()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get the match to display
  const activeMatch = selectedMatch || (matches.length > 0 ? matches[0] : null)
  const matchMessages = activeMatch ? messages[activeMatch.id] || [] : []

  // Get other user ID from match
  const getOtherUserId = (match: typeof activeMatch) => {
    if (!match) return 'u1'
    return match.users.find(id => id !== user?.id) || match.users[0] || 'u1'
  }

  // Mock user data for display
  const mockMatchUsers: Record<string, { displayName: string; photos: { url: string }[] }> = {
    'u1': { displayName: 'Sarah', photos: [{ url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }] },
    'u2': { displayName: 'Jennifer', photos: [{ url: 'https://images.unsplash.com/photo-1524504388940-b1c172266319?w=200' }] },
    'u3': { displayName: 'Michael', photos: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }] },
  }

  const otherUserId = getOtherUserId(activeMatch)
  const otherUserData = mockMatchUsers[otherUserId]

  // Mock messages for demo
  const mockMessages: Message[] = matchMessages.length > 0 ? matchMessages : [
    { id: 'm1', matchId: activeMatch?.id || '', senderId: otherUserId, content: 'Hey there! Nice to match with you 😊', type: 'text', isRead: true, createdAt: new Date(Date.now() - 3600000), flagged: false },
    { id: 'm2', matchId: activeMatch?.id || '', senderId: 'me', content: 'Hi! Likewise, how are you?', type: 'text', isRead: true, createdAt: new Date(Date.now() - 3500000), flagged: false },
    { id: 'm3', matchId: activeMatch?.id || '', senderId: otherUserId, content: "I'm doing great! Just got back from a hike. What do you like to do for fun?", type: 'text', isRead: true, createdAt: new Date(Date.now() - 3400000), flagged: false },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mockMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeMatch) return

    // Run AI moderation
    const moderationResult = moderateMessage(newMessage, mockMessages.map(m => m.content))
    
    if (moderationResult.recommendation === 'reject') {
      setShowWarning(true)
      setWarningMessage(`Your message was blocked: ${moderationResult.reasons.join(', ')}`)
      return
    }

    if (moderationResult.recommendation === 'review') {
      setShowWarning(true)
      setWarningMessage(`Your message may violate our guidelines. Please be respectful.`)
    }

    const message: Message = {
      id: generateId(),
      matchId: activeMatch.id,
      senderId: 'me',
      content: newMessage,
      type: 'text',
      isRead: true,
      createdAt: new Date(),
      flagged: moderationResult.flags.length > 0
    }

    addMessage(activeMatch.id, message)
    setNewMessage('')
    
    // Simulate response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: Message = {
        id: generateId(),
        matchId: activeMatch.id,
        senderId: otherUserId,
        content: getRandomResponse(),
        type: 'text',
        isRead: false,
        createdAt: new Date(),
        flagged: false
      }
      addMessage(activeMatch.id, response)
    }, 1500 + Math.random() * 2000)
  }

  const getRandomResponse = () => {
    const responses = [
      "That sounds great! Tell me more 😊",
      "I'd love to hear more about that!",
      "Interesting! What made you think of that?",
      "Haha, you're funny! 😄",
      "I feel the same way actually!",
      "That's really cool. We should talk more about this."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleBack = () => {
    setSelectedMatch(null)
    setCurrentView('matches')
  }

  if (!activeMatch) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2">No Conversation Selected</h3>
          <p className="text-gray-400 mb-6">Choose a match to start chatting</p>
          <button onClick={() => setCurrentView('matches')} className="btn-primary">
            View Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <button onClick={handleBack} className="md:hidden p-2 text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img
              src={otherUserData?.photos?.[0]?.url || '/placeholder.jpg'}
              alt={otherUserData?.displayName || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-dark-900" />
          </div>
          <div>
            <h2 className="text-white font-semibold">{otherUserData?.displayName || 'User'}</h2>
            <p className="text-gray-400 text-xs">Active now</p>
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {/* AI Moderation Notice */}
        <div className="flex justify-center">
          <div className="px-4 py-2 rounded-full bg-dark-800 flex items-center gap-2 text-xs text-gray-400">
            <Shield className="w-3 h-3 text-primary-400" />
            Messages are protected by AI moderation
          </div>
        </div>

        <AnimatePresence>
          {mockMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex',
                message.senderId === 'me' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                'max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-2xl',
                message.senderId === 'me'
                  ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-br-sm'
                  : 'glass text-white rounded-bl-sm',
                message.flagged && 'border border-yellow-500/50'
              )}>
                <p>{message.content}</p>
                <p className={cn(
                  'text-xs mt-1',
                  message.senderId === 'me' ? 'text-white/70' : 'text-gray-400'
                )}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Warning Toast */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-24 left-4 right-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/50 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-200 text-sm">{warningMessage}</p>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-yellow-500 hover:text-yellow-300">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="glass-dark border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-white">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 input py-2.5"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}