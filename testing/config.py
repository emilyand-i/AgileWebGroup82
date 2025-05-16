#very basic setup for testing
# NOT TO BE USED IN FINAL OR SUBMITTED LIKE THIS!!!!!!!!!!!!


class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # In-memory DB
    WTF_CSRF_ENABLED = False #should also have tests where this is true
    SECRET_KEY = 'test_secret'


#How to get started: 
#may need to install FACTORY - as seen in the lectures
# pip install pytest flask-testing
# pytest tests/ (to run all current tests - Note they probably won't work at this stage in time)