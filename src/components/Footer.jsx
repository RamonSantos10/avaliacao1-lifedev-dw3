import { Instagram, Twitter, Linkedin, Github, Heart } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-sm text-gray-500">
      <div className="mx-auto px-4">
        {/* Main footer content */}
        <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand section */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="mb-2 text-base font-semibold text-gray-700">Life Dev</h3>
            <p className="mb-4 text-sm text-gray-500">Plataforma de Postagens para Desenvolvedores</p>
            <p className="text-xs text-gray-400">Compartilhamento de experiências de Nomade Life Dev</p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="mb-3 text-sm font-medium text-gray-600">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-500 transition-colors hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 transition-colors hover:text-gray-700">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 transition-colors hover:text-gray-700">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 transition-colors hover:text-gray-700">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="mb-3 text-sm font-medium text-gray-600">Conecte-se</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-700"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-700"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-700"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-700"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px w-full bg-gray-200"></div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-gray-400 md:flex-row md:text-left">
          <p>© {currentYear} Icoma Education. Todos os direitos reservados.</p>
          <p className="flex items-center">
            Feito com <Heart className="mx-1 h-3 w-3 text-red-400" /> para desenvolvedores
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
