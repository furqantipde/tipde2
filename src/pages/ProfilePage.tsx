import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, Calendar, Shield, Heart, LogOut, Edit3, CheckCircle2, Camera, X, Save } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'

const PROFILE_DATA_KEY = 'tipde_profile_data'

interface ProfileData {
  displayName?: string
  avatar?: string
  banner?: string
}

function getProfileData(): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_DATA_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProfileData(data: ProfileData) {
  try {
    const existing = getProfileData()
    localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify({ ...existing, ...data }))
  } catch (e) {
    console.error('Failed to save profile data', e)
  }
}

function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [savedCount, setSavedCount] = useState(0)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [profileData, setProfileData] = useState<ProfileData>({})
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'My Profile — TipdeHub'
    try {
      const saved = JSON.parse(localStorage.getItem('tipde_saved_tools') || '[]')
      setSavedCount(saved.length)
    } catch {
      setSavedCount(0)
    }
    setProfileData(getProfileData())
  }, [])

  if (!user) return null

  const customName = profileData.displayName
  const displayName = customName || user.displayName || 'User'
  const email = user.email || ''
  const phone = user.phoneNumber || ''
  const avatar = profileData.avatar || user.photoURL || ''
  const banner = profileData.banner || ''
  const initial = displayName.charAt(0).toUpperCase() || email.charAt(0).toUpperCase() || phone.slice(-1) || '?'
  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently'

  const authProviders = user.providerData.map((p) => p.providerId)
  const isGoogleUser = authProviders.includes('google.com')
  const isEmailUser = authProviders.includes('password')
  const isPhoneUser = authProviders.includes('phone')

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB')
      return
    }
    try {
      const base64 = await imageToBase64(file)
      const data = { avatar: base64 }
      saveProfileData(data)
      setProfileData(prev => ({ ...prev, ...data }))
    } catch (err) {
      console.error('Failed to upload avatar:', err)
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      alert('Banner image must be under 3MB')
      return
    }
    try {
      const base64 = await imageToBase64(file)
      const data = { banner: base64 }
      saveProfileData(data)
      setProfileData(prev => ({ ...prev, ...data }))
    } catch (err) {
      console.error('Failed to upload banner:', err)
    }
  }

  const handleSaveName = () => {
    if (nameInput.trim()) {
      const data = { displayName: nameInput.trim() }
      saveProfileData(data)
      setProfileData(prev => ({ ...prev, ...data }))
    }
    setEditingName(false)
  }

  const handleStartEditName = () => {
    setNameInput(displayName)
    setEditingName(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerChange}
      />

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 relative overflow-hidden">
          {banner ? (
            <img src={banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700" />
          )}
          {/* Change banner button */}
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
            title="Change banner"
          >
            <Camera className="w-4 h-4" />
          </button>
          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative group">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-primary-600 text-white text-3xl font-bold flex items-center justify-center shadow-md">
                  {initial}
                </div>
              )}
              {/* Change avatar button */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors cursor-pointer"
                title="Change profile picture"
              >
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="pt-16 pb-6 px-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-primary-500 outline-none px-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName()
                        if (e.key === 'Escape') setEditingName(false)
                      }}
                    />
                    <button onClick={handleSaveName} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <Save className="w-4 h-4 text-green-500" />
                    </button>
                    <button onClick={() => setEditingName(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
                    <button
                      onClick={handleStartEditName}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      title="Edit name"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    {user.emailVerified && (
                      <CheckCircle2 className="w-5 h-5 text-primary-500" />
                    )}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Member since {joinDate}
              </p>
            </div>
            <Link
              to="/saved"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500" />
              {savedCount} Saved
            </Link>
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="mt-6 space-y-4">
        {/* Account Information */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
              </div>
              <button
                onClick={handleStartEditName}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                title="Edit name"
              >
                <Edit3 className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{email}</p>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign-in Methods */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            Sign-in Methods
          </h2>
          <div className="space-y-3">
            {isGoogleUser && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Google</span>
                <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}

            {isEmailUser && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Email & Password</span>
                <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}

            {isPhoneUser && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone Number</span>
                <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/saved"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500" />
              Saved Tools
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-primary-500" />
              Browse Tools
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <Button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
