import os
from app import create_app
from models import db

app = create_app()

with app.app_context():
    # Initialize SQLite database file and tables
    db.create_all()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
