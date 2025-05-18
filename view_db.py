# view_db.py

from app import create_app
from app.models import user_db
from app.models import (
    User,
    Plants,
    SharedPlant,
    Notification,
    FriendsList,
    PlantGrowthEntry,
    PlantWaterEntry,
    uploadedPics,
    UserSettings,
)

app = create_app()

with app.app_context():
    print("\n🌱 Users:")
    for u in User.query.all():
        print(f"ID: {u.id}, Username: {u.username}, Email: {getattr(u, 'email', 'N/A')}")

    print("\n🪴 Plants:")
    for p in Plants.query.all():
        print(f"ID: {p.id}, Name: {p.name}, Owner ID: {p.user_id}")

    print("\n📤 Shared Plants:")
    for s in SharedPlant.query.all():
        print(f"Plant ID: {s.plant_id}, From User: {s.shared_by}, To User: {s.shared_with}")

    print("\n🔔 Notifications:")
    for n in Notification.query.all():
        print(f"To: {n.receiver_id}, From: {n.sender_id}, Msg: {n.message}")

    print("\n👥 Friends List:")
    for f in FriendsList.query.all():
        print(f"User: {f.user_id}, Friend: {f.friend_id}, Status: {f.status}")

    print("\n📈 Growth Entries:")
    for g in PlantGrowthEntry.query.all():
        print(f"Plant: {g.plant_id}, Date: {g.date}, Height: {g.height}cm")

    print("\n💧 Watering Entries:")
    for w in PlantWaterEntry.query.all():
        print(f"Plant: {w.plant_id}, Date: {w.date_watered}")

    print("\n🖼️ Uploaded Photos:")
    for p in uploadedPics.query.all():
        print(f"Plant: {p.plant_id}, URL: {p.image_url}")

    print("\n⚙️ User Settings:")
    for s in UserSettings.query.all():
        print(f"User ID: {s.user_id}, Setting: {vars(s)}")