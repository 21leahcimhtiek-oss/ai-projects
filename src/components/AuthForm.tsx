'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowRight, ArrowLeft, Shield } from 'lucide-react'
import { useStore } from '@/lib/store'
import { User as UserType } from '@/types'
import { generateId } from '@/lib/utils'

interface AuthFormProps {
  onBack: () => void
}

type AuthStep = 'choose' | 'login' | 'signup' | 'verify-email' | 'verify-phone' | 'create-profile'

export default function AuthForm({ onBack }: AuthFormProps) {
  const [step, setStep] = useState<AuthStep>('choose')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form data
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary' | 'other'>('female')
  const [interestedIn, setInterestedIn] = useState<('male' | 'female' | 'non-binary' | 'other')[]>(['male'])
  
  const { setUser } = useStore()

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    // Simulate login
    await new Promise(r => setTimeout(r, 1500))
    
    // Create mock user
    const mockUser: UserType = {
      id: generateId(),
      email,
      username: email.split('@')[0],
      displayName: email.split('@')[0],
      birthdate: '1995-01-01',
      gender: 'female',
      interestedIn: ['male'],
      location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
      photos: [],
      bio: '',
      interests: [],
      kinks: [],
      relationshipStatus: 'single',
      lookingFor: ['casual', 'discreet'],
      verificationStatus: { emailVerified: true, phoneVerified: false, photoVerified: false, idVerified: false, trustScore: 30 },
      subscriptionTier: 'free',
      createdAt: new Date(),
      lastActive: new Date(),
      settings: {
        ageRange: [25, 45],
        maxDistance: 50,
        showOnline: true,
        showLastActive: true,
        notifications: { newMatches: true, messages: true, likes: true, promotions: false },
        privacy: { showLocation: true, showKinks: true, showRelationshipStatus: true, incognitoMode: false }
      }
    }
    
    setUser(mockUser)
    setIsLoading(false)
  }

  const handleSignup = async () => {
    setIsLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1500))
    setStep('verify-email')
    setIsLoading(false)
  }

  const handleVerifyEmail = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setStep('verify-phone')
    setIsLoading(false)
  }

  const handleVerifyPhone = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setStep('create-profile')
    setIsLoading(false)
  }

  const handleCreateProfile = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    
    const mockUser: UserType = {
      id: generateId(),
      email,
      username,
      displayName,
      birthdate,
      gender,
      interestedIn,
      location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
      photos: [],
      bio: '',
      interests: [],
      kinks: [],
      relationshipStatus: 'single',
      lookingFor: ['casual', 'discreet'],
      verificationStatus: { emailVerified: true, phoneVerified: true, photoVerified: false, idVerified: false, trustScore: 45 },
      subscriptionTier: 'free',
      createdAt: new Date(),
      lastActive: new Date(),
      settings: {
        ageRange: [25, 45],
        maxDistance: 50,
        showOnline: true,
        showLastActive: true,
        notifications: { newMatches: true, messages: true, likes: true, promotions: false },
        privacy: { showLocation: true, showKinks: true, showRelationshipStatus: true, incognitoMode: false }
      }
    }
    
    setUser(mockUser)
    setIsLoading(false)
  }

  const renderStep = () => {
    switch (step) {
      case 'choose':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button onClick={() => setStep('signup')} className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2">
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setStep('login')} className="w-full btn-secondary text-lg py-4">
              Sign In
            </button>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-400 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                Apple
              </button>
            </div>
          </motion.div>
        )

      case 'login':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button onClick={() => setStep('choose')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl font-display text-white font-bold mb-6">Welcome Back</h2>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input pl-12" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input pl-12 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button className="text-primary-400 text-sm hover:underline">Forgot password?</button>
              <button onClick={handleLogin} disabled={isLoading} className="w-full btn-primary py-4 disabled:opacity-50">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </motion.div>
        )

      case 'signup':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button onClick={() => setStep('choose')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl font-display text-white font-bold mb-2">Create Your Account</h2>
            <p className="text-gray-400 mb-6">Your privacy is protected. We never share your data.</p>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="input pl-12" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input pl-12" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 8 characters)" value={password} onChange={e => setPassword(e.target.value)} className="input pl-12 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <Shield className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">Your identity is protected. We use encryption and never sell your data to third parties.</p>
              </div>
              <button onClick={handleSignup} disabled={isLoading || !email || !password || !username} className="w-full btn-primary py-4 disabled:opacity-50">
                {isLoading ? 'Creating Account...' : 'Continue'}
              </button>
            </div>
          </motion.div>
        )

      case 'verify-email':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-2xl font-display text-white font-bold mb-2">Verify Your Email</h2>
            <p className="text-gray-400 mb-6">We sent a 6-digit code to <span className="text-white">{email}</span></p>
            <input type="text" placeholder="Enter 6-digit code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="input text-center text-2xl tracking-widest" maxLength={6} />
            <button onClick={handleVerifyEmail} disabled={isLoading || verificationCode.length !== 6} className="w-full btn-primary py-4 disabled:opacity-50">
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
            <button className="text-primary-400 text-sm hover:underline">Resend code</button>
          </motion.div>
        )

      case 'verify-phone':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-2xl font-display text-white font-bold mb-2">Verify Your Phone</h2>
            <p className="text-gray-400 mb-6">This helps us keep bots off the platform. Your number is never shared.</p>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} className="input pl-12" />
            </div>
            <input type="text" placeholder="Enter verification code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="input text-center text-xl tracking-widest" maxLength={6} />
            <button onClick={handleVerifyPhone} disabled={isLoading} className="w-full btn-primary py-4 disabled:opacity-50">
              {isLoading ? 'Verifying...' : 'Verify Phone'}
            </button>
          </motion.div>
        )

      case 'create-profile':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-2xl font-display text-white font-bold mb-2">Complete Your Profile</h2>
            <p className="text-gray-400 mb-6">Tell us a bit about yourself</p>
            <div className="space-y-4">
              <input type="text" placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input" />
              <div>
                <label className="block text-gray-400 text-sm mb-2">Date of Birth</label>
                <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="input" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">I am</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['female', 'male', 'non-binary', 'other'] as const).map(g => (
                    <button key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl border transition-all ${gender === g ? 'border-primary-500 bg-primary-500/20 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Interested in</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['female', 'male', 'non-binary', 'other'] as const).map(g => (
                    <button key={g} onClick={() => setInterestedIn(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])} className={`py-3 rounded-xl border transition-all ${interestedIn.includes(g) ? 'border-primary-500 bg-primary-500/20 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleCreateProfile} disabled={isLoading || !displayName || !birthdate} className="w-full btn-primary py-4 disabled:opacity-50">
                {isLoading ? 'Creating Profile...' : 'Start Matching'}
              </button>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
        <div className="glass rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}