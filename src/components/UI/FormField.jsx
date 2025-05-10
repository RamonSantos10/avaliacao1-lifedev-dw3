/**
 * Componente FormField - Implementa campos de formulário reutilizáveis
 * 
 * Este componente segue o princípio SOLID de Responsabilidade Única (SRP), fornecendo
 * uma interface consistente para diferentes tipos de campos de formulário na aplicação.
 */

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

/**
 * Campo de texto padrão para formulários
 */
export const TextField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className = "",
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
      </div>
    </div>
  )
}

/**
 * Campo de senha com toggle para mostrar/esconder
 */
export const PasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  autoComplete,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}

/**
 * Componente de mensagem de erro para formulários
 */
export const ErrorMessage = ({ error }) => {
  if (!error) return null
  
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Erro</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Separador de formulário com texto
 */
export const FormDivider = ({ text }) => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">{text}</span>
      </div>
    </div>
  )
}