from flask import Blueprint, request, jsonify
from .models import user_db, User
from flask import session

routes_bp = Blueprint('routes', __name__) # connect all related routes for later

@routes_bp.route('/api/register', methods=['POST']) #post route to /api/register - user sending user and pass data
def register(): # run once fetch request added, once POST to /api/register
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Please enter username and password'})

    if User.query.filter_by(username=username).first(): # check if username already exists
        return jsonify({'error': 'Username already exists'}), 409 # we can use this to send a message back to user that the username is taken

    new_user = User(username=username, password=password) # user is added to our 'user.db' database
    user_db.session.add(new_user)
    user_db.session.commit()

    return jsonify({'message': 'User created'}), 201 # 201 is code for created, use to send back to frontend that somethign was created.


# status code:
  # 201: new resource created
  # 200: general success
  # 400: bad input
  # 401: no authorisation 
  # 409: conflict

@routes_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Please enter username and password'})

    user = User.query.filter_by(username=username, password=password).first()
    if user:
        # store session info
        session['user_id'] = user.id
        session['username'] = user.username
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid details'}), 401
    

@routes_bp.route('/api/profile', methods = ['GET'])
def get_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authorised'}), 401
    
    user  = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'username': user.username, 'id': user.id}), 200