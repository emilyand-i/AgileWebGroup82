from flask import Blueprint, request, jsonify
from .models import *
from flask import session
from flask_login import login_required, current_user

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
            'allow_friend_requests': settings.allow_friend_requests if settings else True
            'font_size': settings.font_size if settings else 'normal'
        }


        return jsonify({
            'message': 'Login successful',
            'username': user.username,
            'user_id': user.id,
            'plants': plant_data,
            'growth_entries': growth_data,
            'settings': settings_data
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@routes_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@routes_bp.route('/api/add-plant', methods=['POST'])
def add_plant():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    plant_name = data.get('plant_name')
    plant_type = data.get('plant_type')
    chosen_image_url = data.get('chosen_image_url')

    if not plant_name or not plant_type:
        return jsonify({'error': 'Missing plant name or type'}), 400

    new_plant = Plants(
        user_id=user_id,
        plant_name=plant_name,
        plant_type=plant_type,
        chosen_image_url=chosen_image_url
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
@app.route('/api/friends')
@login_required
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
@app.route('/api/friends')
@login_required
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

