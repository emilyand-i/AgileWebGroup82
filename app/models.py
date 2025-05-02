from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.model):
  id = db.Column(db.Integer, primary_key = True) # new users get an id from 1 onwards, unique identifiers for each user
  username = db.Column(db.String(80), unique = True, nullable = False) # no two users can have the same username, cant be left blank
  password = db.Column(db.String(120), nullable = False) # cant be left blank, also.
  
  
  # to create new user model:
  #   new_user = User(username = 'Emily', password = 'AgileWeb123')
  #   db.session.add(new_user)
  #   db.session.commit()
  
  # User: table in database
  # id: unique id fpr each user
  # username: required, must be unique
  # password: required