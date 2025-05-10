import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./Home.module.css"
import { db } from "../../firebase/config"
import { collection, query, getDocs } from "firebase/firestore"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  // Função para buscar todos os posts
  const fetchPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simplificando a consulta - removendo orderBy para evitar necessidade de índice
      const q = query(collection(db, "posts"))

      const querySnapshot = await getDocs(q)
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Ordenar os posts no cliente, após recebê-los
      fetchedPosts.sort((a, b) => {
        // Verificar se createdAt existe e é um timestamp válido
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate ? b.createdAt.toDate() - a.createdAt.toDate() : b.createdAt - a.createdAt
        }
        return 0
      })

      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Erro ao buscar posts:", error)
      setError("Falha ao carregar posts. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  // Buscar posts quando o componente montar
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (searchQuery) {
      return navigate(`/search?q=${searchQuery}`)
    }
  }

  return (
    <div className={styles.home}>
      <h1>Veja os posts mais recentes</h1>
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input
          type="text"
          placeholder="Ou busque por tags..."
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button className="btn btn-dark">Pesquisar</button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && <p>Carregando...</p>}

      <div className={styles.post_list}>
        {!loading && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to="/post/new" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}

        {posts.map((post) => (
          <div className={styles.post} key={post.id}>
            <img src={post.image || "/placeholder.svg"} alt={post.title} />
            <h2>{post.title}</h2>
            <p className={styles.createdby}>por: {post.createdBy}</p>
            <div className={styles.tags}>
              {post.tags &&
                post.tags.map((tag) => (
                  <p key={tag}>
                    <span>#</span>
                    {tag}
                  </p>
                ))}
            </div>
            <Link to={`/post/${post.id}`} className="btn btn-outline">
              Ler
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
