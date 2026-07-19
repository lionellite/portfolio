# 🌟 Portfolio Dynamique & Espace d'Administration Secret — Lionel Adoukonou

Ce projet est un portfolio professionnel sur mesure développé pour **Lionel Adoukonou**, basé sur son CV premium, le design raffiné du template **vcard-personal-portfolio** (thème sombre élégant avec accents dorés), et enrichi d'un **système d'administration complet et invisible** sous Python Flask & SQLite.

---

## 🚀 Fonctionnalités Clés / Key Features

### 🇫🇷 🇬🇧 Bilingue par défaut (Bilingual by Default)
*   **Détection automatique** de la langue préférée via l'en-tête de requête HTTP `Accept-Language` du navigateur (Français par défaut).
*   **Sélecteur manuel** (FR / EN) flottant et élégant en haut à gauche de la page.
*   **Persistance de la langue** sélectionnée dans la session Flask pour garantir une expérience utilisateur fluide lors du parcours du portfolio.

### 🛡️ Espace Secrète Admin Dissimulé (Secure-by-Obscurity Admin Portal)
*   **Conception ultra-sécurisée** : L'accès à la page de connexion s'effectue via une route dynamique entièrement configurable par variable d'environnement (`ADMIN_LOGIN_ROUTE`, par défaut `/lionel-login`).
*   **Incognito total (404 Not Found)** : Toute requête vers `/admin` ou vers les actions CRUD sans authentification retourne un statut HTTP **404 (Introuvable)** plutôt qu'un 403 (Interdit) ou une redirection de connexion standard. Cela dissimule totalement l'existence de l'interface d'administration aux yeux d'éventuels attaquants ou curieux.
*   **Contrôle CRUD complet** pour toutes les sections :
    *   **Profil / Identité** (Modifier le nom, les titres bilingues, la bio bilingue, l'adresse email, le numéro de téléphone, les liens LinkedIn / GitHub et téléverser un nouvel avatar).
    *   **Formations (Education)**.
    *   **Expériences professionnelles** (gère des listes à puces dynamiques stockées au format JSON).
    *   **Compétences (Skills)**.
    *   **Projets** (Ajouter/modifier un projet avec titre, stack, description bilingue, téléversement de fichier image ou lien URL d'image, liens GitHub/Démo et ordre d'affichage).
    *   **Articles de Blog** (Créer/éditer des articles bilingues).
    *   **Boîte de réception des messages** (Consulter et supprimer les messages reçus via le formulaire de contact public).

### 🎨 Design Premium Dark & Gold
*   Adaptation parfaite de la palette de couleurs dorée et sombre (`bg-cv`, doré accent `#C9A96E`, texte clair `#F0ECE3`, cartes `#222222`).
*   Intégration d'effets visuels soignés, d'animations responsives, d'un formulaire de contact asynchrone avec alertes dynamiques (flash messages), et d'icônes vectorielles.

---

## 🛠️ Stack Technique / Tech Stack

*   **Backend** : Python 3.12, Flask, Flask-SQLAlchemy (ORM)
*   **Base de données** : SQLite (légère, autonome et intégrée)
*   **Frontend** : HTML5, CSS3, JavaScript (Jinja2 Templates, Tailwind CSS/Styles personnalisés optimisés)
*   **Sécurité** : `Werkzeug` (`secure_filename` pour les téléversements)

---

## 💻 Installation & Lancement / Quick Start

### 1. Cloner le dépôt et entrer dans le dossier
```bash
git clone <url-du-depot>
cd portfolio
```

### 2. Créer et activer l'environnement virtuel
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```
*(Note : Si le fichier `requirements.txt` n'est pas présent, installez les dépendances directement via : `pip install Flask Flask-SQLAlchemy python-dotenv`)*

### 4. Configurer les variables d'environnement
Copiez le fichier exemple `.env.example` vers `.env` et ajustez les paramètres d'administration secrets :
```bash
cp .env.example .env
```

Contenu typique du fichier `.env` :
```env
SECRET_KEY=une-cle-securisee-et-unique
DATABASE_URL=sqlite:///instance/portfolio.db

# Configuration d'accès secret à l'administration
ADMIN_LOGIN_ROUTE=ma-route-secrete-lionel
ADMIN_USER=lionel
ADMIN_PASSWORD=adoukonou2026
```

### 5. Lancement de l'application
Démarrez le serveur Flask en exécutant le script `run.py` :
```bash
python run.py
```
*   **Base de données auto-initialisée** : Si la base de données est vide au premier lancement, l'application exécute automatiquement le script de peuplement (`seeds.py`) pour injecter instantanément l'intégralité du CV de Lionel.
*   **Portfolio public** : Disponible à l'adresse [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
*   **Espace Secret de Connexion** : Disponible à l'adresse [http://127.0.0.1:5000/ma-route-secrete-lionel](http://127.0.0.1:5000/ma-route-secrete-lionel) (selon votre valeur configurée pour `ADMIN_LOGIN_ROUTE`).

---

## 🧪 Tests Automatisés / Testing

Le projet est fourni avec une suite de tests unitaires et d'intégration validant les fonctionnalités critiques (détection de la langue, protection hermétique de l'espace admin, soumission des formulaires de contact).

Pour exécuter les tests :
```bash
PYTHONPATH=. pytest tests/
```

---

## 📂 Structure du Projet / Directory Structure

```
├── app.py                  # Initialisation de l'application Flask et routes du portfolio / admin
├── config.py               # Gestion de la configuration et des variables d'environnement (.env)
├── models.py               # Schéma de base de données SQLAlchemy (bilingue)
├── run.py                  # Point d'entrée de l'application Flask
├── seeds.py                # Script de seeding automatique (CV de Lionel Adoukonou)
├── .env.example            # Fichier d'exemple pour la configuration locale
├── static/
│   ├── css/                # Feuilles de styles (style.css d'origine)
│   ├── js/                 # Scripts interactifs de l'interface (script.js)
│   ├── images/             # Icônes et images statiques d'origine
│   └── uploads/            # Dossier dynamique pour stocker les avatars et images de projets téléversés
├── templates/
│   ├── public/
│   │   └── index.html      # Vue publique principale du portfolio responsive bilingue
│   └── admin/
│       ├── login.html      # Page de connexion secrète élégante
│       └── dashboard.html  # Panneau de contrôle complet pour gérer tout le site (CRUD)
└── tests/
    └── test_portfolio.py   # Suite de tests automatisée pour le routage et la sécurité
```
