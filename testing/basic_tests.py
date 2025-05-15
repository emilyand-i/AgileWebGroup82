import unittest
from app import create_app, user_db


#examples of tests to be run on our app
class BasicTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('test')  # Pass a config name if you have factory
        self.client = self.app.test_client()

        with self.app.app_context():
            user_db.create_all()

    def tearDown(self):
        with self.app.app_context():
            user_db.session.remove()
            user_db.drop_all()

    def test_homepage_loads(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    #an example more related to our app currently
    def test_update_social(self):
        response = self.client.get('/api/update-social')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('public_posts', data)
        self.assertIsInstance(data['public_posts'], list)

