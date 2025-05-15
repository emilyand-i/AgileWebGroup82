from flask import Blueprint, request, jsonify
from .models import *
from flask import session
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
                'plant_category': plant.plant_category,
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
            'plant_category': plant.plant_category,
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
        return jsonify({'error': 'Unauthorized'}), 401
    
    plant_name = data.get('plant_name')
    
    if not plant_name:
        return jsonify({'error': "Need plant name"}), 404
    
    plant = Plants.query.filter_by(user_id = user_id, plant_name = plant_name).first()
    if not plant:
        return jsonify({'error': "Plant not found"}), 404
    
    user_db.session.delete(plant)
    user_db.session.commit()
    
    return jsonify({'message': "Plant has been deleted successfully"}), 200


#demo for flask shareboard content. Needs to be updated with actual matching data
#I'm still trying to wrap my head around flask logic
@app.route('/shareboard')
def manageUI():
    user_id = session.get("user_id")

    # Fetch 9 most recent public posts
    all_posts = get_recent_posts(limit=9)

    # Fetch 9 posts from friends (you'll need to filter this in your db logic)
    friends_posts = get_friend_posts(user_id, limit=9)

    return render_template("community.html", all_posts=all_posts, friends_posts=friends_posts)