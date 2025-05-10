/**
 * Componente Button - Implementa botões reutilizáveis seguindo o princípio de responsabilidade única
 * 
 * Este componente segue o princípio SOLID de Responsabilidade Única (SRP), fornecendo
 * uma interface consistente para diferentes tipos de botões na aplicação.
 */

import { useState } from "react"

/**
 * Botão primário com diferentes estados (normal, loading)
 */
export const PrimaryButton = ({ children, type = "button", onClick, disabled, isLoading, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300 ${className} ${disabled || isLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300" : ""}`}
    >
      {isLoading ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Aguarde...
        </>
      ) : (
        children
      )}
    </button>
  )
}

/**
 * Botão secundário para ações alternativas
 */
export const SecondaryButton = ({ children, type = "button", onClick, disabled, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}

/**
 * Botão de ação perigosa (ex: excluir)
 */
export const DangerButton = ({ children, type = "button", onClick, disabled, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}

/**
 * Botão de ícone para ações simples
 */
export const IconButton = ({ children, onClick, ariaLabel, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-500 focus:outline-none ${className}`}
    >
      {children}
    </button>
  )
}