import unittest
from app import create_app, user_db
from app.models import User

#should run with this: python -m unittest tests/test_basic.py

#Basic Checks intended for the introductary view (index.html)
class BasicTestCase(unittest.TestCase):
    # Create a test version of your app with the test configuration
    def setUp(self):
        self.app = create_app('test')  # REPLACE WITH  config name if we use have factory done the road
        self.client = self.app.test_client()

        #set the context of the app
        with self.app.app_context():
            user_db.create_all()


    # Function to clean up after each test (keep the tests isolated)
    def tearDown(self):
        with self.app.app_context():
            user_db.session.remove()
            user_db.drop_all()

    def test_homepage_loads(self):
        #This test checks if the homepage loads successfully and if it responds
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        #Checks that the phrase “Welcome to Plantly!” appears somewhere in the page’s HTML
        self.assertIn(b'Welcome to Plantly!', response.data)

    #Two functions below are basic "smoke tests" to check if the login and signup forms are present
    def test_login_form_present(self):
        response = self.client.get('/')
        self.assertIn(b'id="login-form"', response.data)
        self.assertIn(b'Username', response.data)

    def test_signup_form_present(self):
        response = self.client.get('/')
        self.assertIn(b'id="signup-form"', response.data)
        self.assertIn(b'Confirm Password', response.data)


    #an example more related to our app currently
    #THIS IS RELATED TO SHAREBOARD AND SHOULD BE MOVED TO A DIFFERENT TEST FILE
    def test_update_social(self):
        response = self.client.get('/api/update-social')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('public_posts', data)
        self.assertIsInstance(data['public_posts'], list)






    