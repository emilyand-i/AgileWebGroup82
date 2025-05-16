from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

user_db = SQLAlchemy()

from datetime import date

  
# User: table in user_db
# id: unique id fpr each user
# username: required, must be unique
# password: required

class User(user_db.Model):
  __tablename__ = 'user'
  id = user_db.Column(user_db.Integer, primary_key = True) # new users get an id from 1 onwards, unique identifiers for each user
  username = user_db.Column(user_db.String(80), unique = True, nullable = False) # no two users can have the same username, cant be left blank
  email = user_db.Column(user_db.String(120), unique = True, nullable = False)
  password = user_db.Column(user_db.String(120), nullable = False) # cant be left blank, also.
  last_login_date = user_db.Column(user_db.Date, nullable=True)
  login_streak = user_db.Column(user_db.Integer, default=0)

#User Settings: table in user_db
# user_id: foreign key to User table, links to the id of the user
# is_profile_public: boolean, by default True, if True, profile is public
# allow_friend_requests: boolean, by default True, if True, user can receive friend requests

class UserSettings(user_db.Model):
  __tablename__ = 'user_settings'
  user_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), primary_key=True, nullable=False)
  is_profile_public = user_db.Column(user_db.Boolean, default=True)
  allow_friend_requests = user_db.Column(user_db.Boolean, default=True)
  

#Friends List: table in user_db
# user_id: foreign key to User table, links to the id of the user who sent the friend request
# friend_id: foreign key to User table, links to the id of the user who received the friend request
# status: string, can be 'pending' or 'accepted', by default 'pending' until accepted


#IMPORTANT NOTE: THIS SHOULD WORK LIKE FOLLOWERS - SHOULDN"T HAVE PENDING REQUESTS!
class FriendsList(user_db.Model):
  __tablename__ = 'friends_list'
  user_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), primary_key=True)
  friend_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), primary_key=True)
  status = user_db.Column(user_db.String(20), nullable=False, default='pending')

# Plants: table in user_db
# id: unique id for each plant
# user_id: foreign key to User table, links to the id of the user who owns the plant
# plant_name: string, name of the plant, required
# chosen_image_url: string, URL of the plant image, optional

class Plants(user_db.Model):
  __tablename__ = 'plants'
  id = user_db.Column(user_db.Integer, primary_key=True)
  user_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), nullable=False)
  plant_name = user_db.Column(user_db.String(100), nullable=False) #100 characters max
  chosen_image_url = user_db.Column(user_db.String(255)) #255 characters max
  plant_type = user_db.Column(user_db.String(50)) #50 characters max
  date_created = user_db.Column(user_db.DateTime, default=user_db.func.now()) 
  plant_category = user_db.Column(user_db.String(100), nullable = True)


# uploadedPics: table in user_db
# photo_id: unique id for each photo (to be used in shared page to display them seperately)
# user_id: foreign key to User table, links to the id of the user who uploaded the photo
# (will also factor into the public/private setting of the user later on on shareboard page)
# plant_id: foreign key to Plants table, links to the id of the plant, required
# image_url: string, URL of the uploaded image, required
# caption: string, optional caption for the image, optional
# datetime_uploaded: date and time when the image was uploaded, default is the current date and time
# (this will be used to sort the images in the shareboard page, so that the most recent ones are at the top)

class uploadedPics(user_db.Model):
  __tablename__ = 'uploaded_pics'
  photo_id = user_db.Column(user_db.Integer, primary_key=True)
  user_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), nullable=False)
  plant_id = user_db.Column(user_db.Integer, user_db.ForeignKey('plants.id'), nullable=False)
  image_url = user_db.Column(user_db.String(255), nullable=False)
  caption = user_db.Column(user_db.String(255))
  datetime_uploaded = user_db.Column(user_db.DateTime, default=user_db.func.now())

# Included this as datetime may cause errors when converting to JSON later
  def to_dict(self):
        return {
            "photo_id": self.photo_id,
            "user_id": self.user_id,
            "plant_id": self.plant_id,
            "image_url": self.image_url,
            "caption": self.caption,
            "datetime_uploaded": self.datetime_uploaded.isoformat() if self.datetime_uploaded else None
        }

class PlantGrowthEntry(user_db.Model):
  __tablename__ = 'plant_growth_entry'
  id = user_db.Column(user_db.Integer, primary_key=True)
  user_id = user_db.Column(user_db.Integer, user_db.ForeignKey('user.id'), nullable=False)
  plant_name = user_db.Column(user_db.String(100), nullable=False)  # same as JS `plantName`
  date_recorded = user_db.Column(user_db.Date, nullable=False)      # same as JS `plantDate`
  cm_grown = user_db.Column(user_db.Float, nullable=False)          # same as JS `plantHeight`

# To create a new GROWTH ENTRY for a plant:
#   new_entry = PlantGrowthEntry(
#       user_id = <user_id>,
#       plant_name = 'Sunflower',
#       date_recorded = datetime.date(2025, 5, 5),
#       cm_grown = 4.2
#   )
#   user_db.session.add(new_entry)
#   user_db.session.commit()