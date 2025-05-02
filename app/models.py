from flask_sqlalchemy import SQLAlchemy

user_db = SQLAlchemy()

class User(user_db.Model):
  id = user_db.Column(user_db.Integer, primary_key = True) # new users get an id from 1 onwards, unique identifiers for each user
  username = user_db.Column(user_db.String(80), unique = True, nullable = False) # no two users can have the same username, cant be left blank
  password = user_db.Column(user_db.String(120), nullable = False) # cant be left blank, also.
  
  
  # to create new user model:
  #   new_user = User(username = 'Emily', password = 'AgileWeb123')
  #   user_db.session.add(new_user)
  #   user_db.session.commit()
  
  # User: table in user_dbase
  # id: unique id fpr each user
  # username: required, must be unique
  # password: required