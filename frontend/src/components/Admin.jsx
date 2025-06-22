import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings, Play, FileText, Plus, Edit, Trash2, CheckCircle } from 'lucide-react'

export function Admin() {
  const [videos, setVideos] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('videos')

  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    description: '',
    thumbnail_url: ''
  })

  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [videosResponse, articlesResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/videos'),
        fetch('http://localhost:5000/api/admin/articles')
      ])

      if (videosResponse.ok) {
        const videosData = await videosResponse.json()
        setVideos(videosData)
      }

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json()
        setArticles(articlesData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setMessage('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const resetForms = () => {
    setVideoForm({ title: '', url: '', description: '', thumbnail_url: '' })
    setArticleForm({ title: '', summary: '', content: '' })
    setEditingItem(null)
  }

  const handleVideoSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingItem 
        ? `http://localhost:5000/api/videos/${editingItem.id}`
        : 'http://localhost:5000/api/videos'
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoForm)
      })

      if (response.ok) {
        setMessage(editingItem ? 'Vídeo atualizado com sucesso!' : 'Vídeo criado com sucesso!')
        setIsDialogOpen(false)
        resetForms()
        fetchData()
      } else {
        setMessage('Erro ao salvar vídeo')
      }
    } catch (error) {
      setMessage('Erro de conexão')
    }
  }

  const handleArticleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingItem 
        ? `http://localhost:5000/api/articles/${editingItem.id}`
        : 'http://localhost:5000/api/articles'
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm)
      })

      if (response.ok) {
        setMessage(editingItem ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!')
        setIsDialogOpen(false)
        resetForms()
        fetchData()
      } else {
        setMessage('Erro ao salvar artigo')
      }
    } catch (error) {
      setMessage('Erro de conexão')
    }
  }

  const handleEdit = (item, type) => {
    setEditingItem(item)
    if (type === 'video') {
      setVideoForm({
        title: item.title,
        url: item.url,
        description: item.description,
        thumbnail_url: item.thumbnail_url || ''
      })
      setActiveTab('videos')
    } else {
      setArticleForm({
        title: item.title,
        summary: item.summary || '',
        content: item.content
      })
      setActiveTab('articles')
    }
    setIsDialogOpen(true)
  }

  const handleDelete = async (id, type) => {
    if (!confirm(`Tem certeza que deseja excluir este ${type === 'video' ? 'vídeo' : 'artigo'}?`)) {
      return
    }

    try {
      const url = type === 'video' 
        ? `http://localhost:5000/api/videos/${id}`
        : `http://localhost:5000/api/articles/${id}`
      
      const response = await fetch(url, { method: 'DELETE' })

      if (response.ok) {
        setMessage(`${type === 'video' ? 'Vídeo' : 'Artigo'} excluído com sucesso!`)
        fetchData()
      } else {
        setMessage('Erro ao excluir')
      }
    } catch (error) {
      setMessage('Erro de conexão')
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
          <Settings className="h-8 w-8 mr-3 text-primary" />
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Gerencie vídeos e artigos do seu jornal.
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Add Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6" onClick={resetForms}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Conteúdo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar' : 'Adicionar'} Conteúdo
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos">Vídeo</TabsTrigger>
              <TabsTrigger value="articles">Artigo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Título</Label>
                  <Input
                    id="video-title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="video-url">URL do Vídeo</Label>
                  <Input
                    id="video-url"
                    type="url"
                    value={videoForm.url}
                    onChange={(e) => setVideoForm({...videoForm, url: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="video-thumbnail">URL da Thumbnail (opcional)</Label>
                  <Input
                    id="video-thumbnail"
                    type="url"
                    value={videoForm.thumbnail_url}
                    onChange={(e) => setVideoForm({...videoForm, thumbnail_url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="video-description">Descrição</Label>
                  <Textarea
                    id="video-description"
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                    className="resize-none min-h-[100px] w-full"
                    style={{ 
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingItem ? 'Atualizar' : 'Criar'} Vídeo
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="articles">
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="article-title">Título</Label>
                  <Input
                    id="article-title"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="article-summary">Resumo (opcional)</Label>
                  <Textarea
                    id="article-summary"
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({...articleForm, summary: e.target.value})}
                    rows={3}
                    className="resize-none min-h-[80px] w-full"
                    style={{ 
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="article-content">Conteúdo</Label>
                  <Textarea
                    id="article-content"
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                    rows={12}
                    className="resize-none min-h-[300px] w-full"
                    style={{ 
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingItem ? 'Atualizar' : 'Criar'} Artigo
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Content Management */}
      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="videos" className="flex items-center">
            <Play className="h-4 w-4 mr-2" />
            Vídeos ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Artigos ({articles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                  <CardDescription>{formatDate(video.created_at)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {video.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(video, 'video')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(video.id, 'video')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription>{formatDate(article.created_at)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.summary || article.content.substring(0, 150) + '...'}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(article, 'article')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id, 'article')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

