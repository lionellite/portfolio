import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, default="Lionel Adoukonou")
    title_fr = db.Column(db.String(150), nullable=False)
    title_en = db.Column(db.String(150), nullable=False)
    sub_title_fr = db.Column(db.String(150))
    sub_title_en = db.Column(db.String(150))
    bio_fr = db.Column(db.Text, nullable=False)
    bio_en = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(120), nullable=False, default="liolisena@gmail.com")
    linkedin = db.Column(db.String(200), default="https://linkedin.com/in/lionellite")
    github = db.Column(db.String(200), default="https://github.com/lionellite")
    location_fr = db.Column(db.String(100), default="Bénin")
    location_en = db.Column(db.String(100), default="Benin")
    birthday_fr = db.Column(db.String(100), default="23 Juin, 2002")
    birthday_en = db.Column(db.String(100), default="June 23, 2002")
    phone = db.Column(db.String(50), default="+229 00 00 00 00")
    avatar = db.Column(db.String(300)) # Path to uploaded/static avatar

class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    degree_fr = db.Column(db.String(200), nullable=False)
    degree_en = db.Column(db.String(200), nullable=False)
    institution_fr = db.Column(db.String(200), nullable=False)
    institution_en = db.Column(db.String(200), nullable=False)
    period = db.Column(db.String(100), nullable=False) # e.g. "2023 - 2026"
    details_fr = db.Column(db.Text)
    details_en = db.Column(db.Text)
    sort_order = db.Column(db.Integer, default=0)

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_fr = db.Column(db.String(200), nullable=False)
    title_en = db.Column(db.String(200), nullable=False)
    company_fr = db.Column(db.String(200))
    company_en = db.Column(db.String(200))
    period = db.Column(db.String(100), nullable=False) # e.g. "Février 2026 – présent"
    bullets_fr = db.Column(db.Text) # Stored as JSON string or newline-separated
    bullets_en = db.Column(db.Text) # Stored as JSON string or newline-separated
    sort_order = db.Column(db.Integer, default=0)

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_fr = db.Column(db.String(100), nullable=False)
    category_en = db.Column(db.String(100), nullable=False)
    skills_fr = db.Column(db.Text, nullable=False) # e.g. "Linux, Docker, ..."
    skills_en = db.Column(db.Text, nullable=False)
    percentage = db.Column(db.Integer, default=80)
    sort_order = db.Column(db.Integer, default=0)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    stack = db.Column(db.String(200))
    desc_fr = db.Column(db.Text, nullable=False)
    desc_en = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default="web development") # e.g. "web design", "applications", "web development"
    image = db.Column(db.String(300))
    github_link = db.Column(db.String(300))
    demo_link = db.Column(db.String(300))
    sort_order = db.Column(db.Integer, default=0)

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_fr = db.Column(db.String(250), nullable=False)
    title_en = db.Column(db.String(250), nullable=False)
    category_fr = db.Column(db.String(100))
    category_en = db.Column(db.String(100))
    date_fr = db.Column(db.String(100)) # e.g. "23 Fév. 2026"
    date_en = db.Column(db.String(100)) # e.g. "Feb 23, 2026"
    content_fr = db.Column(db.Text, nullable=False)
    content_en = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(300))
    sort_order = db.Column(db.Integer, default=0)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
