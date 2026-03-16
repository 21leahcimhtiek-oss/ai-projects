'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Bell, Lock, Eye, Heart, HelpCircle, LogOut, ChevronRight, 
  Shield, Smartphone, Camera, CreditCard, Trash2, Moon, Globe, Check, Zap, Mail
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/lib/subscription-context'
import PricingModal from './PricingModal'
import PremiumBadge from './PremiumBadge'
import { isAdmin } from '@/lib/admin-config'

type SettingsSection = 'main' | 'account' | 'privacy' | 'notifications' | 'preferences' | 'verification' | 'subscription' | 'help'

export default function SettingsView() {
  const { user, logout, setCurrentView } = useStore()
  const { tier, upgradeToPlan, openBillingPortal, isLoading: subscriptionLoading, isAdminUser } = useSubscription()
  const [section, setSection] = useState<SettingsSection>('main')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'vip'>('premium')
  const [settings, setSettings] = useState({
    notifications: {
      newMatches: true,
      messages: true,
      likes: true,
      promotions: false
    },
    privacy: {
      showOnline: true,
      showLocation: true,
      showLastActive: false,
      incognitoMode: false
    },
    preferences: {
      ageRange: [25, 45] as [number, number],
      maxDistance: 50,
      showMe: 'everyone' as 'everyone' | 'verified' | 'premium'
    }
  })

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
  }

  const togglePrivacy = (key: keyof typeof settings.privacy) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }))
  }

  const menuItems = [
    { id: 'account', icon: User, label: 'Account Settings', description: 'Email, password, delete account' },
    { id: 'privacy', icon: Lock, label: 'Privacy & Safety', description: 'Control who can see your profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Manage push notifications' },
    { id: 'preferences', icon: Heart, label: 'Match Preferences', description: 'Age range, distance, filters' },
    { id: 'verification', icon: Shield, label: 'Verification', description: 'Increase your trust score' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription', description: 'Manage your plan' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'FAQ, contact support' },
  ]

  const renderMain = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden">
            {user?.photos?.find(p => p.isPrimary)?.url ? (
              <img src={user.photos.find(p => p.isPrimary)?.url} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-2xl">{user?.displayName?.charAt(0) || '?'}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">{user?.displayName || 'Guest User'}</h2>
            <p className="text-gray-400 text-sm">{user?.email || 'Not signed in'}</p>
          </div>
          <button onClick={() => setCurrentView('profile')} className="p-2 text-gray-400 hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map(item => (
          <motion.button
            key={item.id}
            onClick={() => setSection(item.id as SettingsSection)}
            className="w-full glass rounded-xl p-4 flex items-center gap-4 hover:border-primary-500/30 transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-white font-medium">{item.label}</h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full glass rounded-xl p-4 flex items-center gap-4 text-red-400 hover:border-red-500/30 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <LogOut className="w-5 h-5" />
        </div>
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  )

  const renderAccount = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Account Settings</h2>
      
      <div className="glass rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Email</label>
          <input type="email" value={user?.email || ''} readOnly className="input bg-dark-800" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Username</label>
          <input type="text" value={user?.username || ''} readOnly className="input bg-dark-800" />
        </div>
        <button className="btn-secondary w-full">Change Password</button>
      </div>

      <div className="glass rounded-xl p-4 border border-red-500/20">
        <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
        <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
        <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )

  const renderPrivacy = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Privacy & Safety</h2>

      <div className="glass rounded-xl p-4 space-y-4">
        <h3 className="text-white font-medium">Visibility</h3>
        
        {[
          { key: 'showOnline', label: 'Show Online Status', description: 'Let others see when you\'re online' },
          { key: 'showLocation', label: 'Show Location', description: 'Display your city on your profile' },
          { key: 'showLastActive', label: 'Show Last Active', description: 'Show when you were last online' },
          { key: 'incognitoMode', label: 'Incognito Mode', description: 'Browse profiles without being seen', premium: true },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-white">{item.label} {item.premium && <span className="text-xs text-primary-400">(Premium)</span>}</p>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            <button
              onClick={() => togglePrivacy(item.key as keyof typeof settings.privacy)}
              className={cn(
                'w-12 h-7 rounded-full transition-colors relative',
                settings.privacy[item.key as keyof typeof settings.privacy] ? 'bg-primary-500' : 'bg-dark-700'
              )}
            >
              <div className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                settings.privacy[item.key as keyof typeof settings.privacy] ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 space-y-4">
        <h3 className="text-white font-medium">Blocked Users</h3>
        <p className="text-gray-400 text-sm">You haven\'t blocked anyone yet.</p>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Notifications</h2>

      <div className="glass rounded-xl p-4 space-y-4">
        {[
          { key: 'newMatches', label: 'New Matches', description: 'When you get a new match' },
          { key: 'messages', label: 'Messages', description: 'When you receive a new message' },
          { key: 'likes', label: 'Likes', description: 'When someone likes your profile' },
          { key: 'promotions', label: 'Promotions', description: 'Special offers and updates' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-white">{item.label}</p>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            <button
              onClick={() => toggleNotification(item.key as keyof typeof settings.notifications)}
              className={cn(
                'w-12 h-7 rounded-full transition-colors relative',
                settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-primary-500' : 'bg-dark-700'
              )}
            >
              <div className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Match Preferences</h2>

      <div className="glass rounded-xl p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white">Age Range</label>
            <span className="text-primary-400">{settings.preferences.ageRange[0]} - {settings.preferences.ageRange[1]}</span>
          </div>
          <input type="range" min="18" max="70" value={settings.preferences.ageRange[0]} 
            onChange={e => setSettings(prev => ({...prev, preferences: {...prev.preferences, ageRange: [parseInt(e.target.value), prev.preferences.ageRange[1]]}}))}
            className="w-full accent-primary-500" />
          <input type="range" min="18" max="70" value={settings.preferences.ageRange[1]} 
            onChange={e => setSettings(prev => ({...prev, preferences: {...prev.preferences, ageRange: [prev.preferences.ageRange[0], parseInt(e.target.value)]}}))}
            className="w-full accent-primary-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white">Maximum Distance</label>
            <span className="text-primary-400">{settings.preferences.maxDistance} miles</span>
          </div>
          <input type="range" min="1" max="500" value={settings.preferences.maxDistance}
            onChange={e => setSettings(prev => ({...prev, preferences: {...prev.preferences, maxDistance: parseInt(e.target.value)}}))}
            className="w-full accent-primary-500" />
        </div>

        <div>
          <label className="text-white mb-2 block">Show Me</label>
          <div className="grid grid-cols-3 gap-2">
            {['everyone', 'verified', 'premium'].map(option => (
              <button
                key={option}
                onClick={() => setSettings(prev => ({...prev, preferences: {...prev.preferences, showMe: option as any}}))}
                className={cn(
                  'py-2 rounded-xl border text-sm capitalize transition-all',
                  settings.preferences.showMe === option
                    ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderVerification = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Verification</h2>

      <div className="glass rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-primary-400" />
          <div>
            <h3 className="text-white font-medium">Trust Score: {user?.verificationStatus?.trustScore || 45}%</h3>
            <p className="text-gray-400 text-sm">Complete verifications to increase your score</p>
          </div>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all" style={{ width: `${user?.verificationStatus?.trustScore || 45}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: Mail, label: 'Email Verification', done: user?.verificationStatus?.emailVerified ?? true, description: 'Verify your email address' },
          { icon: Smartphone, label: 'Phone Verification', done: user?.verificationStatus?.phoneVerified ?? true, description: 'Add and verify your phone number' },
          { icon: Camera, label: 'Photo Verification', done: user?.verificationStatus?.photoVerified ?? false, description: 'Take a selfie to verify your photos' },
          { icon: User, label: 'ID Verification', done: user?.verificationStatus?.idVerified ?? false, description: 'Verify your identity (optional)', premium: true },
        ].map(item => (
          <div key={item.label} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              item.done ? 'bg-green-500/20' : 'bg-dark-800'
            )}>
              <item.icon className={cn('w-5 h-5', item.done ? 'text-green-400' : 'text-gray-400')} />
            </div>
            <div className="flex-1">
              <p className="text-white flex items-center gap-2">
                {item.label}
                {item.premium && <span className="text-xs text-primary-400">(Premium)</span>}
              </p>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            {item.done ? (
              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">Verified</div>
            ) : (
              <button className="btn-secondary px-4 py-1 text-sm">Verify</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const handleUpgrade = async (plan: 'premium' | 'vip') => {
    setSelectedPlan(plan)
    setShowPricingModal(true)
  }

  const handleManageSubscription = async () => {
    if (tier !== 'free') {
      await openBillingPortal()
    }
  }

  const renderSubscription = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Subscription</h2>

      {/* Current Plan Banner */}
      <div className="glass rounded-xl p-6 mb-6 border border-primary-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tier !== 'free' && <PremiumBadge tier={tier} />}
            <div>
              <h3 className="text-white font-semibold">Current Plan: <span className="capitalize">{tier}</span></h3>
              {isAdminUser && <p className="text-amber-400 text-sm font-medium">👑 Admin - Full VIP Access</p>}
              {tier === 'free' && !isAdminUser && <p className="text-gray-400 text-sm">Upgrade to unlock premium features</p>}
            </div>
          </div>
          {tier !== 'free' && !isAdminUser && (
            <button 
              onClick={handleManageSubscription}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              Manage →
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {[
          { 
            tier: 'free' as const, 
            price: '$0', 
            features: ['5 likes per day', 'Basic matching', 'Limited messages'], 
            current: tier === 'free' 
          },
          { 
            tier: 'premium' as const, 
            price: '$29.99', 
            period: '/month', 
            features: ['Unlimited likes', 'See who likes you', 'Advanced filters', 'Read receipts', 'Priority in discovery'], 
            current: tier === 'premium', 
            popular: true 
          },
          { 
            tier: 'vip' as const, 
            price: '$79.99', 
            period: '/month', 
            features: ['All Premium features', 'Incognito mode', 'VIP verified badge', 'Monthly profile boost', 'See who viewed you', 'Exclusive access'], 
            current: tier === 'vip' 
          },
        ].map(plan => (
          <motion.div 
            key={plan.tier} 
            className={cn(
              'glass rounded-xl p-6 relative cursor-pointer',
              plan.popular && 'border-primary-500/50',
              plan.current && 'ring-2 ring-primary-500'
            )}
            whileHover={{ scale: 1.01 }}
            onClick={() => !plan.current && plan.tier !== 'free' && handleUpgrade(plan.tier)}
          >
            {plan.popular && !plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium">
                Most Popular
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Current
              </div>
            )}
            <div className="flex items-center justify-between mb-4 mt-2">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-lg capitalize">{plan.tier}</h3>
                {plan.tier === 'vip' && <Zap className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-400">{plan.period}</span>}
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {plan.features.map(feature => (
                <li key={feature} className="text-gray-300 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className={cn(
                'w-full py-3 rounded-xl font-medium transition-all',
                plan.current 
                  ? 'bg-green-500/20 text-green-400 cursor-default' 
                  : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90'
              )}
              onClick={(e) => {
                e.stopPropagation()
                if (!plan.current && plan.tier !== 'free') {
                  handleUpgrade(plan.tier)
                }
              }}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Payment Methods */}
      {tier !== 'free' && (
        <div className="glass rounded-xl p-4 mt-6">
          <h3 className="text-white font-medium mb-4">Payment Method</h3>
          <button 
            onClick={handleManageSubscription}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">Manage payment methods</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)}
        preselectedPlan={selectedPlan}
      />
    </div>
  )

  const renderHelp = () => (
    <div className="space-y-4">
      <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        ← Back to Settings
      </button>
      <h2 className="text-2xl font-display text-white font-bold mb-6">Help & Support</h2>

      <div className="space-y-3">
        {[
          { label: 'FAQ', description: 'Frequently asked questions' },
          { label: 'Safety Tips', description: 'How to stay safe on Velvet' },
          { label: 'Community Guidelines', description: 'Our rules and policies' },
          { label: 'Contact Support', description: 'Get help from our team' },
          { label: 'Report a Problem', description: 'Let us know about issues' },
        ].map(item => (
          <button key={item.label} className="w-full glass rounded-xl p-4 flex items-center justify-between hover:border-primary-500/30 transition-all">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 md:pb-6">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {section === 'main' && renderMain()}
            {section === 'account' && renderAccount()}
            {section === 'privacy' && renderPrivacy()}
            {section === 'notifications' && renderNotifications()}
            {section === 'preferences' && renderPreferences()}
            {section === 'verification' && renderVerification()}
            {section === 'subscription' && renderSubscription()}
            {section === 'help' && renderHelp()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}