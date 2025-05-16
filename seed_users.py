from app import create_app
from app.models import user_db, User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Create tables (if not already created)
    user_db.create_all()

    # Define 10 unique users
    users = [
        {"username": "matthew", "email": "matthew@plantly.com", "password": "password1"},
        {"username": "andoni", "email": "andoni@plantly.com", "password": "password2"},
        {"username": "eli", "email": "eli@plantly.com", "password": "password3"},
        {"username": "emily", "email": "emily@plantly.com", "password": "password4"},
        {"username": "luke", "email": "luke@plantly.com", "password": "password5"},
        {"username": "frank", "email": "frank@plantly.com", "password": "password6"},
        {"username": "mario", "email": "mario@plantly.com", "password": "password7"},
        {"username": "heidi", "email": "heidi@plantly.com", "password": "password8"},
        {"username": "ivan", "email": "ivan@plantly.com", "password": "password9"},
        {"username": "judy", "email": "judy@plantly.com", "password": "password10"}
    ]

    # Insert each user into the database
    for user_data in users:
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            password=generate_password_hash(user_data["password"])
        )
        user_db.session.add(user)
    user_db.session.commit()

    print("Seeded database with 10 test users")