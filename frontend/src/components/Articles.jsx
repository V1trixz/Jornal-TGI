import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, Search, X } from 'lucide-react'

export function Articles() {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredArticles(filtered)
    } else {
      setFilteredArticles(articles)
    }
  }, [searchTerm, articles])

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
        setFilteredArticles(data)
      }
    } catch (error) {
      console.error('Erro ao carregar artigos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const openArticle = (article) => {
    console.log('Abrindo artigo:', article)
    setSelectedArticle(article)
    setIsDialogOpen(true)
  }

  const closeArticle = () => {
    setSelectedArticle(null)
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary" />
          Artigos
        </h1>
        <p className="text-muted-foreground mb-6">
          Leia nossos artigos mais recentes e informativos.
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'Nenhum artigo encontrado' : 'Nenhum artigo disponível'}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'Tente buscar com outros termos.' 
              : 'Novos artigos serão adicionados em breve.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription>{formatDate(article.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                  {article.summary || article.content.substring(0, 150) + '...'}
                </p>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => openArticle(article)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Article Modal - Versão Corrigida */}
      {isDialogOpen && selectedArticle && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-gray-900 text-white border-gray-700">
            {/* Header */}
            <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <DialogTitle className="text-xl font-bold mb-2 text-white">
                    {selectedArticle.title}
                  </DialogTitle>
                  <p className="text-sm text-gray-400">
                    Publicado em {formatDate(selectedArticle.created_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeArticle}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {selectedArticle.summary && (
                <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Resumo</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedArticle.summary}
                  </p>
                </div>
              )}
              
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-100 leading-relaxed whitespace-pre-wrap break-words text-sm">
                  {selectedArticle.content}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

