'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import Navigation from '@/components/Navigation'
import LandingPage from '@/components/LandingPage'
import AuthForm from '@/components/AuthForm'
import DiscoverView from '@/components/DiscoverView'
import MatchesView from '@/components/MatchesView'
import MessagesView from '@/components/MessagesView'
import ProfileView from '@/components/ProfileView'
import SettingsView from '@/components/SettingsView'

type AppView = 'landing' | 'auth' | 'main'

export default function Home() {
  const { isAuthenticated, currentView } = useStore()
  const [appView, setAppView] = useState<AppView>('landing')

  // Show landing page if not authenticated
  if (appView === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setAppView('auth')}
        onLogin={() => setAppView('auth')}
      />
    )
  }

  // Show auth form if not authenticated
  if (appView === 'auth' && !isAuthenticated) {
    return (
      <AuthForm onBack={() => setAppView('landing')} />
    )
  }

  // Main app view
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 md:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentView === 'discover' && <DiscoverView />}
            {currentView === 'matches' && <MatchesView />}
            {currentView === 'messages' && <MessagesView />}
            {currentView === 'profile' && <ProfileView />}
            {currentView === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}