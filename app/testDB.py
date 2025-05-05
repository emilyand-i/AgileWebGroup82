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