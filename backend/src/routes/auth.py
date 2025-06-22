from flask import Blueprint, jsonify, request, session
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Credenciais fixas
FIXED_USERNAME = "RecordUpload"
FIXED_PASSWORD = "Rec0rd@2025!J0rn4l7711"

def login_required(f):
    """Decorator para verificar se o usuário está logado"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session or not session['logged_in']:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login com credenciais fixas"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == FIXED_USERNAME and password == FIXED_PASSWORD:
        session['logged_in'] = True
        session['username'] = username
        return jsonify({
            'success': True,
            'message': 'Login realizado com sucesso',
            'user': {'username': username}
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Credenciais inválidas'
        }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Endpoint de logout"""
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logout realizado com sucesso'
    })

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Verificar se o usuário está autenticado"""
    if 'logged_in' in session and session['logged_in']:
        return jsonify({
            'authenticated': True,
            'user': {'username': session.get('username')}
        })
    else:
        return jsonify({'authenticated': False})

