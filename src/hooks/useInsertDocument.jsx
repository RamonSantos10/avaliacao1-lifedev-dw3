"use client"

import { useState, useEffect, useReducer } from "react"
import { db } from "../firebase/config"
import { collection, addDoc, Timestamp } from "firebase/firestore"

const initialState = {
  loading: null,
  error: null,
}

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null }
    case "INSERTED_DOC":
      return { loading: false, error: null }
    case "ERROR":
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState)
  const [cancelled, setCancelled] = useState(false)

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action)
    }
  }

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({ type: "LOADING" })
    try {
      // Adicione um log para verificar o documento e a coleção
      console.log("Inserindo documento na coleção:", docCollection)
      console.log("Documento:", document)

      const newDocument = { ...document, createdAt: Timestamp.now() }
      const insertedDocument = await addDoc(collection(db, docCollection), newDocument)

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
      })

      return insertedDocument
    } catch (error) {
      console.error("Erro ao inserir documento:", error)
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message })
      return null
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { insertDocument, response }
}
