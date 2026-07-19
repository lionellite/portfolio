import json
from models import db, Profile, Education, Experience, Skill, Project, BlogPost

def seed_db():
    # Only seed if Profile table is empty
    if Profile.query.first() is not None:
        return

    print("Seeding database with initial CV data...")

    # 1. Profile Info
    profile = Profile(
        name="Lionel Adoukonou",
        title_fr="Développeur Backend Python & Systèmes",
        title_en="Backend Python & Systems Developer",
        sub_title_fr="DevOps · Cloud · Infrastructure",
        sub_title_en="DevOps · Cloud · Infrastructure",
        bio_fr=(
            "Technicien Supérieur en Génie Électrique et Informatique, spécialisé en développement backend Python "
            "et en systèmes Linux/DevOps. Autodidacte et autonome — capable de résoudre des problèmes dans des langages "
            "non maîtrisés grâce à une recherche technique efficace — avec de bonnes bases en cybersécurité et une grande "
            "capacité d'adaptation. Gestion de projet développée en stage et au sein d'un collectif de développement co-fondé. "
            "À la recherche d'opportunités dans les métiers DevOps, Cloud Engineering et Administration Système."
        ),
        bio_en=(
            "Senior Technician in Electrical Engineering and Computer Science, specializing in Python backend development "
            "and Linux/DevOps systems. Self-taught and autonomous — capable of solving technical problems in languages "
            "not fully mastered through efficient research — with a solid foundation in cybersecurity and high adaptability. "
            "Project management skills developed during internships and a co-founded development collective. "
            "Seeking opportunities in DevOps, Cloud Engineering, and System Administration."
        ),
        email="liolisena@gmail.com",
        linkedin="https://linkedin.com/in/lionellite",
        github="https://github.com/lionellite",
        location_fr="Bénin",
        location_en="Benin",
        birthday_fr="23 Juin, 2002",
        birthday_en="June 23, 2002",
        phone="+229 00 00 00 00", # Use a standard format, or let them update it
        avatar="/static/assets/images/my-avatar.png"
    )
    db.session.add(profile)

    # 2. Education
    edu1 = Education(
        degree_fr="Licence — Technicien Supérieur en Génie Électrique et Informatique",
        degree_en="Bachelor — Senior Technician in Electrical Engineering and Computer Science",
        institution_fr="option Informatique & Télécommunication | INSTI, Lokossa, Bénin | Soutenue le 09/07/2026",
        institution_en="option Computer Science & Telecommunication | INSTI, Lokossa, Benin | Defended on 09/07/2026",
        period="2023 – 2026",
        details_fr="Formation axée sur le génie électrique, les réseaux, la programmation et l'ingénierie des télécoms.",
        details_en="Curriculum focused on electrical engineering, networking, programming, and telecom engineering.",
        sort_order=1
    )
    edu2 = Education(
        degree_fr="Baccalauréat Série D",
        degree_en="High School Diploma - Science Series (Série D)",
        institution_fr="CEG 1 de Pahou, Bénin",
        institution_en="CEG 1 of Pahou, Benin",
        period="2022",
        details_fr="Études secondaires scientifiques.",
        details_en="Scientific secondary studies.",
        sort_order=2
    )
    db.session.add_all([edu1, edu2])

    # 3. Experience
    exp1 = Experience(
        title_fr="Co-fondateur",
        title_en="Co-founder",
        company_fr="LiteTECH (Collectif de développement)",
        company_en="LiteTECH (Development Collective)",
        period="Février 2026 – présent",
        bullets_fr=json.dumps([
            "Co-fondation d'un collectif dédié à la conception de MVPs pour startups et porteurs de projet.",
            "Structure informelle en phase de démarrage."
        ]),
        bullets_en=json.dumps([
            "Co-founded a collective dedicated to designing MVPs for startups and project owners.",
            "Informal structure currently in starting phase."
        ]),
        sort_order=1
    )
    exp2 = Experience(
        title_fr="Stagiaire Développeur",
        title_en="Developer Intern",
        company_fr="Ex-Ministère du Numérique et de la Digitalisation",
        company_en="Former Ministry of Digital Economy and Digitalization",
        period="09 Fév. – 09 Mai 2026 (3 mois)",
        bullets_fr=json.dumps([
            "Développement de PGPUSS — plateforme multicanale de gestion des plaintes des usagers des services de santé au Bénin.",
            "Stack : Django REST Framework, PostgreSQL, Flutter, React."
        ]),
        bullets_en=json.dumps([
            "Development of PGPUSS — a multichannel platform for managing complaints from healthcare service users in Benin.",
            "Stack: Django REST Framework, PostgreSQL, Flutter, React."
        ]),
        sort_order=2
    )
    exp3 = Experience(
        title_fr="Bootcamp Africa TechUp Tour",
        title_en="Bootcamp Africa TechUp Tour",
        company_fr="iSHEERO & 54Bridges, EPITECH Bénin",
        company_en="iSHEERO & 54Bridges, EPITECH Benin",
        period="Avril – Sept. 2025",
        bullets_fr=json.dumps([
            "5 jours de bootcamp intensif en septembre.",
            "Sujets abordés : Data Infrastructure, DevOps, Cloud."
        ]),
        bullets_en=json.dumps([
            "5 days of intensive bootcamp in September.",
            "Topics: Data Infrastructure, DevOps, Cloud."
        ]),
        sort_order=3
    )
    exp4 = Experience(
        title_fr="Stagiaire Développeur",
        title_en="Developer Intern",
        company_fr="Benilab Services, Lokossa",
        company_en="Benilab Services, Lokossa",
        period="Avril – Août 2025 (4 mois)",
        bullets_fr=json.dumps([
            "Stage professionnel en développement ; consolidation des compétences en gestion de projet."
        ]),
        bullets_en=json.dumps([
            "Professional internship in software development; consolidation of project management skills."
        ]),
        sort_order=4
    )
    exp5 = Experience(
        title_fr="Stagiaire Académique",
        title_en="Academic Intern",
        company_fr="Commission Électorale Nationale Autonome (CENA)",
        company_en="Autonomous National Electoral Commission (CENA)",
        period="Août – Sept. 2023 (1 mois)",
        bullets_fr=json.dumps([
            "Stage d'observation et de découverte de l'administration électorale et informatique."
        ]),
        bullets_en=json.dumps([
            "Observation internship to understand electoral and IT administration."
        ]),
        sort_order=5
    )
    db.session.add_all([exp1, exp2, exp3, exp4, exp5])

    # 4. Skills
    skills_list = [
        Skill(
            category_fr="Systèmes & Infrastructure",
            category_en="Systems & Infrastructure",
            skills_fr="Linux (Fedora/Ubuntu/Debian/Mint · 4 ans) · Docker · Podman · Virtualisation · Administration système · CI/CD (GitHub Actions, GitLab CI) · Jenkins & Kubernetes (en cours)",
            skills_en="Linux (Fedora/Ubuntu/Debian/Mint · 4 years) · Docker · Podman · Virtualization · System Administration · CI/CD (GitHub Actions, GitLab CI) · Jenkins & Kubernetes (in progress)",
            percentage=90,
            sort_order=1
        ),
        Skill(
            category_fr="Développement Backend",
            category_en="Backend Development",
            skills_fr="Python (Django, Flask, FastAPI) · API REST · Bases de données SQL / NoSQL",
            skills_en="Python (Django, Flask, FastAPI) · REST API · SQL / NoSQL Databases",
            percentage=95,
            sort_order=2
        ),
        Skill(
            category_fr="IA & Data",
            category_en="AI & Data",
            skills_fr="Machine Learning · Deep Learning · Fine-tuning · Analyse de données · Data Engineering (notions) · Automatisation (n8n, Zapier, Make) · Intégration IA & MCP · Orchestration multi-agents",
            skills_en="Machine Learning · Deep Learning · Fine-tuning · Data Analysis · Data Engineering (basics) · Automation (n8n, Zapier, Make) · AI & MCP Integration · Multi-agent Orchestration",
            percentage=85,
            sort_order=3
        ),
        Skill(
            category_fr="Développement Mobile",
            category_en="Mobile Development",
            skills_fr="Flutter · Kotlin (notions)",
            skills_en="Flutter · Kotlin (basics)",
            percentage=75,
            sort_order=4
        ),
        Skill(
            category_fr="Gestion de projet",
            category_en="Project Management",
            skills_fr="Coordination d'équipe · Gestion de livrables et de délais (renforcée en stage)",
            skills_en="Team Coordination · Deliverable & Deadline Management (strengthened during internships)",
            percentage=80,
            sort_order=5
        ),
        Skill(
            category_fr="Réseaux & Cybersécurité",
            category_en="Networks & Cybersecurity",
            skills_fr="Bonnes bases théoriques en réseaux · Connaissances solides en cybersécurité (peu de pratique sur outils spécialisés)",
            skills_en="Good theoretical networking foundations · Solid cybersecurity knowledge (limited practice on specialized tools)",
            percentage=70,
            sort_order=6
        ),
        Skill(
            category_fr="CAO / 3D",
            category_en="CAD / 3D",
            skills_fr="AutoCAD · FreeCAD (notions)",
            skills_en="AutoCAD · FreeCAD (basics)",
            percentage=60,
            sort_order=7
        ),
        Skill(
            category_fr="Graphisme & Design",
            category_en="Graphics & Design",
            skills_fr="Photoshop · Illustrator · Figma · Adobe XD · Inkscape · GIMP",
            skills_en="Photoshop · Illustrator · Figma · Adobe XD · Inkscape · GIMP",
            percentage=80,
            sort_order=8
        )
    ]
    db.session.add_all(skills_list)

    # 5. Projects
    proj1 = Project(
        name="PGPUSS",
        stack="Django REST Fw · PostgreSQL · Flutter · React",
        desc_fr="Plateforme multicanale de gestion des plaintes des usagers des services de santé au Bénin — projet de soutenance.",
        desc_en="Multichannel platform for managing complaints from healthcare service users in Benin — defense project.",
        category="web development",
        image="/static/assets/images/project-1.jpg",
        sort_order=1
    )
    proj2 = Project(
        name="LiteAI",
        stack="Python · HuggingFace Inference",
        desc_fr="Plateforme IA personnelle multimodale, API compatible OpenAI/Anthropic, interface web dédiée.",
        desc_en="Personal multimodal AI platform, OpenAI/Anthropic compatible API, dedicated web interface.",
        category="web development",
        image="/static/assets/images/project-2.png",
        sort_order=2
    )
    proj3 = Project(
        name="UniFlow",
        stack="TypeScript",
        desc_fr="Expérience cross-device unifiée, open-source, respectueuse de la vie privée et de la souveraineté des données. (en cours)",
        desc_en="Unified cross-device experience, open-source, respecting privacy and data sovereignty. (in progress)",
        category="applications",
        image="/static/assets/images/project-3.jpg",
        sort_order=3
    )
    proj4 = Project(
        name="AgriChain 360 API",
        stack="Python · Django",
        desc_fr="API de gestion agricole : utilisateurs, données capteurs, alertes et notifications.",
        desc_en="Agricultural management API: users, sensor data, alerts, and notifications.",
        category="web development",
        image="/static/assets/images/project-4.png",
        sort_order=4
    )
    proj5 = Project(
        name="SpaceCanva",
        stack="TypeScript",
        desc_fr="Analyse assistée par IA et visualisation 3D immersive — NASA Space Apps Challenge.",
        desc_en="AI-assisted analysis and immersive 3D visualization — NASA Space Apps Challenge.",
        category="web design",
        image="/static/assets/images/project-5.png",
        sort_order=5
    )
    proj6 = Project(
        name="LiteDL",
        stack="Python · yt-dlp",
        desc_fr="Téléchargeur de vidéos multiplateforme.",
        desc_en="Multiplatform video downloader.",
        category="applications",
        image="/static/assets/images/project-6.png",
        sort_order=6
    )
    proj7 = Project(
        name="Bybl",
        stack="JavaScript",
        desc_fr="Bible en ligne.",
        desc_en="Online Bible.",
        category="applications",
        image="/static/assets/images/project-7.png",
        sort_order=7
    )
    db.session.add_all([proj1, proj2, proj3, proj4, proj5, proj6, proj7])

    # 6. Blog Posts
    post1 = BlogPost(
        title_fr="Ma participation à l'Africa TechUp Tour 2025",
        title_en="My experience at Africa TechUp Tour 2025",
        category_fr="DevOps / Cloud",
        category_en="DevOps / Cloud",
        date_fr="23 Sept. 2025",
        date_en="Sept 23, 2025",
        content_fr="Retour sur les 5 jours de bootcamp intensif axés sur les infrastructures de données, le DevOps et les technologies Cloud...",
        content_en="A recap of the intensive 5-day bootcamp focusing on data infrastructure, DevOps, and Cloud technologies...",
        image="/static/assets/images/blog-1.jpg",
        sort_order=1
    )
    db.session.add(post1)

    db.session.commit()
    print("Database successfully seeded!")
