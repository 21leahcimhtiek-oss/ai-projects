'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Heart, Lock, Eye, Bot, CheckCircle, ChevronRight, Star, Users } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const features = [
    { icon: Shield, title: 'AI-Powered Protection', description: 'Blocks 95% of bots and fake profiles before you see them' },
    { icon: Lock, title: 'Complete Discretion', description: 'End-to-end encrypted messages and private photo albums' },
    { icon: Bot, title: 'Smart Matching', description: 'AI learns your preferences to find compatible connections' },
    { icon: Eye, title: 'Verified Profiles', description: 'Multi-step verification ensures real people' },
  ]

  const trustFeatures = [
    'Phone verification required', 'Photo verification with selfie match', 'Behavioral analysis to detect bots',
    'Seller/spam pattern detection', 'Real-time content moderation', 'Report system with human review',
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-950 to-accent-900/20" />
          <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, delay: 4 }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <motion.div className="flex items-center justify-center gap-3 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-bold text-3xl">V</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl gradient-text font-bold">Velvet</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display text-white font-bold mb-6 leading-tight">
              Discreet Connections<br /><span className="gradient-text">Without the Drama</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              A safe, AI-moderated space for adults seeking meaningful, no-strings connections. Real people, real chemistry, complete privacy.
            </p>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <button onClick={onGetStarted} className="btn-primary text-lg px-10 py-4 flex items-center gap-2">
              Get Started Free <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={onLogin} className="btn-secondary text-lg px-10 py-4">Sign In</button>
          </motion.div>

          <motion.div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary-400" /><span>256-bit Encryption</span></div>
            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary-400" /><span>2M+ Verified Users</span></div>
            <div className="flex items-center gap-2"><Star className="w-5 h-5 text-primary-400" /><span>4.8★ Rating</span></div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-3xl md:text-4xl font-display text-white font-bold mb-4">
              Why Choose <span className="gradient-text">Velvet</span>?
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Built from the ground up with your safety and privacy in mind</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} className="card text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl md:text-4xl font-display text-white font-bold mb-6">
                Tired of <span className="gradient-text">Fake Profiles</span> & Bots?
              </h3>
              <p className="text-gray-400 text-lg mb-8">
                Our AI-powered moderation system works 24/7 to keep scammers, bots, and sellers off the platform.
              </p>
              <div className="space-y-4">
                {trustFeatures.map((feature, index) => (
                  <motion.div key={feature} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Moderation Stats</h4>
                    <p className="text-gray-400 text-sm">Last 30 days</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-gray-400">Bots Blocked</span><span className="text-white font-semibold">12,847</span></div>
                  <div className="w-full bg-dark-700 rounded-full h-2"><div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full w-[95%]" /></div>
                  <div className="flex justify-between items-center mt-4"><span className="text-gray-400">Sellers Removed</span><span className="text-white font-semibold">3,291</span></div>
                  <div className="w-full bg-dark-700 rounded-full h-2"><div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full w-[87%]" /></div>
                  <div className="flex justify-between items-center mt-4"><span className="text-gray-400">Fake Profiles Caught</span><span className="text-white font-semibold">8,542</span></div>
                  <div className="w-full bg-dark-700 rounded-full h-2"><div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full w-[92%]" /></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-3xl md:text-5xl font-display text-white font-bold mb-6">
              Ready for <span className="gradient-text">Real Connections</span>?
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join millions of verified members seeking discreet, meaningful connections.
            </p>
            <button onClick={onGetStarted} className="btn-primary text-lg px-12 py-4 flex items-center gap-2 mx-auto">
              Create Free Account <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Velvet. All rights reserved. | 18+ Only</p>
        </div>
      </footer>
    </div>
  )
}