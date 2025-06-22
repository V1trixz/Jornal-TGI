from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
import os

# Configuração do banco de dados
os.makedirs(os.path.join(os.path.dirname(__file__), 'database'), exist_ok=True)
DATABASE_URL = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelos do banco de dados
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String)
    description = Column(String)
    thumbnail_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    is_published = Column(Boolean, default=True)

class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(String, nullable=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    is_published = Column(Boolean, default=True)

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Esquemas Pydantic
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class VideoCreate(BaseModel):
    title: str
    url: str
    description: str
    thumbnail_url: Optional[str] = None

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None

class VideoResponse(BaseModel):
    id: int
    title: str
    url: str
    description: str
    thumbnail_url: Optional[str]
    created_at: datetime
    is_published: bool

class ArticleCreate(BaseModel):
    title: str
    summary: Optional[str] = None
    content: str

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None

class ArticleResponse(BaseModel):
    id: int
    title: str
    summary: Optional[str]
    content: str
    created_at: datetime
    is_published: bool

# Inicializar FastAPI
app = FastAPI(title="Jornal TGI API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sistema de sessão simples (em memória)
active_sessions = set()

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota raiz
@app.get("/")
async def root():
    return {"message": "Jornal TGI API", "status": "running"}

# Rotas de Autenticação
@app.post("/api/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    
    # Adicionar à sessão ativa
    session_id = f"{user.username}_{datetime.now().timestamp()}"
    active_sessions.add(session_id)
    
    return {
        "success": True, 
        "user": {"username": db_user.username},
        "session_id": session_id
    }

@app.get("/api/check-auth")
async def check_auth(session_id: Optional[str] = None):
    # Verificar se existe uma sessão ativa
    if session_id and session_id in active_sessions:
        username = session_id.split('_')[0]
        return {"authenticated": True, "user": {"username": username}}
    return {"authenticated": False, "user": None}

@app.post("/api/logout")
async def logout(session_id: Optional[str] = None):
    # Remover da sessão ativa
    if session_id and session_id in active_sessions:
        active_sessions.remove(session_id)
    return {"success": True}

# Rotas de Conteúdo (Vídeos)
@app.post("/api/videos", response_model=VideoResponse)
async def create_video(video: VideoCreate, db: Session = Depends(get_db)):
    db_video = Video(**video.dict())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

@app.get("/api/videos", response_model=List[VideoResponse])
async def get_videos(db: Session = Depends(get_db)):
    return db.query(Video).filter(Video.is_published == True).all()

@app.get("/api/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    return video

@app.put("/api/videos/{video_id}", response_model=VideoResponse)
async def update_video(video_id: int, video: VideoUpdate, db: Session = Depends(get_db)):
    db_video = db.query(Video).filter(Video.id == video_id).first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    for key, value in video.dict(exclude_unset=True).items():
        setattr(db_video, key, value)
    db.commit()
    db.refresh(db_video)
    return db_video

@app.delete("/api/videos/{video_id}")
async def delete_video(video_id: int, db: Session = Depends(get_db)):
    db_video = db.query(Video).filter(Video.id == video_id).first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    db.delete(db_video)
    db.commit()
    return {"message": "Vídeo excluído com sucesso"}

# Rotas de Conteúdo (Artigos)
@app.post("/api/articles", response_model=ArticleResponse)
async def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@app.get("/api/articles", response_model=List[ArticleResponse])
async def get_articles(db: Session = Depends(get_db)):
    return db.query(Article).filter(Article.is_published == True).all()

@app.get("/api/articles/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    return article

@app.put("/api/articles/{article_id}", response_model=ArticleResponse)
async def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    for key, value in article.dict(exclude_unset=True).items():
        setattr(db_article, key, value)
    db.commit()
    db.refresh(db_article)
    return db_article

@app.delete("/api/articles/{article_id}")
async def delete_article(article_id: int, db: Session = Depends(get_db)):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    db.delete(db_article)
    db.commit()
    return {"message": "Artigo excluído com sucesso"}

# Rotas Admin (que estavam faltando)
@app.get("/api/admin/videos", response_model=List[VideoResponse])
async def get_admin_videos(db: Session = Depends(get_db)):
    return db.query(Video).all()  # Retorna todos os vídeos, incluindo não publicados

@app.get("/api/admin/articles", response_model=List[ArticleResponse])
async def get_admin_articles(db: Session = Depends(get_db)):
    return db.query(Article).all()  # Retorna todos os artigos, incluindo não publicados

# Adicionar usuário padrão se não existir
@app.on_event("startup")
async def create_default_user():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.username == "RecordUpload").first():
            default_user = User(username="RecordUpload", password="Rec0rd@2025!J0rn4l7711")
            db.add(default_user)
            db.commit()
            print("Usuário padrão 'RecordUpload' criado.")
        
        # Adicionar dados de exemplo se não existirem
        if db.query(Video).count() == 0:
            sample_video = Video(
                title="Vídeo de Teste - Jornal TGI",
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                description="Este é um vídeo de teste para demonstrar a funcionalidade do sistema de gerenciamento de conteúdo do Jornal TGI.",
                thumbnail_url="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
            )
            db.add(sample_video)
            db.commit()
            print("Vídeo de exemplo criado.")
        
        if db.query(Article).count() == 0:
            sample_article = Article(
                title="Artigo de Exemplo",
                summary="Este é um resumo do artigo de exemplo.",
                content="Este é o conteúdo completo do artigo de exemplo. Aqui você pode adicionar todo o texto do artigo."
            )
            db.add(sample_article)
            db.commit()
            print("Artigo de exemplo criado.")
        
        print("Dados de exemplo criados.")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

