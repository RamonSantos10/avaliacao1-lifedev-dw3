"use client"

import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, query, orderBy, where, getDocs } from "firebase/firestore"

const useFetchDocuments = (collectionName, search = null, uid = null) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        let q

        // Criar a base da query
        if (uid) {
          // Buscar posts do usuário específico
          q = query(collection(db, collectionName), where("uid", "==", uid), orderBy("createdAt", "desc"))
        } else if (search) {
          // Buscar posts por tag
          q = query(
            collection(db, collectionName),
            where("tags", "array-contains", search),
            orderBy("createdAt", "desc"),
          )
        } else {
          // Buscar todos os posts
          q = query(collection(db, collectionName), orderBy("createdAt", "desc"))
        }

        // Usar getDocs em vez de onSnapshot para evitar problemas de permissão com listeners
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setDocuments(docs)
      } catch (error) {
        console.error("Erro ao buscar documentos:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [collectionName, search, uid])

  return { documents, loading, error }
}

export default useFetchDocuments
