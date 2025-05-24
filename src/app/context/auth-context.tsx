"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

type User = {
  id: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

const fetchUser = async () => {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include", // important pour que le cookie soit envoyé
    })
    const data = await res.json()
    setUser(data.user || null)
  } catch (error) {
    console.error("Erreur récupération user:", error)
    setUser(null)
  }
}

  useEffect(() => {
    fetchUser()
  }, [])

   const logout =async() => {
    try {
      const res = await fetch("/api/auth/logout", {
        method:"POST",
        credentials: "include", // important pour que le cookie soit envoyé
      })
      console.info(res)
     if(res.ok){
      toast.success("Déconnexion réussite !")
    
      return  setUser(null)
     }else{
      toast.error("Déconnexion échoué !")
     }
     
    } catch (error) {
      console.log("Erreur récupération user:", error)
      
    }
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
