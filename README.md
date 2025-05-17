AgileWebDev Group82

# 🌱 P L A N T L Y - virtual plant tracker

**Plantly** is an application that allows users to manage and care for their plants using a virtual replica.
You can log your plants growth measurements, upload photos to your album, track changes over time - ensuring you never forget to water them and know exactly what they need!

## Key Features
- Add and manage real plants in your virtual garden
- Upload dated photo updates to monitor growth
- View growth progress with graphs and photos
- Track watering habits and care routines

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

https://github.com/emilyand-i/AgileWebGroup82

-- INSTALLATION -- 