import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase/config"
import { doc, getDoc } from "firebase/firestore"
import styles from "./Post.module.css"

const Post = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      try {
        const docRef = doc(db, "posts", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("Post não encontrado!")
        }
      } catch (error) {
        console.error("Erro ao buscar post:", error)
        setError("Erro ao carregar o post. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  return (
    <div className={styles.post_container}>
      {loading && <p>Carregando post...</p>}

      {error && <div className="error">{error}</div>}

      {post && (
        <>
          <h1>{post.title}</h1>

          <div className={styles.post_image}>
            <img src={post.image || "/placeholder.svg"} alt={post.title} />
          </div>

          <div className={styles.post_author}>
            <p>por: {post.createdBy}</p>
          </div>

          <div className={styles.tags}>
            {post.tags &&
              post.tags.map((tag) => (
                <p key={tag}>
                  <span>#</span>
                  {tag}
                </p>
              ))}
          </div>

          <div className={styles.post_body}>
            <p>{post.body}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default Post
