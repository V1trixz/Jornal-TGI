import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, FileText, ArrowRight } from 'lucide-react'

export function Home() {
  const [recentVideos, setRecentVideos] = useState([])
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentContent()
  }, [])

  const fetchRecentContent = async () => {
    try {
      const [videosResponse, articlesResponse] = await Promise.all([
        fetch('http://localhost:5000/api/videos'),
        fetch('http://localhost:5000/api/articles')
      ])

      if (videosResponse.ok) {
        const videos = await videosResponse.json()
        setRecentVideos(videos.slice(0, 3))
      }

      if (articlesResponse.ok) {
        const articles = await articlesResponse.json()
        setRecentArticles(articles.slice(0, 3))
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Bem-vindo ao Jornal TGI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Seu portal de notícias e informações. Acompanhe os últimos vídeos e 
          artigos sobre os temas mais relevantes do momento.
        </p>
      </div>

      {/* Recent Videos */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Play className="h-6 w-6 mr-2 text-primary" />
            Vídeos Recentes
          </h2>
          <Link to="/videos">
            <Button variant="outline">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <Play className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                <CardDescription>{formatDate(video.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {video.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(video.url, '_blank')}
                >
                  Assistir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <FileText className="h-6 w-6 mr-2 text-primary" />
            Artigos Recentes
          </h2>
          <Link to="/articles">
            <Button variant="outline">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription>{formatDate(article.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                  {article.summary || article.content.substring(0, 150) + '...'}
                </p>
                <Link to={`/articles/${article.id}`}>
                  <Button variant="outline" size="sm">
                    Ler mais
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

