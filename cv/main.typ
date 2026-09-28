#import "@preview/basic-resume:0.2.9": *

#let name = "Lionel Napoléon Sewa ADOUKONOU"
#let location = "Cotonou, Bénin"
#let email = "liolisena@gmail.com"
#let github = "github.com/lionellite"
#let linkedin = "linkedin.com/in/lionellite"
#let phone = "+229 01 58 31 34 63"
#let personal-site = ""

#show: resume.with(
  author: name,
  location: location,
  email: email,
  github: github,
  linkedin: linkedin,
  phone: phone,
  personal-site: personal-site,
  accent-color: "#075fbd",
  font: "Noto Sans",
  author-font-size: 18pt,
  font-size: 8.6pt,
  lang: "fr",
  paper: "a4",
  author-position: left,
  personal-info-position: left,
)

#align(left)[
  #text(fill: rgb("075fbd"), weight: "bold", size: 9pt)[BACKEND / DEVOPS / CLOUD]
  #v(3pt)
  #text(size: 9.3pt, weight: "bold")[Développeur backend Python junior · Support IT · Cybersécurité]
  #v(4pt)
  Diplômé en Génie électrique et informatique, option Informatique et Télécommunications. Je conçois des APIs et des applications web avec Python, Django et React, tout en développant mes compétences en administration système, automatisation, cybersécurité, DevOps et cloud. Disponible sur site, en hybride ou à distance. Français courant, fon langue maternelle, anglais professionnel en progression.
]

== Compétences techniques
- *Backend & API*: Python, Django, Django REST Framework, Flask, FastAPI, API REST, JWT.
- *Frontend*: React, Vite, Next.js, JavaScript, HTML, CSS.
- *Infrastructure*: Linux, Docker, Docker Compose, Podman, virtualisation, Bash, notions de Kubernetes.
- *Données & asynchrone*: SQL, NoSQL, Redis, Celery.
- *Cloud & déploiement*: Vercel, Contabo, AWS EC2, GitHub Actions.
- *Intégrations & sécurité*: OpenWA, Meta API, Cloudinary, réseaux, diagnostic, support utilisateurs, bonnes pratiques de cybersécurité.
- *Collaboration*: Git, GitHub, diagrammes de Gantt, méthodes agiles, coordination d’équipe.

== Expérience professionnelle
#work(
  title: "Co-fondateur",
  location: "Cotonou, Bénin",
  company: "LiteTECH · collectif de développement",
  dates: dates-helper(start-date: "Fév. 2026", end-date: "Aujourd'hui"),
)
- Participation à la création d’un collectif destiné à concevoir des produits minimums viables pour des startups et porteurs de projets.
- Contribution à l’analyse des besoins, aux choix techniques, au développement des solutions et au suivi des livrables.

#work(
  title: "Stagiaire académique",
  location: "Bénin",
  company: "Ministère du Numérique et de la Digitalisation",
  dates: dates-helper(start-date: "Fév. 2026", end-date: "Mai 2026"),
)
- Contribution au développement de PGP-USS, plateforme multicanale de gestion des plaintes des usagers des services de santé.
- Développement d’un backend Django et d’API REST avec interface React/Vite, gestion des rôles, suivi, notifications et tableaux de bord.
- Utilisation de Docker et Docker Compose pour l’environnement de développement.

#work(
  title: "Stagiaire développeur",
  location: "Lokossa, Bénin",
  company: "Benilab Services",
  dates: dates-helper(start-date: "Avr. 2025", end-date: "Août 2025"),
)
- Participation au développement d’applications avec Django et Next.js.
- Planification et suivi des activités avec diagramme de Gantt, méthodes agiles et collaboration sur les livrables techniques.

#work(
  title: "Stagiaire académique",
  location: "Bénin",
  company: "Commission électorale nationale autonome",
  dates: dates-helper(start-date: "Août 2023", end-date: "Sept. 2023"),
)
- Contribution aux activités réseaux et support informatique : diagnostic, assistance utilisateurs et environnement IT.

== Projets sélectionnés
#project(name: "PGP-USS", role: "Django · DRF · React · Vite · Docker · JWT", url: "pgpuss.vercel.app")
- Plateforme de dépôt, suivi et traitement des plaintes avec gestion des rôles, système de ticket, tableaux de bord, indicateurs de performance et notifications.

#project(name: "AgriChain 360 API", role: "Django · DRF · JWT", url: "github.com/lionellite/agrichain360api")
- API de gestion des utilisateurs, données de capteurs, alertes et notifications pour un système agricole connecté.

#project(name: "ChatPDF Deploy", role: "Python · IA · Streamlit", url: "github.com/lionellite/chatpdfdeploy")
- Application permettant de téléverser un PDF, de poser des questions sur son contenu et d’obtenir des réponses contextualisées.

== Formation
#edu(
  institution: "Institut national supérieur de technologie industrielle (INSTI)",
  location: "Lokossa, Bénin",
  dates: dates-helper(start-date: "2022", end-date: "2026"),
  degree: "Licence professionnelle en Génie électrique et informatique, option Informatique et Télécommunications",
  consistent: true,
)
#edu(
  institution: "iSHEERO & 54Bridges",
  location: "Bénin",
  dates: dates-helper(start-date: "Avr. 2024", end-date: "Sept. 2024"),
  degree: "Africa TechUp Tour · Data Infrastructure, DevOps et Cloud",
  consistent: true,
)
#edu(
  institution: "CEG 1 de Pahou",
  location: "Bénin",
  dates: dates-helper(start-date: "2022", end-date: "2022"),
  degree: "Baccalauréat série D",
  consistent: true,
)
