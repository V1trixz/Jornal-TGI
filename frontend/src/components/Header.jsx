import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Newspaper, User, LogOut } from 'lucide-react'

export function Header({ isAuthenticated, user, onLogout }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center space-x-2">
                <Newspaper className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">Jornal TGI</span>
              </div>
            </Link>
            
            {/* Logo da RecordTV */}
            <div className="hidden sm:flex items-center">
              <div className="w-px h-8 bg-gray-700 mx-4"></div>
              <img 
                src="/recordtv-logo.png" 
                alt="RecordTV" 
                className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Início
            </Link>
            <Link
              to="/videos"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/videos') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Vídeos
            </Link>
            <Link
              to="/articles"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/articles') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Artigos
            </Link>
          </nav>

          {/* Área do usuário */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4 mr-1 inline" />
                  Admin
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <User className="h-4 w-4 mr-1 inline" />
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Início
            </Link>
            <Link
              to="/videos"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/videos') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Vídeos
            </Link>
            <Link
              to="/articles"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/articles') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Artigos
            </Link>
          </div>
          
          {/* Logo da RecordTV no mobile */}
          <div className="sm:hidden flex justify-center mt-3 pt-3 border-t border-gray-800">
            <img 
              src="/recordtv-logo.png" 
              alt="RecordTV" 
              className="h-8 w-auto opacity-80"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

