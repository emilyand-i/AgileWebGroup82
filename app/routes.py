from flask import Blueprint, request, jsonify
from .models import *
from flask import session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date, timedelta

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
        return jsonify({'error': 'Please enter username and password'}), 400
    
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        session['username'] = user.username

        # Daily login streak logic
        today = date.today()
        if user.last_login_date == today:
            pass  # Already logged in today, do nothing
        elif user.last_login_date == today - timedelta(days=1):
            user.login_streak += 1  # Consecutive login
            user.last_login_date = today
        else:
            user.login_streak = 1  # Reset streak
            user.last_login_date = today

        user_db.session.commit()

        # Fetch related data (as in the original route)
        settings = UserSettings.query.filter_by(user_id=user.id).first()
        friends = FriendsList.query.filter_by(user_id=user.id).all()
        plants = Plants.query.filter_by(user_id=user.id).all()
        growth_entries = PlantGrowthEntry.query.filter_by(user_id=user.id).all()
        photos = uploadedPics.query.filter_by(user_id=user.id).all()

        plant_data = [{
            'plant_name': plant.plant_name,
            'plant_type': plant.plant_type,
            'chosen_image_url': plant.chosen_image_url,
            'plant_category': plant.plant_category,
            'date_created': plant.date_created,
            'id': plant.id
        } for plant in plants]

        growth_data = [{
            'plant_name': entry.plant_name,
            'date_recorded': entry.date_recorded,
            'cm_grown': entry.cm_grown
        } for entry in growth_entries]

        friends_data = [{
            'user_id': friend.user_id,
            'friend_id': friend.friend_id,
            'friend_username': User.query.get(friend.friend_id).username,
            'status': friend.status
        } for friend in friends]

        photo_data = [{
            'photo_id': pic.photo_id,
            'plant_id': pic.plant_id,
            'image_url': pic.image_url,
            'caption': pic.caption,
            'datetime_uploaded': pic.datetime_uploaded
        } for pic in photos]

        settings_data = {
            'is_profile_public': settings.is_profile_public if settings else True,
            'allow_friend_requests': settings.allow_friend_requests if settings else True
        }

        return jsonify({
            'message': 'Login successful',
            'username': user.username,
            'email': user.email,
            'user_id': user.id,
            'plants': plant_data,
            'growth_entries': growth_data,
            'friends': friends_data,
            'photos': photo_data,
            'settings': settings_data,
            'streak': user.login_streak,
            'last_login_date': str(user.last_login_date)
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    

@routes_bp.route('/api/session', methods = ['GET'])
def session_data():
    print("🔍 Session contents:", dict(session))
    
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Query all needed related data
    settings = UserSettings.query.filter_by(user_id=user.id).first()
    friends = FriendsList.query.filter_by(user_id=user.id).all()
    plants = Plants.query.filter_by(user_id=user.id).all()
    growth_entries = PlantGrowthEntry.query.filter_by(user_id=user.id).all()
    photos = uploadedPics.query.filter_by(user_id=user.id).all()

    # Prepare structured data
    plant_data = [{
        'plant_name': p.plant_name,
        'plant_type': p.plant_type,
        'chosen_image_url': p.chosen_image_url,
        'plant_category': p.plant_category,
        'id': p.id,
        'date_created': p.date_created
    } for p in plants]

    growth_data = [{
        'plant_name': g.plant_name,
        'date_recorded': g.date_recorded,
        'cm_grown': g.cm_grown
    } for g in growth_entries]

    photo_data = [{
        'photo_id': pic.photo_id,
        'plant_id': pic.plant_id,
        'image_url': pic.image_url,
        'caption': pic.caption,
        'datetime_uploaded': pic.datetime_uploaded
    } for pic in photos]

    friends_data = [{
        'user_id': f.user_id,
        'friend_id': f.friend_id,
        'friend_username': User.query.get(f.friend_id).username,
        'status': f.status
    } for f in friends]

    settings_data = {
        'is_profile_public': settings.is_profile_public if settings else True,
        'allow_friend_requests': settings.allow_friend_requests if settings else True
    }

    return jsonify({
        'username': user.username,
        'user_id': user.id,
        'email': user.email,
        'plants': plant_data,
        'growth_entries': growth_data,
        'photos': photo_data,
        'friends': friends_data,
        'settings': settings_data,
        'streak': user.login_streak,
        'last_login_date': str(user.last_login_date)
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
        return jsonify({'error': 'Plantly doesn`t know you'}), 401

    plant_name = data.get('plant_name')
    plant_type = data.get('plant_type')
    chosen_image_url = data.get('chosen_image_url')
    plant_category = data.get('plant_category')

    if not plant_name or not plant_type or not chosen_image_url or not plant_category:
        return jsonify({'error': 'Missing required fields'}), 400

    new_plant = Plants(
        user_id=user_id,
        plant_name=plant_name,
        plant_type=plant_type,
        chosen_image_url=chosen_image_url,
        plant_category=plant_category
    )
    user_db.session.add(new_plant)
    user_db.session.commit()
    

    return jsonify({'message': 'Plant added successfully'}), 201

@routes_bp.route('/api/delete-plant', methods = ['POST'])
def delete_plant():
    data = request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Plantly doesn`t know you'}), 401
    
    plant_name = data.get('plant_name')
    
    if not plant_name:
        return jsonify({'error': "Need plant name"}), 404
    
    plant = Plants.query.filter_by(user_id = user_id, plant_name = plant_name).first()
    if not plant:
        return jsonify({'error': "Plant not found"}), 404
    
    user_db.session.delete(plant)
    user_db.session.commit()
    
    return jsonify({'message': "Plant has been deleted successfully"}), 200

@routes_bp.route('/api/add-friend', methods=['POST'])
def add_friend():
    data = request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    friend_username = data.get('username')
    if not friend_username:
        return jsonify({'error': 'Username is required'}), 400

    friend = User.query.filter_by(username=friend_username).first()
    if not friend:
        return jsonify({'error': 'User not found'}), 404

    # Check if already friends
    existing = FriendsList.query.filter_by(user_id=user_id, friend_id=friend.id).first()
    if existing:
        return jsonify({'message': 'Already friends'}), 200

    # Add friend
    new_friend = FriendsList(user_id=user_id, friend_id=friend.id, status='accepted')
    user_db.session.add(new_friend)
    user_db.session.commit()

    return jsonify({'message': 'Friend added successfully'}), 201

@routes_bp.route('/api/remove-friend', methods=['POST'])
def remove_friend():
    data = request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    friend_id = data.get('friend_id')
    if not friend_id:
        return jsonify({'error': 'Friend ID is required'}), 400

    friend = FriendsList.query.filter_by(user_id=user_id, friend_id=friend_id).first()
    if not friend:
        return jsonify({'error': 'Friend not found'}), 404

    user_db.session.delete(friend)
    user_db.session.commit()

    return jsonify({'message': 'Friend removed successfully'}), 200

@routes_bp.route('/api/search-users', methods=['GET'])
def search_users():
    query = request.args.get('q', '').strip()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    if not query:
        return jsonify({'results': []})

    # Search for users whose usernames contain the query - excluding the current user
    users = User.query.filter(User.username.ilike(f'%{query}%'), User.id != user_id).all()

    # Fetch current user's friends
    current_friends = FriendsList.query.filter_by(user_id=user_id).all()
    friend_ids = {f.friend_id for f in current_friends}

    results = []
    for user in users:
        results.append({
            'user_id': user.id,
            'username': user.username,
            'is_friend': user.id in friend_ids
        })

    return jsonify({'results': results})

@routes_bp.route('/api/settings', methods=['POST'])
def update_settings():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Plantly doesn`t know you'}), 401

    data = request.get_json()
    is_profile_public = data.get('is_profile_public', True)
    allow_friend_requests = data.get('allow_friend_requests', True)

    settings = UserSettings.query.filter_by(user_id=user_id).first()

    if not settings:
        # Create a new settings record if it doesn't exist
        settings = UserSettings(
            user_id=user_id,
            is_profile_public=is_profile_public,
            allow_friend_requests=allow_friend_requests)
        
        user_db.session.add(settings)
    else:
        settings.is_profile_public = is_profile_public
        settings.allow_friend_requests = allow_friend_requests

    user_db.session.commit()

    return jsonify({
        'settings': {
            'is_profile_public': settings.is_profile_public,
            'allow_friend_requests': settings.allow_friend_requests
        }
    }), 200
    
@routes_bp.route('/api/add-photo', methods=['POST'])
def add_photo():
    user_id = session.get('user_id')
    data = request.get_json()
    
    plant_id = data.get('plant_id')
    image_url = data.get('image_url')
    caption = data.get('caption', '')
    
    if not plant_id or not image_url:
        return jsonify({'error': 'Missing plant_id or image_url'}), 400

    new_photo = uploadedPics(
        user_id=user_id,
        plant_id=plant_id,
        image_url=image_url,  # base64 or cloud link
        caption=caption
    )

    user_db.session.add(new_photo)
    user_db.session.commit()
    
    print(f"📸 Uploaded new photo for plant {plant_id} by user {user_id}")

    return jsonify({'message': 'Photo saved', 'photo_id': new_photo.photo_id}), 201


#FOR FLASK SHAREBOARD PAGE - HASNOT BEEN TESTED PROPERLY!!!!!!!!
 #NOTE: limit is hard coded for now, may be changed later (current only collects 9 posts)
@routes_bp.route('/api/update-social', methods=['GET'])
def updateFeed():
    #get the current user's id
    user_id = session.get("user_id")

    # Fetch 9 most recent public posts
    public_posts = user_db.session.query(uploadedPics).order_by(uploadedPics.datetime_uploaded.desc()).limit(9).all()

    # Fetch 9 posts from friends
    #link friend ID to the user ID in photoTable (uploaded friend photos)
    #also ensures friend list is specific to the current user
    friends_posts = user_db.session.query(uploadedPics).join(FriendsList, (FriendsList.friend_id == uploadedPics.user_id)
    & (FriendsList.user_id == user_id)).order_by(uploadedPics.datetime_uploaded.desc()).limit(9).all()

    #returning a jsonified object with the public and friends posts for now
    #may need to be changed later
    #possible that datetime may cause errors - althought I am unsure (to_dict() could cause issues??)
    return jsonify({
        'public_posts': [post.to_dict() for post in public_posts],
        'friends_posts': [post.to_dict() for post in friends_posts]
    }), 200
