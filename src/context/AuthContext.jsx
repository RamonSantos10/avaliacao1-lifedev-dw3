"use client"

import { useContext, createContext, useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="load">
        <p>Carregando...</p>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export function useAuthValue() {
  return useContext(AuthContext)
}
