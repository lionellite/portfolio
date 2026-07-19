import os
import json
from flask import Flask, request, render_template, redirect, url_for, session, flash, abort
from werkzeug.utils import secure_filename
from config import Config
from models import db, Profile, Education, Experience, Skill, Project, BlogPost, Message
from seeds import seed_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize SQLAlchemy
    db.init_app(app)

    # Custom template filters
    @app.template_filter('from_json')
    def from_json_filter(value):
        try:
            return json.loads(value) if value else []
        except Exception:
            return []

    # Handle language routing/session injection
    @app.before_request
    def detect_locale():
        # Force language update if provided as query param
        lang = request.args.get('lang')
        if lang in ['fr', 'en']:
            session['lang'] = lang
        elif 'lang' not in session:
            # Detect language from request header
            accept_language = request.headers.get('Accept-Language', '')
            if 'fr' in accept_language.lower():
                session['lang'] = 'fr'
            else:
                session['lang'] = 'en'

    @app.route('/')
    def index():
        profile = Profile.query.first()
        if not profile:
            # In case DB is empty, run seed automatically
            seed_db()
            profile = Profile.query.first()

        educations = Education.query.order_by(Education.sort_order.asc()).all()
        experiences = Experience.query.order_by(Experience.sort_order.asc()).all()
        skills = Skill.query.order_by(Skill.sort_order.asc()).all()
        projects = Project.query.order_by(Project.sort_order.asc()).all()
        blog_posts = BlogPost.query.order_by(BlogPost.sort_order.asc()).all()

        lang = session.get('lang', 'fr')

        return render_template(
            'public/index.html',
            profile=profile,
            educations=educations,
            experiences=experiences,
            skills=skills,
            projects=projects,
            blog_posts=blog_posts,
            lang=lang
        )

    @app.route('/submit-contact', methods=['POST'])
    def submit_contact():
        lang = session.get('lang', 'fr')
        fullname = request.form.get('fullname')
        email = request.form.get('email')
        message_content = request.form.get('message')

        if not fullname or not email or not message_content:
            if lang == 'fr':
                flash("Veuillez remplir tous les champs.", "error")
            else:
                flash("Please fill in all fields.", "error")
            return redirect(url_for('index', _anchor='contact'))

        # Store in database
        msg = Message(fullname=fullname, email=email, message=message_content)
        db.session.add(msg)
        db.session.commit()

        if lang == 'fr':
            flash("Votre message a été envoyé avec succès ! Il sera consulté par Lionel via son panneau de contrôle.", "success")
        else:
            flash("Your message was sent successfully! It will be reviewed by Lionel via his control panel.", "success")

        return redirect(url_for('index') + "#contact")

    # Dynamic admin routing logic:
    # 404 for all '/admin' and action routes if not authenticated
    # Allow secret gate login route via variable environment config
    login_route = app.config['ADMIN_LOGIN_ROUTE']

    def is_logged_in():
        return session.get('admin_logged_in') is True

    @app.route(f'/{login_route}', methods=['GET', 'POST'])
    def admin_login():
        if is_logged_in():
            return redirect(url_for('admin_dashboard'))

        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')

            if username == app.config['ADMIN_USER'] and password == app.config['ADMIN_PASSWORD']:
                session['admin_logged_in'] = True
                flash("Connexion réussie !", "success")
                return redirect(url_for('admin_dashboard'))
            else:
                flash("Identifiants incorrects.", "danger")

        return render_template('admin/login.html')

    @app.route('/admin-logout')
    def admin_logout():
        session.pop('admin_logged_in', None)
        return redirect(url_for('index'))

    # Helper wrapper to protect admin routes
    def check_admin_auth():
        if not is_logged_in():
            # Return 404 instead of 403 or redirect to conceal existence of the admin interface
            abort(404)

    @app.route('/admin')
    def admin_dashboard():
        check_admin_auth()
        profile = Profile.query.first()
        educations = Education.query.order_by(Education.sort_order.asc()).all()
        experiences = Experience.query.order_by(Experience.sort_order.asc()).all()
        skills = Skill.query.order_by(Skill.sort_order.asc()).all()
        projects = Project.query.order_by(Project.sort_order.asc()).all()
        blog_posts = BlogPost.query.order_by(BlogPost.sort_order.asc()).all()
        messages = Message.query.order_by(Message.created_at.desc()).all()

        return render_template(
            'admin/dashboard.html',
            profile=profile,
            educations=educations,
            experiences=experiences,
            skills=skills,
            projects=projects,
            blog_posts=blog_posts,
            messages=messages
        )

    # --- Profile edit ---
    @app.route('/admin/profile/edit', methods=['POST'])
    def admin_edit_profile():
        check_admin_auth()
        profile = Profile.query.first()
        if not profile:
            profile = Profile()
            db.session.add(profile)

        profile.name = request.form.get('name')
        profile.title_fr = request.form.get('title_fr')
        profile.title_en = request.form.get('title_en')
        profile.sub_title_fr = request.form.get('sub_title_fr')
        profile.sub_title_en = request.form.get('sub_title_en')
        profile.bio_fr = request.form.get('bio_fr')
        profile.bio_en = request.form.get('bio_en')
        profile.email = request.form.get('email')
        profile.linkedin = request.form.get('linkedin')
        profile.github = request.form.get('github')
        profile.location_fr = request.form.get('location_fr')
        profile.location_en = request.form.get('location_en')
        profile.birthday_fr = request.form.get('birthday_fr')
        profile.birthday_en = request.form.get('birthday_en')
        profile.phone = request.form.get('phone')

        # Avatar Upload Handling
        if 'avatar' in request.files:
            file = request.files['avatar']
            if file and file.filename != '':
                # Save the uploaded file locally in uploads folder
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                filename = "avatar_" + secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                profile.avatar = f"/static/uploads/{filename}"

        db.session.commit()
        flash("Profil mis à jour avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    # --- Education CRUD ---
    @app.route('/admin/education/add', methods=['POST'])
    def add_education():
        check_admin_auth()
        edu = Education(
            degree_fr=request.form.get('degree_fr'),
            degree_en=request.form.get('degree_en'),
            institution_fr=request.form.get('institution_fr'),
            institution_en=request.form.get('institution_en'),
            period=request.form.get('period'),
            details_fr=request.form.get('details_fr'),
            details_en=request.form.get('details_en'),
            sort_order=int(request.form.get('sort_order') or 0)
        )
        db.session.add(edu)
        db.session.commit()
        flash("Formation ajoutée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/education/edit/<int:id>', methods=['POST'])
    def edit_education(id):
        check_admin_auth()
        edu = Education.query.get_or_404(id)
        edu.degree_fr = request.form.get('degree_fr')
        edu.degree_en = request.form.get('degree_en')
        edu.institution_fr = request.form.get('institution_fr')
        edu.institution_en = request.form.get('institution_en')
        edu.period = request.form.get('period')
        edu.details_fr = request.form.get('details_fr')
        edu.details_en = request.form.get('details_en')
        edu.sort_order = int(request.form.get('sort_order') or 0)
        db.session.commit()
        flash("Formation modifiée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/education/delete/<int:id>', methods=['POST'])
    def delete_education(id):
        check_admin_auth()
        edu = Education.query.get_or_404(id)
        db.session.delete(edu)
        db.session.commit()
        flash("Formation supprimée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    # --- Experience CRUD ---
    @app.route('/admin/experience/add', methods=['POST'])
    def add_experience():
        check_admin_auth()
        bullets_fr_raw = request.form.get('bullets_fr', '')
        bullets_en_raw = request.form.get('bullets_en', '')

        # Turn lines into JSON lists
        bullets_fr = [line.strip() for line in bullets_fr_raw.split('\n') if line.strip()]
        bullets_en = [line.strip() for line in bullets_en_raw.split('\n') if line.strip()]

        exp = Experience(
            title_fr=request.form.get('title_fr'),
            title_en=request.form.get('title_en'),
            company_fr=request.form.get('company_fr'),
            company_en=request.form.get('company_en'),
            period=request.form.get('period'),
            bullets_fr=json.dumps(bullets_fr),
            bullets_en=json.dumps(bullets_en),
            sort_order=int(request.form.get('sort_order') or 0)
        )
        db.session.add(exp)
        db.session.commit()
        flash("Expérience ajoutée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/experience/edit/<int:id>', methods=['POST'])
    def edit_experience(id):
        check_admin_auth()
        exp = Experience.query.get_or_404(id)

        bullets_fr_raw = request.form.get('bullets_fr', '')
        bullets_en_raw = request.form.get('bullets_en', '')

        bullets_fr = [line.strip() for line in bullets_fr_raw.split('\n') if line.strip()]
        bullets_en = [line.strip() for line in bullets_en_raw.split('\n') if line.strip()]

        exp.title_fr = request.form.get('title_fr')
        exp.title_en = request.form.get('title_en')
        exp.company_fr = request.form.get('company_fr')
        exp.company_en = request.form.get('company_en')
        exp.period = request.form.get('period')
        exp.bullets_fr = json.dumps(bullets_fr)
        exp.bullets_en = json.dumps(bullets_en)
        exp.sort_order = int(request.form.get('sort_order') or 0)

        db.session.commit()
        flash("Expérience modifiée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/experience/delete/<int:id>', methods=['POST'])
    def delete_experience(id):
        check_admin_auth()
        exp = Experience.query.get_or_404(id)
        db.session.delete(exp)
        db.session.commit()
        flash("Expérience supprimée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    # --- Skill CRUD ---
    @app.route('/admin/skill/add', methods=['POST'])
    def add_skill():
        check_admin_auth()
        sk = Skill(
            category_fr=request.form.get('category_fr'),
            category_en=request.form.get('category_en'),
            skills_fr=request.form.get('skills_fr'),
            skills_en=request.form.get('skills_en'),
            percentage=int(request.form.get('percentage') or 80),
            sort_order=int(request.form.get('sort_order') or 0)
        )
        db.session.add(sk)
        db.session.commit()
        flash("Compétence ajoutée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/skill/edit/<int:id>', methods=['POST'])
    def edit_skill(id):
        check_admin_auth()
        sk = Skill.query.get_or_404(id)
        sk.category_fr = request.form.get('category_fr')
        sk.category_en = request.form.get('category_en')
        sk.skills_fr = request.form.get('skills_fr')
        sk.skills_en = request.form.get('skills_en')
        sk.percentage = int(request.form.get('percentage') or 80)
        sk.sort_order = int(request.form.get('sort_order') or 0)
        db.session.commit()
        flash("Compétence modifiée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/skill/delete/<int:id>', methods=['POST'])
    def delete_skill(id):
        check_admin_auth()
        sk = Skill.query.get_or_404(id)
        db.session.delete(sk)
        db.session.commit()
        flash("Compétence supprimée avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    # --- Project CRUD ---
    @app.route('/admin/project/add', methods=['POST'])
    def add_project():
        check_admin_auth()

        image_path = ""
        # Handle file upload if present
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                filename = "project_" + secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_path = f"/static/uploads/{filename}"

        # Fallback to image URL if specified
        if not image_path:
            image_path = request.form.get('image_url', '')

        proj = Project(
            name=request.form.get('name'),
            stack=request.form.get('stack'),
            desc_fr=request.form.get('desc_fr'),
            desc_en=request.form.get('desc_en'),
            category=request.form.get('category', 'web development'),
            image=image_path,
            github_link=request.form.get('github_link'),
            demo_link=request.form.get('demo_link'),
            sort_order=int(request.form.get('sort_order') or 0)
        )
        db.session.add(proj)
        db.session.commit()
        flash("Projet ajouté avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/project/edit/<int:id>', methods=['POST'])
    def edit_project(id):
        check_admin_auth()
        proj = Project.query.get_or_404(id)

        image_path = proj.image
        # Handle file upload if present
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                filename = "project_" + secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_path = f"/static/uploads/{filename}"

        # If no file uploaded but URL updated
        if 'image' not in request.files or not request.files['image'].filename:
            url_val = request.form.get('image_url')
            if url_val is not None:
                image_path = url_val

        proj.name = request.form.get('name')
        proj.stack = request.form.get('stack')
        proj.desc_fr = request.form.get('desc_fr')
        proj.desc_en = request.form.get('desc_en')
        proj.category = request.form.get('category', 'web development')
        proj.image = image_path
        proj.github_link = request.form.get('github_link')
        proj.demo_link = request.form.get('demo_link')
        proj.sort_order = int(request.form.get('sort_order') or 0)

        db.session.commit()
        flash("Projet modifié avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/project/delete/<int:id>', methods=['POST'])
    def delete_project(id):
        check_admin_auth()
        proj = Project.query.get_or_404(id)
        db.session.delete(proj)
        db.session.commit()
        flash("Projet supprimé avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    # --- Blog CRUD ---
    @app.route('/admin/blog/add', methods=['POST'])
    def add_blog():
        check_admin_auth()

        image_path = ""
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                filename = "blog_" + secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_path = f"/static/uploads/{filename}"

        if not image_path:
            image_path = request.form.get('image_url', '')

        bp = BlogPost(
            title_fr=request.form.get('title_fr'),
            title_en=request.form.get('title_en'),
            category_fr=request.form.get('category_fr'),
            category_en=request.form.get('category_en'),
            date_fr=request.form.get('date_fr'),
            date_en=request.form.get('date_en'),
            content_fr=request.form.get('content_fr'),
            content_en=request.form.get('content_en'),
            image=image_path,
            sort_order=int(request.form.get('sort_order') or 0)
        )
        db.session.add(bp)
        db.session.commit()
        flash("Article de blog ajouté avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/blog/edit/<int:id>', methods=['POST'])
    def edit_blog(id):
        check_admin_auth()
        bp = BlogPost.query.get_or_404(id)

        image_path = bp.image
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                filename = "blog_" + secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_path = f"/static/uploads/{filename}"

        if 'image' not in request.files or not request.files['image'].filename:
            url_val = request.form.get('image_url')
            if url_val is not None:
                image_path = url_val

        bp.title_fr = request.form.get('title_fr')
        bp.title_en = request.form.get('title_en')
        bp.category_fr = request.form.get('category_fr')
        bp.category_en = request.form.get('category_en')
        bp.date_fr = request.form.get('date_fr')
        bp.date_en = request.form.get('date_en')
        bp.content_fr = request.form.get('content_fr')
        bp.content_en = request.form.get('content_en')
        bp.image = image_path
        bp.sort_order = int(request.form.get('sort_order') or 0)

        db.session.commit()
        flash("Article de blog modifié avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/blog/delete/<int:id>', methods=['POST'])
    def delete_blog(id):
        check_admin_auth()
        bp = BlogPost.query.get_or_404(id)
        db.session.delete(bp)
        db.session.commit()
        flash("Article de blog supprimé avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    # --- Message Management ---
    @app.route('/admin/message/delete/<int:id>', methods=['POST'])
    def delete_message(id):
        check_admin_auth()
        msg = Message.query.get_or_404(id)
        db.session.delete(msg)
        db.session.commit()
        flash("Message supprimé avec succès !", "success")
        return redirect(url_for('admin_dashboard'))

    return app
