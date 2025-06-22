import { Newspaper } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <Newspaper className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Jornal TGI</span>
          </div>
          
          {/* Logo da RecordTV */}
          <div className="flex items-center space-y-2 flex-col">
            <img 
              src="/recordtv-logo.png" 
              alt="RecordTV" 
              className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
            <p className="text-sm text-gray-400 text-center">
              Uma parceria com a RecordTV
            </p>
          </div>
          
          {/* Descrição */}
          <p className="text-gray-400 text-center max-w-md">
            Portal de notícias e informações desenvolvido para o TGI.
          </p>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 w-full">
            <p className="text-center text-gray-500 text-sm">
              © 2025 Jornal TGI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

