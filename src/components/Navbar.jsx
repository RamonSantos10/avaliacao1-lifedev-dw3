"use client"

import styles from "./Navbar.module.css"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuthentication } from "../hooks/useAuthentication"
import { useAuthValue } from "../context/AuthContext"

const Navbar = () => {
  const { user } = useAuthValue()
  const { logout } = useAuthentication()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className={styles.navbar}>
      <ul className={styles.links_list}>
        <NavLink to="/" className={styles.brand}>
          <li>
            <span>Life</span>Dev
          </li>
        </NavLink>

        {!user && (
          <>
            <NavLink to="/login" className={styles.link}>
              <li>Login</li>
            </NavLink>
            <NavLink to="/register" className={styles.link}>
              <li>Register</li>
            </NavLink>
          </>
        )}

        {user && (
          <>
            <NavLink to="/dashboard" className={styles.link}>
              <li>Dashboard</li>
            </NavLink>
            <NavLink to="/post/new" className={styles.link}>
              <li>Novo Post</li>
            </NavLink>
            <button onClick={handleLogout} className={styles.exit}>
              Sair
            </button>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
