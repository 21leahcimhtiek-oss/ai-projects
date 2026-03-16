'use client'

import { useStore } from '@/lib/store'
import { Heart, MessageCircle, User, Settings, Compass, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'discover', icon: Compass, label: 'Discover' },
  { id: 'matches', icon: Heart, label: 'Matches' },
  { id: 'messages', icon: MessageCircle, label: 'Messages' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
] as const

export default function Navigation() {
  const { currentView, setCurrentView, logout, user } = useStore()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      <div className="glass-dark border-t md:border-t-0 md:border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="font-display text-2xl gradient-text font-semibold">Velvet</span>
            </div>
            
            {/* Nav Items */}
            <div className="flex items-center justify-around w-full md:w-auto md:gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={cn(
                    'flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all duration-300',
                    currentView === item.id
                      ? 'text-primary-400 md:bg-primary-500/20'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* User Menu - hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden">
                  {user?.photos.find(p => p.isPrimary)?.url ? (
                    <img 
                      src={user.photos.find(p => p.isPrimary)?.url} 
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {user?.displayName?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-white font-medium text-sm">{user?.displayName}</p>
                  <p className="text-gray-400 text-xs">{user?.subscriptionTier || 'Free'} Member</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}