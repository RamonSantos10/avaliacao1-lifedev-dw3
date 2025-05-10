"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthValue } from "../../context/AuthContext"
import { db } from "../../firebase/config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import styles from "./CreatePost.module.css"

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  const { user } = useAuthValue()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setLoading(true)

    try {
      // Validar URL da imagem
      try {
        new URL(image)
      } catch (error) {
        setFormError("A imagem precisa ser uma URL válida.")
        setLoading(false)
        return
      }

      // Criar array de tags
      const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

      // Checar todos os valores
      if (!title || !image || !body || !tags) {
        setFormError("Por favor, preencha todos os campos!")
        setLoading(false)
        return
      }

      // Criar objeto do post
      const post = {
        title,
        image,
        body,
        tags: tagsArray,
        uid: user.uid,
        createdBy: user.displayName,
        // Usar serverTimestamp para garantir consistência
        createdAt: serverTimestamp(),
      }

      console.log("Enviando post:", post)

      // Adicionar diretamente ao Firestore
      const docRef = await addDoc(collection(db, "posts"), post)
      console.log("Post criado com ID:", docRef.id)

      // Redirecionar para o dashboard
      navigate("/dashboard")
    } catch (error) {
      console.error("Erro ao criar post:", error)
      setFormError("Erro ao criar post: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.create_post}>
      <h2>Criar post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            required
            placeholder="Pense num bom título..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>URL da imagem:</span>
          <input
            type="text"
            name="image"
            required
            placeholder="Insira uma imagem que representa o seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label>
          <span>Conteúdo:</span>
          <textarea
            name="body"
            required
            placeholder="Insira o conteúdo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            required
            placeholder="Insira as tags separadas por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        {!loading && <button className="btn">Criar post!</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default CreatePost
