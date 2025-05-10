import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import useFetchDocuments from "../../hooks/useFetchDocuments";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const { documents: postsList, loading } = useFetchDocuments("posts");

  useEffect(() => {
    if (postsList) {
      setPosts(postsList);
    }
  }, [postsList]);

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      {loading && <p>Carregando...</p>}
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/post/new" className={styles.btn}>
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
                  <Link to={`/post/${post.id}`} className={styles.btn}>
                    Ver
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
