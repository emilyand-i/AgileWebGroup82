# Instance of of Flask class

from flask import Flask
from .models import user_db

def create_app():
  app = Flask(__name__, static_folder = 'static') # app is our web server now
  app.config['SECRET_KEY'] = 'AgileWeb_group82' # secret key for encryption and security
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db' # create database called 'users.db' in this folder to store user accounts
  
  user_db.init_app(app) # Connect database object to flask app
  
  from .routes import routes_bp
  app.register_blueprint(routes_bp)

  return app