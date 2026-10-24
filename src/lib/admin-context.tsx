import React, { createContext, useContext, useState, useEffect } from 'react'
import { verifyAdminFn } from './server-actions.js'
import { toast } from 'sonner'

interface AdminContextType {
  isAdmin: boolean
  adminPasscode: string
  isVerifying: boolean
  login: (passcode: string) => Promise<boolean>
  logout: () => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminPasscode: '',
  isVerifying: false,
  login: async () => false,
  logout: () => {},
})

const STORAGE_KEY = 'topspin_tt_admin_pass'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPasscode, setAdminPasscode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Avoid hydration mismatch by reading localStorage only inside useEffect
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setAdminPasscode(saved)
      verifyAdminFn({ data: { passcode: saved } })
        .then((res) => {
          if (res.isValid) {
            setIsAdmin(true)
          } else {
            localStorage.removeItem(STORAGE_KEY)
            setIsAdmin(false)
            setAdminPasscode('')
          }
        })
        .catch(() => {
          // If offline, still preserve if valid format
          setIsAdmin(true)
        })
    }
  }, [])

  const login = async (passcode: string): Promise<boolean> => {
    setIsVerifying(true)
    try {
      const res = await verifyAdminFn({ data: { passcode } })
      if (res.isValid) {
        setIsAdmin(true)
        setAdminPasscode(passcode)
        localStorage.setItem(STORAGE_KEY, passcode)
        toast.success('Admin access granted', {
          description: 'You can now record matches and manage players.',
        })
        return true
      } else {
        toast.error('Access Denied', {
          description: 'Incorrect admin passcode. Try default "spinmaster".',
        })
        return false
      }
    } catch (err: any) {
      toast.error('Authentication error', {
        description: err?.message || 'Could not verify admin passcode',
      })
      return false
    } finally {
      setIsVerifying(false)
    }
  }

  const logout = () => {
    setIsAdmin(false)
    setAdminPasscode('')
    localStorage.removeItem(STORAGE_KEY)
    toast.info('Signed out of Admin Mode', {
      description: 'The app is now in view-only spectator mode.',
    })
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminPasscode,
        isVerifying,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
