import os
import pytest
from app import create_app
from models import db, Profile, Message, Education

@pytest.fixture
def app():
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
    os.environ["ADMIN_LOGIN_ROUTE"] = "lionel-login"
    os.environ["ADMIN_USER"] = "lionel"
    os.environ["ADMIN_PASSWORD"] = "adoukonou2026"

    app = create_app()
    app.config["TESTING"] = True

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_home_page_language_detection(client):
    # Verify auto FR detection
    response = client.get('/', headers={'Accept-Language': 'fr-FR,fr;q=0.9'})
    assert response.status_code == 200
    assert b"D\xc3\xa9veloppeur Backend" in response.data # French string checked

    # Verify manual override via query param
    response = client.get('/?lang=en')
    assert response.status_code == 200
    assert b"Backend Python" in response.data # English string checked

def test_secret_admin_protection(client):
    # Attempting to access dashboard without login returns 404 (hidden admin)
    response = client.get('/admin')
    assert response.status_code == 404

    # Secret login route is accessible
    response = client.get('/lionel-login')
    assert response.status_code == 200
    assert b"Espace Secr\xc3\xa8te Admin" in response.data

    # Valid login credentials
    response = client.post('/lionel-login', data={
        'username': 'lionel',
        'password': 'adoukonou2026'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Lionel Portfolio Admin" in response.data

    # Accessing dashboard after login is successful
    response = client.get('/admin')
    assert response.status_code == 200
    assert b"Lionel Portfolio Admin" in response.data

def test_contact_submission(client):
    # Submit contact message
    response = client.post('/submit-contact', data={
        'fullname': 'Jean Dupont',
        'email': 'jean.dupont@example.com',
        'message': 'Bonjour Lionel, votre profil est impressionnant !'
    }, follow_redirects=True)
    assert response.status_code == 200

    # Ensure message is stored in DB
    with client.application.app_context():
        msg = Message.query.first()
        assert msg is not None
        assert msg.fullname == 'Jean Dupont'
        assert msg.email == 'jean.dupont@example.com'
        assert msg.message == 'Bonjour Lionel, votre profil est impressionnant !'
