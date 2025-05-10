"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./Dashboard.module.css"
import useFetchDocuments from "../../hooks/useFetchDocuments"
import { useAuthValue } from "../../context/AuthContext"

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const { user } = useAuthValue()
  const uid = user?.uid
  
  const { documents: postsList, loading } = useFetchDocuments("posts", null, uid)

  useEffect(() => {
    if (postsList) {
      setPosts(postsList)
    }
  }, [postsList])

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencie os seus posts</p>
      {loading && <p>Carregando...</p>}
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/post/new" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <div className={styles.post_list}>
          {posts &&
            posts.map((post) => (
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
                  <button className="btn btn-outline btn-danger">
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
    