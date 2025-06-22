import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Play, Search } from 'lucide-react'

export function Videos() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredVideos(filtered)
    } else {
      setFilteredVideos(videos)
    }
  }, [searchTerm, videos])

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
        setFilteredVideos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error)
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <Play className="h-8 w-8 mr-3 text-primary" />
          Vídeos
        </h1>
        <p className="text-muted-foreground mb-6">
          Assista aos nossos vídeos mais recentes e informativos.
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar vídeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'Tente buscar com outros termos.' 
              : 'Novos vídeos serão adicionados em breve.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
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
                  className="w-full"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Assistir Vídeo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

