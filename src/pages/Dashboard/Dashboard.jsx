import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./Dashboard.module.css"
import { useAuthValue } from "../../context/AuthContext"
import { db } from "../../firebase/config"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuthValue()

  // Função para buscar posts do usuário
  const fetchUserPosts = async () => {
    if (!user?.uid) return

    setLoading(true)
    setError(null)

    try {
      // Simplificando a consulta - removendo orderBy para evitar necessidade de índice composto
      const q = query(collection(db, "posts"), where("uid", "==", user.uid))

      const querySnapshot = await getDocs(q)
      const userPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Ordenar os posts no cliente, após recebê-los
      userPosts.sort((a, b) => {
        // Verificar se createdAt existe e é um timestamp válido
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate ? b.createdAt.toDate() - a.createdAt.toDate() : b.createdAt - a.createdAt
        }
        return 0
      })

      setPosts(userPosts)
    } catch (error) {
      console.error("Erro ao buscar posts:", error)

      // Verificar se o erro é relacionado a índice
      if (error.message && error.message.includes("index")) {
        setError("Erro de índice no Firestore. Por favor, crie o índice necessário seguindo o link no console.")
        console.log("Link para criar o índice:", error.message)
      } else {
        setError("Falha ao carregar seus posts. Tente novamente mais tarde.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para excluir post
  const handleDeletePost = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id))
      // Atualiza a lista de posts após exclusão
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("Erro ao excluir post:", error)
      setError("Erro ao excluir post. Tente novamente.")
    }
  }

  // Buscar posts quando o componente montar ou o usuário mudar
  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
  }, [user])

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencie os seus posts</p>

      {error && <div className="error">{error}</div>}

      {loading && <p>Carregando...</p>}

      {!loading && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/post/new" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <div className={styles.post_list}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <h3>{post.title}</h3>
              <p>por {post.createdBy}</p>
              <div className={styles.actions}>
                <Link to={`/post/${post.id}`} className="btn btn-outline">
                  Ver
                </Link>
                <Link to={`/post/edit/${post.id}`} className="btn btn-outline">
                  Editar
                </Link>
                <button onClick={() => handleDeletePost(post.id)} className="btn btn-outline btn-danger">
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
