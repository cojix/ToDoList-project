# app.py


import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Task
from dotenv import load_dotenv
import jwt
import bcrypt
import datetime
from dotenv import load_dotenv
load_dotenv()


load_dotenv()  # 加载 .env
app = Flask(__name__)
CORS(app)

# 配置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
db.init_app(app)

# 在第一次运行时创建表
# @app.before_first_request
# def create_tables():
# #   db.create_all()




# JWT Secret
JWT_SECRET = os.getenv('JWT_SECRET', 'testsecret')  # 如果没在 .env 里定义，就用 'testsecret'

def generate_token(user_id):
    """
    生成 JWT Token
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # 1天后过期
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

def decode_token(token):
    """
    验证 JWT Token
    """
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return decoded['user_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

# 用户注册
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': '用户名或密码不能为空'}), 400

    # 检查是否已存在
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': '用户已存在'}), 400

    # 密码哈希
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = User(username=username, password_hash=hashed.decode('utf-8'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': '注册成功'}), 201

# 用户登录
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': '用户名或密码错误'}), 401

    # 验证密码
    if bcrypt.hashpw(password.encode('utf-8'), user.password_hash.encode('utf-8')) == user.password_hash.encode('utf-8'):
        token = generate_token(user.id)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': '用户名或密码错误'}), 401

# 获取当前用户ID
def get_current_user_id():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    user_id = decode_token(token)
    return user_id

# 创建任务
@app.route('/tasks', methods=['POST'])
def create_task():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': '未授权'}), 401

    data = request.get_json()
    title = data.get('title', '')

    task = Task(user_id=user_id, title=title)
    db.session.add(task)
    db.session.commit()
    return jsonify({
        'id': task.id,
        'title': task.title,
        'completed': task.completed
    }), 201

# 获取所有任务
@app.route('/tasks', methods=['GET'])
def get_tasks():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': '未授权'}), 401

    tasks = Task.query.filter_by(user_id=user_id).all()
    result = []
    for t in tasks:
        result.append({
            'id': t.id,
            'title': t.title,
            'completed': t.completed
        })
    return jsonify(result), 200

# 更新任务
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': '未授权'}), 401

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': '任务不存在'}), 404

    data = request.get_json()
    task.title = data.get('title', task.title)
    task.completed = data.get('completed', task.completed)
    db.session.commit()
    return jsonify({'message': '任务已更新'}), 200

# 删除任务
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': '未授权'}), 401

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': '任务不存在'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': '任务已删除'}), 200

# 测试用
@app.route('/')
def hello():
    with app.app_context():
        db.create_all()  # 创建所有表（如果尚未创建）
    return "Hello from Flask! Tables created if not exist."


if __name__ == '__main__':
    app.run(debug=True)


application = app