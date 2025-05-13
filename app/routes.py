from flask import Blueprint, request, jsonify
from .models import *
from flask import session

from flask_login import login_required, current_user

from werkzeug.security import generate_password_hash, check_password_hash

from flask_wtf.csrf import generate_csrf




routes_bp = Blueprint('routes', __name__) # connect all related routes for later

@routes_bp.route('/api/csrf-token', methods = ['GET'])
def get_csrf():
    token = generate_csrf()
    return jsonify({'csrf_token': token })


@routes_bp.route('/api/register', methods=['POST']) #post route to /api/register - user sending user and pass data
def register(): # run once fetch request added, once POST to /api/register
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not password or not email:
        return jsonify({'error': 'Please enter username and password'})

    if User.query.filter_by(username=username).first(): # check if username already exists
        return jsonify({'error': 'Username already exists'}), 409 # we can use this to send a message back to user that the username is taken

    if User.query.filter_by(email = email).first():
        return jsonify({'error': 'Email already registered'})

    hashed_pass = generate_password_hash(password)


    new_user = User(username=username, email=email, password=hashed_pass) # user is added to our 'user.db' database
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
    
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        # store session info
        session['user_id'] = user.id
        session['username'] = user.username
        
        settings = UserSettings.query.filter_by(user_id=user.id).first()
        friends = FriendsList.query.filter_by(user_id=user.id).all()
        plants = Plants.query.filter_by(user_id=user.id).all()
        growth_entries = PlantGrowthEntry.query.filter_by(user_id=user.id).all()
        photos = uploadedPics.query.filter_by(user_id=user.id).all()

        plant_data = [
            {
                'plant_name': plant.plant_name,
                'plant_type': plant.plant_type,
                'chosen_image_url': plant.chosen_image_url,
                'date_created': plant.date_created,
                'id': plant.id
            } for plant in plants
        ]

        growth_data = [
            {
                'plant_name': entry.plant_name,
                'date_recorded': entry.date_recorded,
                'cm_grown': entry.cm_grown
            } for entry in growth_entries
        ]
        
        friends_data = [
            {
                'user_id': friend.user_id,
                'friend_id': friend.friend_id,
                'status': friend.status
            } for friend in friends
        ]

        photo_data = [
            {
                'photo_id': pic.photo_id,
                'plant_id': pic.plant_id,
                'image_url': pic.image_url,
                'caption': pic.caption,
                'datetime_uploaded': pic.datetime_uploaded
            } for pic in photos
        ]

        settings_data = {
            'is_profile_public': settings.is_profile_public if settings else True,
            'allow_friend_requests': settings.allow_friend_requests if settings else True,
            'font_size': settings.font_size if settings else 'normal'
        }


        return jsonify({
            'message': 'Login successful',
            'username': user.username,
            'user_id': user.id,
            'plants': plant_data,
            'growth_entries': growth_data,
            'friends': friends_data,
            'photos': photo_data,
            'settings': settings_data
            
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    

@routes_bp.route('/api/session', methods = ['GET'])
def session_data():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error:' 'User not logged in'}), 401
    
    user = User.query.get(user_id)
    settings = UserSettings.query.filter_by(user_id=user.id).first()
    friends = FriendsList.query.filter_by(user_id=user.id).all()
    plants = Plants.query.filter_by(user_id=user.id).all()
    growth_entries = PlantGrowthEntry.query.filter_by(user_id=user.id).all()
    photos = uploadedPics.query.filter_by(user_id=user.id).all()

    return jsonify({
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'plants': [{
            'plant_name': plant.plant_name,
            'plant_type': plant.plant_type,
            'chosen_image_url': plant.chosen_image_url,
            'id': plant.id,
            'date_created': plant.date_created
        } for plant in plants],
        'growth_entries': [{
            'plant_name': growth.plant_name,
            'date_recorded': growth.date_recorded,
            'cm_grown': growth.cm_grown
        } for growth in growth_entries],
        'photos': [{
            'photo_id': pics.photo_id,
            'plant_id': pics.plant_id,
            'image_url': pics.image_url,
            'caption': pics.caption,
            'datetime_uploaded': pics.datetime_uploaded
        } for pics in photos],
        'friends': [{
            'user_id': friend.user_id,
            'friend_id': friend.friend_id,
            'status': friend.status
        } for friend in friends],
        'settings': {
            'is_profile_public': settings.is_profile_public if settings else True,
            'allow_friend_requests': settings.allow_friend_requests if settings else True
        }
    }), 200

@routes_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@routes_bp.route('/api/add-plant', methods=['POST'])
def add_plant():
    data = request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    plant_name = data.get('plant_name')
    plant_type = data.get('plant_type')
    chosen_image_url = data.get('chosen_image_url')

    if not plant_name or not plant_type or not chosen_image_url:
        return jsonify({'error': 'Missing required fields'}), 400

    new_plant = Plants(
        user_id = user_id,
        plant_name = plant_name,
        plant_type = plant_type,
        chosen_image_url = chosen_image_url
    )
    user_db.session.add(new_plant)
    user_db.session.commit()

    return jsonify({'message': 'Plant added successfully'}), 201


#routes for user settings font size
@routes_bp.route('/api/update-font-size', methods=['POST'])
def update_font_size():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    new_font_size = data.get('font_size')

    if new_font_size not in ['small', 'normal', 'large']:
        return jsonify({'error': 'Invalid font size'}), 400

    settings = UserSettings.query.filter_by(user_id=user_id).first()
    if not settings:
        return jsonify({'error': 'Settings not found'}), 404

    settings.font_size = new_font_size
    user_db.session.commit()

    return jsonify({'message': 'Font size updated'}), 200


    #routes for friends list
@routes_bp.route('/api/friends')
#@login_required
def api_friends():
    # Users you've accepted OR have accepted you
    accepted_entries = user_db.session.query(FriendsList).filter(
        (
            (FriendsList.user_id == current_user.id) |
            (FriendsList.friend_id == current_user.id)
        ),
        FriendsList.status == 'accepted'
    ).all()

    accepted_ids = set()
    for entry in accepted_entries:
        if entry.user_id == current_user.id:
            accepted_ids.add(entry.friend_id)
        else:
            accepted_ids.add(entry.user_id)

    accepted_users = user_db.session.query(User).filter(User.id.in_(accepted_ids)).all()

    # Pending friend requests *to you*
    pending_entries = user_db.session.query(FriendsList).filter_by(
        friend_id=current_user.id,
        status='pending'
    ).all()

    pending_user_ids = [entry.user_id for entry in pending_entries]
    pending_users = user_db.session.query(User).filter(User.id.in_(pending_user_ids)).all()

    return jsonify({
        "accepted": [{"id": u.id, "username": u.username} for u in accepted_users],
        "pending": [{"id": u.id, "username": u.username} for u in pending_users]
    })
#add post endpoints for accept/ decline and remove friends

#send friend request 
@routes_bp.route('/api/friend-request', methods=['POST'])
#@login_required
def send_friend_request():
    data = request.get_json()
    target_username = data.get("username", "").strip()

    if not target_username:
        return jsonify({"success": False, "error": "Username is required"}), 400

    if target_username == current_user.username:
        return jsonify({"success": False, "error": "You can't friend yourself"}), 400

    target_user = User.query.filter_by(username=target_username).first()
    if not target_user:
        return jsonify({"success": False, "error": "User not found"}), 404

    settings = UserSettings.query.filter_by(user_id=target_user.id).first()
    if settings and not settings.allow_friend_requests:
        return jsonify({"success": False, "error": "User is not accepting friend requests"}), 403

    existing = FriendsList.query.filter(
        ((FriendsList.user_id == current_user.id) & (FriendsList.friend_id == target_user.id)) |
        ((FriendsList.user_id == target_user.id) & (FriendsList.friend_id == current_user.id))
    ).first()

    if existing:
        return jsonify({"success": False, "error": f"Friend status already exists: {existing.status}"}), 409

    new_request = FriendsList(
        user_id=current_user.id,
        friend_id=target_user.id,
        status='pending'
    )

    user_db.session.add(new_request)
    user_db.session.commit()

    return jsonify({"success": True, "message": "Friend request sent"}), 201
#accept friend request
@routes_bp.route('/api/friends/accept/<int:user_id>', methods=['POST'])
#@login_required
def accept_friend(user_id):
    request_entry = FriendsList.query.filter_by(
        user_id=user_id,
        friend_id=current_user.id,
        status='pending'
    ).first()

    if not request_entry:
        return jsonify({'error': 'Friend request not found'}), 404

    request_entry.status = 'accepted'
    user_db.session.commit()

    return jsonify({'message': 'Friend request accepted'}), 200
#decline friend request
@routes_bp.route('/api/friends/decline/<int:user_id>', methods=['POST'])
#@login_required
def decline_friend(user_id):
    request_entry = FriendsList.query.filter_by(
        user_id=user_id,
        friend_id=current_user.id,
        status='pending'
    ).first()

    if not request_entry:
        return jsonify({'error': 'Friend request not found'}), 404

    user_db.session.delete(request_entry)
    user_db.session.commit()

    return jsonify({'message': 'Friend request declined'}), 200
#remove friend
@routes_bp.route('/api/friends/remove/<int:user_id>', methods=['POST'])
#@login_required
def remove_friend(user_id):
    entry = FriendsList.query.filter(
        ((FriendsList.user_id == current_user.id) & (FriendsList.friend_id == user_id)) |
        ((FriendsList.user_id == user_id) & (FriendsList.friend_id == current_user.id)),
        FriendsList.status == 'accepted'
    ).first()

    if not entry:
        return jsonify({'error': 'Friendship not found'}), 404

    user_db.session.delete(entry)
    user_db.session.commit()

    return jsonify({'message': 'Friend removed'}), 200
#serch for users 
@routes_bp.route('/api/search-users')
def search_users():
    query = request.args.get('q', '').strip()

    user_id = session.get('user_id')   # ✅ Get logged-in user ID from session
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401

    if not query:
        return jsonify([])

    # ✅ Exclude self from results
    results = User.query.filter(
        User.username.ilike(f'%{query}%'),
        User.id != user_id
    ).limit(10).all()

    return jsonify([
        {'id': user.id, 'username': user.username}
        for user in results
    ])

from flask import current_app, send_from_directory

@routes_bp.route('/')
def serve_index():
    return send_from_directory(current_app.static_folder, 'index.html')