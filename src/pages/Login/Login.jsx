import { useEffect, useState } from "react"
import { useAuthentication } from "../../hooks/useAuthentication"
import { useNavigate, Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
// Importando componentes reutilizáveis
import { PrimaryButton, SecondaryButton } from "../../components/UI/Button"
import { TextField, PasswordField, ErrorMessage, FormDivider } from "../../components/UI/FormField"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { login, loginWithGoogle, error: authError, loading } = useAuthentication()

  const handlerSubmit = async (e) => {
    e.preventDefault()

    setError("")
    const user = {
      email,
      password,
    }

    const res = await login(user)
    if (res) navigate("/dashboard")
  }

  const handleGoogleLogin = async () => {
    const res = await loginWithGoogle()
    if (res) navigate("/dashboard")
  }

  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Entrar</h1>
          <p className="mt-2 text-sm text-gray-500">Faça login em nossa plataforma de desenvolvedores</p>
        </div>

        <div className="mt-8">
          <SecondaryButton onClick={handleGoogleLogin}>
            <FcGoogle className="h-5 w-5" />
            <span>Entrar com Google</span>
          </SecondaryButton>

          <FormDivider text="ou continue com email" />

          <form className="mt-6 space-y-6" onSubmit={handlerSubmit}>
            <TextField
              id="email"
              name="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />

            <PasswordField
              id="password"
              name="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div>
              <PrimaryButton type="submit" isLoading={loading}>
                Entrar
              </PrimaryButton>
            </div>

            <ErrorMessage error={error} />

            <div className="flex items-center justify-center">
              <div className="text-sm">
                <span className="text-gray-500">Não tem uma conta?</span>{" "}
                <Link to="/register" className="font-medium text-gray-900 hover:text-gray-700">
                  Cadastre-se
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
