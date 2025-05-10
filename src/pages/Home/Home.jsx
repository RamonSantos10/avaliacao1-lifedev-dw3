"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../../firebase/config"
import { collection, query, getDocs } from "firebase/firestore"
import {
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  AlertCircle,
  Loader,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("recent")
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

  // Função para formatar data
  const formatDate = (timestamp) => {
    if (!timestamp) return ""

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

    // Calcular diferença de tempo
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`

    // Se for mais antigo que uma semana, mostrar a data
    return date.toLocaleDateString()
  }

  // Função para gerar avatar baseado no nome do autor
  const getAvatarUrl = (authorName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName || "User")}&background=random&color=fff&size=128`
  }

  // Filtrar posts baseado no filtro ativo
  const getFilteredPosts = () => {
    if (activeFilter === "recent") {
      return [...posts]
    } else if (activeFilter === "trending") {
      // Simulando posts em tendência (na vida real, seria baseado em métricas como visualizações, curtidas, etc.)
      return [...posts].sort(() => Math.random() - 0.5)
    }
    return posts
  }

  const filteredPosts = getFilteredPosts()

  return (
    <div className="mx-auto max-w-2xl bg-gray-50 pb-20">
      {/* Hero section */}
      <div className="bg-[#101828] px-4 py-12 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">Explore o mundo dev</h1>
          <p className="mb-6 text-indigo-100">
            Descubra histórias, conhecimentos e experiências compartilhadas por desenvolvedores.
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
            <div className="flex overflow-hidden rounded-full bg-white shadow-lg">
              <input
                type="text"
                placeholder="Busque por tags, tópicos ou palavras-chave..."
                className="w-full flex-1 border-none bg-transparent px-6 py-3 text-gray-700 placeholder-gray-500 focus:outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-indigo-500 px-4 text-white transition-colors hover:bg-indigo-600"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Pesquisar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex px-4">
          <button
            onClick={() => setActiveFilter("recent")}
            className={`flex items-center px-4 py-4 text-sm font-medium ${
              activeFilter === "recent"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Clock className="mr-2 h-4 w-4" />
            Recentes
          </button>
          <button
            onClick={() => setActiveFilter("trending")}
            className={`flex items-center px-4 py-4 text-sm font-medium ${
              activeFilter === "trending"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Em alta
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="m-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex h-60 items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="ml-2 text-gray-600">Carregando posts...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredPosts.length === 0 && (
        <div className="m-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mb-4 rounded-full bg-indigo-100 p-6">
            <Bookmark className="h-10 w-10 text-indigo-500" />
          </div>
          <p className="mb-4 text-lg text-gray-500">Nenhum post encontrado</p>
          <Link
            to="/post/new"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Criar primeiro post
          </Link>
        </div>
      )}

      {/* Posts feed */}
      {!loading && filteredPosts.length > 0 && (
        <div className="divide-y divide-gray-200">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white">
              {/* Post header */}
              <div className="flex items-center p-4">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-[2px]">
                  <div className="h-full w-full overflow-hidden rounded-full bg-white">
                    <img
                      src={getAvatarUrl(post.createdBy) || "/placeholder.svg"}
                      alt={post.createdBy || "Usuário"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{post.createdBy || "Usuário"}</p>
                  {post.createdAt && <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>}
                </div>
              </div>

              {/* Post image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                    e.target.onerror = null
                  }}
                />
              </div>

              {/* Post content */}
              <div className="px-4 pb-2 pt-1">
                <h2 className="mb-2 text-xl font-bold text-gray-900">{post.title}</h2>
                {post.body && <p className="mb-3 text-gray-700 line-clamp-2">{post.body}</p>}
              </div>

              {/* Post tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 px-4 pb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Read more link */}
              <div className="border-t border-gray-100 px-4 py-3">
                <Link
                  to={`/post/${post.id}`}
                  className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Ler post completo
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
