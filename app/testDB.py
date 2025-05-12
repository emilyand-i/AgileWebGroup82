# testDB.py

from app import routes  # ensures routes (and models) are loaded
from app.models import user_db, User, Plants, PlantGrowthEntry
from run import app
from datetime import date

with app.app_context():
    print("creating all tables")
    user_db.create_all()

    # Create a test user
    if not User.query.filter_by(username='Emily').first():
        emily = User(username='Emily',email='emily@agile.com', password='AgileWeb123')
        user_db.session.add(emily)
        user_db.session.commit()
        print("user 'Emily' created.")

    #Add plant to Emily
    emily = User.query.filter_by(username='Emily').first()
    plant = Plants(user_id=emily.id, plant_name='Aloe Vera', plant_type='Succulent', chosen_image_url='assets/Flower_Avatars/cactus.jpg')
    user_db.session.add(plant)
    user_db.session.commit()
    print("🌿 Test plant added for Emily.")

    # Add growth entry
    growth = PlantGrowthEntry(user_id=emily.id, plant_name='Aloe Vera', date_recorded= date(2025,5,6), cm_grown=5.5)
    user_db.session.add(growth)
    user_db.session.commit()
    print("📈 Growth entry added.")



#draft to run a test to make sure all database tables function correctly

  # to create new USER model:
  #   new_user = User(username = 'Emily', password = 'AgileWeb123')
  #   user_db.session.add(new_user)
  #   user_db.session.commit()

# To create new USER SETTINGS for a user:
#   new_settings = User.UserSettings(
#       user_id = <user_id>,                   # ID of an existing user (must match User.id)
#       is_profile_public = True,              # Optional, defaults to True
#       allow_friend_requests = False          # Optional, defaults to True
#   )
#   user_db.session.add(new_settings)
#   user_db.session.commit()

# To create a new FRIENDS LIST entry (e.g., friend request):
    #   new_friend = FriendsList(
    #       user_id = <requester_user_id>,
    #       friend_id = <target_user_id>,
    #       status = 'pending'  # or 'accepted'
    #   )
    #   user_db.session.add(new_friend)
    #   user_db.session.commit()


    # To create a new PLANTS entry:
    #   new_plant = Plants(
    #       user_id = <owner_user_id>,
    #       plant_name = 'Aloe Vera',
    #       matching_image_url = '<optional_url>',  # ONLY OPTIONAL AT THE MOMENT
                                                    #otherwise should be a link to image from our static folder
    #       plant_type = 'Succulent'
    #   )
    #   user_db.session.add(new_plant)
    #   user_db.session.commit()

    # To create a new UPLOADEDPICS:
    #   new_photo = uploadedPics(
    #       user_id = <user_id>,
    #       plant_id = <plant_id>,
    #       image_url = 'https://example.com/photo.jpg',
    #       caption = 'My cactus thriving!'
    #   )
    #   user_db.session.add(new_photo)
    #   user_db.session.commit()