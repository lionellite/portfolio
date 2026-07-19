import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key-change-it-in-prod")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///portfolio.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Custom admin configuration
    ADMIN_LOGIN_ROUTE = os.environ.get("ADMIN_LOGIN_ROUTE", "lionel-login")
    ADMIN_USER = os.environ.get("ADMIN_USER", "lionel")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "adoukonou2026")

    # Upload folder
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "svg", "ico"}
