AgileWebDev Group82

# 🌱 P L A N T L Y - virtual plant tracker

**Plantly** provides an engaging, user-friendly platform for plant lovers to help users track, manage, and visually monitor the growth and care of their plants. It combines practical plant tracking tools with a social community.
It supports features like photo journaling, logging your plants growth measurements with growth graphing, social interactions like adding friends, and daily watering updates. 


## Key Features
🌱 Plant Management
- Add new plants to your virtual garden with unique names and metadata
- Switch between active plants via a responsive UI tab interface
- Track individual growth and watering stats per plant.

📸 Photo Upload & Journal
- Upload and view unique photos per plant
- Add optional comments to each photo for journaling and notetaking 
- Display photos using a fun & responsive Bootstrap carousel

📊 Growth Graphs
- Record plant height over time
- Dynamically draw line graphs using Chart.js
- Visually display growth progression over recorded dates

💧 Watering Tracker
- Track days when each plant is watered
- Render visual "water marks" in a graph-like form
- Optional future feature: reminders or watering frequency analysis

👥 Find & Add Friends
- Browse a list of other registered users (excluding self)
- Add friends to share growth progress, gardening tips and updates with
- See which users are public/accepting requests

🔐 User Accounts & Sessions
- Register and log in securely
- Username and email are unique to one user - cannot create an account with the same of either
- All plant data is user-specific and session-protected
- Session-based CSRF protection for all actions

💻 Technologies 💻

🚀 Frontend:
- HTML5 + CSS3 + Bootstrap 5
- JavaScript for interactivity
- Chart.js for rendering graphs

⚙️ Backend
- Python (Flask framework)
- Jinja2 templating (for some sections)
- RESTful API endpoints for dynamic frontend fetching

🗄️ Database
- SQLAlchemy ORM
- SQLite or PostgreSQL (depending on deployment)
- Models:
  - User
  - Plant
  - PlantGrowthEntry
  - UploadedPics
  - SharedPlants
  - Notifications



-- MEMBERS --

- Andoni (24314657) GIT: Donaks1
- Eli (student_id)
- Emily (23723242) GIT: emilyand-i
- Luke (23814635) GIT: alligator-byte

-- Virtual Environment Setup --
- Make sure Python3 installed
- Run 'python3 -m venv venv' from project root directory (creates venv folder) NOTE: If you call your environment something else, make sure you dont push the file to the repo. You can add it to the .gitignore folder for simplicity - I learnt this the hard way lol
- Activate the virtual environment with 'source venv/bin/activate' ('venv/Scripts/activate' for windows)
- run 'pip install -r requirements.txt' to install everything you need for Flask
- run the seed script: python seed_users.py
- run the app with 'python run.py' (add /static/index.html to the end of the URL) 

For users.db
- flask shell
from app import create_app
from app.models import user_db
app = create_app()
with app.app_context():
..  user_db.create_all()
..

To see the table of users:
(the database will go into instance/ folder - we can change this but for ease ill just leave it like that)
- run sqlite3 instance/users.db (inside virtual environemnt )
- .tables and you should see user table
- then you can run any SQL statements to get  the data you want
- .exit to exit sql

## Note:
I will remove all of these steps before submission as I dont think they are necessary 


-- LINK TO PAGE --


-- INSTALLATION -- 



