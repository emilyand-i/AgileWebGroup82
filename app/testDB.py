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