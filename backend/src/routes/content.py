from flask import Blueprint, jsonify, request
from src.models.content import Video, Article, db

content_bp = Blueprint('content', __name__)

# Rotas para vídeos
@content_bp.route('/videos', methods=['GET'])
def get_videos():
    """Obter todos os vídeos publicados (área pública)"""
    videos = Video.query.filter_by(is_published=True).order_by(Video.created_at.desc()).all()
    return jsonify([video.to_dict() for video in videos])

@content_bp.route('/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    """Obter um vídeo específico"""
    video = Video.query.get_or_404(video_id)
    if not video.is_published:
        return jsonify({'error': 'Video not found'}), 404
    return jsonify(video.to_dict())

@content_bp.route('/admin/videos', methods=['GET'])
def get_all_videos():
    """Obter todos os vídeos (incluindo não publicados) - área administrativa"""
    videos = Video.query.order_by(Video.created_at.desc()).all()
    return jsonify([video.to_dict() for video in videos])

@content_bp.route('/admin/videos', methods=['POST'])
def create_video():
    """Criar um novo vídeo - área administrativa"""
    data = request.json
    video = Video(
        title=data['title'],
        description=data.get('description', ''),
        video_url=data['video_url'],
        thumbnail_url=data.get('thumbnail_url'),
        is_published=data.get('is_published', True)
    )
    db.session.add(video)
    db.session.commit()
    return jsonify(video.to_dict()), 201

@content_bp.route('/admin/videos/<int:video_id>', methods=['PUT'])
def update_video(video_id):
    """Atualizar um vídeo - área administrativa"""
    video = Video.query.get_or_404(video_id)
    data = request.json
    
    video.title = data.get('title', video.title)
    video.description = data.get('description', video.description)
    video.video_url = data.get('video_url', video.video_url)
    video.thumbnail_url = data.get('thumbnail_url', video.thumbnail_url)
    video.is_published = data.get('is_published', video.is_published)
    
    db.session.commit()
    return jsonify(video.to_dict())

@content_bp.route('/admin/videos/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    """Excluir um vídeo - área administrativa"""
    video = Video.query.get_or_404(video_id)
    db.session.delete(video)
    db.session.commit()
    return '', 204

# Rotas para artigos
@content_bp.route('/articles', methods=['GET'])
def get_articles():
    """Obter todos os artigos publicados (área pública)"""
    articles = Article.query.filter_by(is_published=True).order_by(Article.created_at.desc()).all()
    return jsonify([article.to_dict() for article in articles])

@content_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    """Obter um artigo específico"""
    article = Article.query.get_or_404(article_id)
    if not article.is_published:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify(article.to_dict())

@content_bp.route('/admin/articles', methods=['GET'])
def get_all_articles():
    """Obter todos os artigos (incluindo não publicados) - área administrativa"""
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return jsonify([article.to_dict() for article in articles])

@content_bp.route('/admin/articles', methods=['POST'])
def create_article():
    """Criar um novo artigo - área administrativa"""
    data = request.json
    article = Article(
        title=data['title'],
        content=data['content'],
        summary=data.get('summary', ''),
        is_published=data.get('is_published', True)
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201

@content_bp.route('/admin/articles/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    """Atualizar um artigo - área administrativa"""
    article = Article.query.get_or_404(article_id)
    data = request.json
    
    article.title = data.get('title', article.title)
    article.content = data.get('content', article.content)
    article.summary = data.get('summary', article.summary)
    article.is_published = data.get('is_published', article.is_published)
    
    db.session.commit()
    return jsonify(article.to_dict())

@content_bp.route('/admin/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    """Excluir um artigo - área administrativa"""
    article = Article.query.get_or_404(article_id)
    db.session.delete(article)
    db.session.commit()
    return '', 204

