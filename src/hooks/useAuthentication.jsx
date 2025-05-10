"use client"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth } from "../firebase/config"
import { useState, useEffect } from "react"

export const useAuthentication = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [cancelled, setCancelled] = useState(false)
  const provider = new GoogleAuthProvider()

  const loginWithGoogle = async () => {
    checkIfIsCancelled()
    setLoading(true)
    setError(null)

    try {
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.log(error)
      setError("Erro ao fazer login com Google")
    } finally {
      setLoading(false)
    }
  }

  function checkIfIsCancelled() {
    if (cancelled) {
      return
    }
  }

  const createUser = async (data) => {
    checkIfIsCancelled()

    setLoading(true)
    setError(null)

    try {
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password)

      await updateProfile(user, {
        displayName: data.displayName,
      })

      return user
    } catch (error) {
      console.log(error.message)

      let systemErrorMessage

      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres."
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado."
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde."
      }

      setError(systemErrorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    checkIfIsCancelled()

    signOut(auth)
  }

  const login = async (data) => {
    checkIfIsCancelled()

    setLoading(true)
    setError(false)

    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password)
      return result.user
    } catch (error) {
      let systemErrorMessage

      if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Usuário não encontrado."
      } else if (error.message.includes("wrong-password")) {
        systemErrorMessage = "Senha incorreta."
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde."
      }

      setError(systemErrorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return {
    auth,
    createUser,
    error,
    logout,
    login,
    loading,
    loginWithGoogle,
  }
}
