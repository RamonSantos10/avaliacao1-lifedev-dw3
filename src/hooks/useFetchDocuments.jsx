"use client"

import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore"

const useFetchDocuments = (collectionName, search = null, uid = null) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)

    try {
      let q

      // Criar a base da query
      if (uid) {
        q = query(
          collection(db, collectionName),
          where("uid", "==", uid),
          orderBy("createdAt", "desc")
        )
      } else if (search) {
        q = query(
          collection(db, collectionName),
          where("tags", "array-contains", search),
          orderBy("createdAt", "desc")
        )
      } else {
        q = query(collection(db, collectionName), orderBy("createdAt", "desc"))
      }

      // Executar a query
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setDocuments(docs)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error(error)
      setError(error.message)
      setLoading(false)
    }
  }, [collectionName, search, uid])

  return { documents, loading, error }
}

export default useFetchDocuments
