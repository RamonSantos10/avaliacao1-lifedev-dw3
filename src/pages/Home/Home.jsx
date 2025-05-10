"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./Home.module.css"
import useFetchDocuments from "../../hooks/useFetchDocuments"

const Home = () => {
  const [query, setQuery] = useState("")
  const { documents: posts, loading } = useFetchDocuments("posts")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (query) {
      return navigate(`/search?q=${query}`)
    }
  }

  return (
    <div className={styles.home}>
      <h1>Veja os posts mais recentes</h1>
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input
          type="text"
          placeholder="Ou busque por tags..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <button className="btn btn-dark">Pesquisar</button>
      </form>
      <div className={styles.post_list}>
        {loading && <p>Carregando...</p>}
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to="/post/new" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}
        {posts &&
          posts.map((post) => (
            <div className={styles.post} key={post.id}>
              <img src={post.image || "/placeholder.svg"} alt={post.title} />
              <h2>{post.title}</h2>
              <p className={styles.createdby}>por: {post.createdBy}</p>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
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
  