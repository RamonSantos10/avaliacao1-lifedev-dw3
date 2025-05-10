"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuthValue } from "../../context/AuthContext"
import { db } from "../../firebase/config"
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Heart, MessageCircle, Bookmark, Plus, AlertCircle, Loader, Trash2, Edit, Eye } from "lucide-react"

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuthValue()

  // Função para buscar todos os posts
  const fetchAllPosts = async () => {
    if (!user?.uid) return

    setLoading(true)
    setError(null)

    try {
      // Buscar todos os posts
      const q = query(collection(db, "posts"))

      const querySnapshot = await getDocs(q)
      const allPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Ordenar os posts no cliente, após recebê-los
      allPosts.sort((a, b) => {
        // Verificar se createdAt existe e é um timestamp válido
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate ? b.createdAt.toDate() - a.createdAt.toDate() : b.createdAt - a.createdAt
        }
        return 0
      })

      setPosts(allPosts)
    } catch (error) {
      console.error("Erro ao buscar posts:", error)

      // Verificar se o erro é relacionado a índice
      if (error.message && error.message.includes("index")) {
        setError("Erro de índice no Firestore. Por favor, crie o índice necessário seguindo o link no console.")
        console.log("Link para criar o índice:", error.message)
      } else {
        setError("Falha ao carregar os posts. Tente novamente mais tarde.")
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
      fetchAllPosts()
    }
  }, [user])

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
  const getAvatarUrl = (authorName, authorUid) => {
    // Se o post for do usuário atual e ele tiver foto de perfil, use-a
    if (authorUid === user?.uid && user?.photoURL) {
      return user.photoURL
    }

    // Caso contrário, gere um avatar baseado no nome do autor
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName || "User")}&background=random&color=fff&size=128`
  }

  // Verificar se o usuário atual é o autor do post
  const isCurrentUserAuthor = (postUid) => {
    return postUid === user?.uid
  }

  return (
    <div className="mx-auto max-w-lg bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Feed</h2>
          
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
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Carregando posts...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 ? (
        <div className="m-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <Bookmark className="h-10 w-10 text-gray-400" />
          </div>
          <p className="mb-4 text-lg text-gray-500">Nenhum post encontrado</p>
          <Link
            to="/post/new"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="bg-white">
              {/* Post header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
                    <div className="h-full w-full overflow-hidden rounded-full bg-white">
                      <img
                        src={getAvatarUrl(post.createdBy, post.uid) || "/placeholder.svg"}
                        alt={post.createdBy || "Usuário"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.createdBy || "User")}&background=random&color=fff`
                          e.target.onerror = null
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold">{post.createdBy || "Usuário"}</p>
                  </div>
                </div>
                {isCurrentUserAuthor(post.uid) && (
                  <div className="relative">
                    <div className="flex space-x-2">
                      <Link
                        to={`/post/edit/${post.id}`}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">Editar</span>
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Excluir</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Post image */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
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

              {/* Post actions */}
              <div className="flex items-center justify-between p-4">
                <div className="flex space-x-4">
                  {/* <button className="flex items-center text-gray-500 hover:text-red-500">
                    <Heart className="h-6 w-6" />
                    <span className="sr-only">Curtir</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Comentar</span>
                  </button> */}
                  <Link to={`/post/${post.id}`} className="flex items-center text-gray-500 hover:text-gray-700">
                    <Eye className="h-6 w-6" />
                    <span className="sr-only">Ver</span>
                  </Link>
                </div>
                {/* <button className="text-gray-500 hover:text-gray-700">
                  <Bookmark className="h-6 w-6" />
                  <span className="sr-only">Salvar</span>
                </button> */}
              </div>

              {/* Post content */}
              <div className="px-4 pb-4">
                <div className="flex items-start">
                  <p className="text-sm font-semibold">{post.createdBy || "Usuário"}</p>
                  <p className="ml-2 text-sm text-gray-700 line-clamp-2">{post.title}</p>
                </div>
                {post.body && <p className="mt-1 text-sm text-gray-700 line-clamp-2">{post.body}</p>}
                {post.createdAt && <p className="mt-2 text-xs uppercase text-gray-400">{formatDate(post.createdAt)}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link
          to="/post/new"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
        >
          <Plus className="h-8 w-8" />
          <span className="sr-only">Criar novo post</span>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
