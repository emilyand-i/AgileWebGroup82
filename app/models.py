from flask_sqlalchemy import SQLAlchemy

user_db = SQLAlchemy()

class User(user_db.Model):
  id = user_db.Column(user_db.Integer, primary_key = True) # new users get an id from 1 onwards, unique identifiers for each user
  username = user_db.Column(user_db.String(80), unique = True, nullable = False) # no two users can have the same username, cant be left blank
  password = user_db.Column(user_db.String(120), nullable = False) # cant be left blank, also.

  
  # User: table in user_dbase
  # id: unique id fpr each user
  # username: required, must be unique
  # password: required

  class UserSettings(user_db.Model):
    user_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), primary_key=True, nullable=False)
    is_profile_public = user_db.Column(user_db.Boolean, default=True)
    allow_friend_requests = user_db.Column(user_db.Boolean, default=True)