from app import create_app
from app.models import user_db, User, UserSettings, FriendsList

app = create_app()

with app.app_context():
    print("🛠️ Creating tables (if needed)...")
    user_db.create_all()

    # Create Emily
    emily = User.query.filter_by(username='Emily').first()
    if not emily:
        emily = User(username='Emily', email='emily@agile.com', password='AgileWeb123')
        user_db.session.add(emily)
        user_db.session.commit()
        print("👤 Created user: Emily")
    if not UserSettings.query.filter_by(user_id=emily.id).first():
        user_db.session.add(UserSettings(user_id=emily.id))
        user_db.session.commit()
        print("⚙️ Added settings for Emily")

    # Create James
    james = User.query.filter_by(username='James').first()
    if not james:
        james = User(username='James', email='james@agile.com', password='AgileWeb456')
        user_db.session.add(james)
        user_db.session.commit()
        print("👤 Created user: James")
    if not UserSettings.query.filter_by(user_id=james.id).first():
        user_db.session.add(UserSettings(user_id=james.id))
        user_db.session.commit()
        print("⚙️ Added settings for James")

    # Send friend request from James to Emily
    existing_request = FriendsList.query.filter_by(user_id=james.id, friend_id=emily.id).first()
    if not existing_request:
        request = FriendsList(user_id=james.id, friend_id=emily.id, status='pending')
        user_db.session.add(request)
        user_db.session.commit()
        print("🤝 James sent a friend request to Emily.")
    else:
        print("ℹ️ Friend request already exists.")
