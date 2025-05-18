# 🌱 P L A N T L Y 🌱

## Table of Contents
- [About](#-about-the-project)
- [Key Features](#-key-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Team Members](#-team-members)
- [Technical Setup](#-technical-setup)


## 🪴  About The Project  🪴

**Plantly** is your cozy corner of the internet for all things green and growing. Whether you're a first time plant parent or have a thriving indoor jungle, Plantly helps you nurture your plants with care and creativity. Create a digital garden that mirrors your real one, keep track of how tall your plant babies grow with visual line graphs, and save memories in a photo timeline. Remember your watering habits with graph timelines, and share your favorite leaves and moments with friends who love plants as much as you do.

<div align="center">
  <img src="app/static/assets/cartoonRed.png" alt="Dashboard View" width="300px">

## Built With

* [![HTML5][HTML5.com]][HTML5-url]
* [![CSS3][CSS3.com]][CSS3-url]
* [![JavaScript][JavaScript.com]][JavaScript-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Flask][Flask.com]][Flask-url]
* [![SQLite][SQLite.com]][SQLite-url]

</div>



## Key Features

### 🪴 Plant Management 🪴 

Replicate your real-life plants into a personal digital garden

Specify the type and category 

### 🌱 Growth Tracking 🌱

Users can log plant growth entries over time

Display plant growth over time using dynamic line graphs

### 💧 Water Tracking 💧

Input days you have watered your plants

Visualise watering frequency and patterns in graph form

### 🖼️ Photo Uploads 🖼️

Users can upload photos of their plants

Photos appear in a carousel gallery within the plant tab

### 🌿 User Accounts 🌿

Users can register, log in, and maintain session-based access

Session-based routes protected via Flask session

### 🌸 Friend System 🌸 
Users can search for and add friends by username

Friend list is dynamically rendered

Friend-add action prevents duplicates and self-add


## 🔧 Installation

Prerequisites
Python 3.9 or higher
Git (for cloning the repository)
pip (Python package manager)

Step 1: Clone the Repository

git clone https://github.com/emilyand-i/AgileWebGroup82.git
cd AgileWebGroup82

Step 2: Set Up Virtual Environment
```sh
# Create virtual environment
python3 -m venv venv

# Activate virtual environment

# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

Step 3: Install Dependencies
```sh
pip install -r requirements.txt
```

Step 4: Initialize the Database
```sh
# Start Flask shell
flask shell

# In the Flask shell, run:
from app import create_app
from app.models import user_db
app = create_app()
with app.app_context():
    user_db.create_all()

# Exit the shell with Ctrl+D
```
Step 5: Populate the Database with Users
```sh
python seed_users.py
```

Step 6: View DB (optional)
```sh
# View database to ensure it has been updated with users
python view_db.py

# OR 

# Access the SQLite database
sqlite3 instance/users.db

# View available tables
.tables

# Run SQL queries as needed
SELECT * FROM user;

# Exit SQLite
.exit
```

Step 7: Run the Application
```sh
python run.py
```
Step 8: Access the Application
Open your web browser and navigate to:
```sh
http://127.0.0.1:5000/static/index.html
```

## 🌻 Usage 🌻

**Getting Started**

1. Create an Account or Log In
- Navigate to the login page
- Create a new account or use existing credentials
- Default test account: username: test, password: admin

**Plant Management**

1. Add a New Plant
- Click the "+" button in your garden dashboard
- Fill in plant details (name, species, etc)
- Choose an avatar

2. View Plant Details
- Click on any plant tab in your garden
- View detailed information, growth history, watering history and photos gallery

**Growth Tracking**

1. Log Growth Measurements
- Select a plant and navigate to "add" tab
- Click "Add Graph" to record new measurements
- Enter height and date (can enter older dates if you missed a day)

2. View Growth Charts
- Access visual representations of growth over time

**Photo Management**

1. Upload Plant Photos
- Select a plant and navigate to "add" tab
- Click "Add Photo" button
- Choose image from your device
- Add optional caption and date

2. View Photo Timeline
- Browse chronological photo history
- Click images to view in full screen
- Use arrow controls to navigate between photos
- or allow photos to automatically rotate through 

**Friend System**

1. Add Friends
- Navigate to "Add Friends" section
- Search for users by username
- Send friend requests

2. Share Plants
- Select a plant tab
- Choose friends from your list 
- Click share button next to their name



## 👥 Team Members
### AgileWebDev Group82

| Name   | Student ID | GitHub Username  |
|--------|------------|------------------|
| Andoni | 24314657   | Donaks1          |
| Eli    | 23104886   | Eli-Rosenberg    |
| Emily  | 23723242   | emilyand-i       |
| Luke   | 23814635   | alligator-byte   |



## 💻 Technical Setup
- **Backend:** Python 3.9+, Flask web framework
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap
- **Database:** SQLite (default, located in `instance/users.db`)
- **Project Structure:**
  - `app/` — Main Flask application (models, routes, init)
  - `app/static/` — Static files (HTML, CSS, JS, images)
  - `requirements.txt` — Python dependencies
  - `run.py` — Application entry point
  - `seed_users.py` — Script to populate the database with users
- **Virtual Environment:**
  - Recommended to use Python virtual environment (`venv`) for dependency management
- **Testing:**
  - Basic tests in `testing/` directory
- **How to Run:**
  - Activate virtual environment
  - Install dependencies with `pip install -r requirements.txt`
  - Initialize the database as per installation instructions
  - Start the app with `python run.py`
- **Access:**
  - Open `http://127.0.0.1:5000/static/index.html` in your browser

For more details, see the Installation and Usage sections above.


## Link to repo

https://github.com/emilyand-i/AgileWebGroup82



<!--Links & Images -->

[HTML5.com]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/en-US/docs/Web/HTML
[CSS3.com]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[JavaScript.com]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Flask.com]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/
[SQLite.com]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[SQLite-url]: https://www.sqlite.org/index.html
