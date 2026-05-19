# Mouvement pour le Renouveau Citoyen (MRC)

Site officiel du **Mouvement pour le Renouveau Citoyen**, porté par
**Mame Seyni Faye**, candidat à la mairie de **Rufisque Ouest**.

> Tenguedji Smaa Gokh — Construisons notre quartier.

## Structure du site

Site statique (HTML / CSS / JavaScript), prêt à être hébergé sur n'importe
quel serveur ou sur GitHub Pages / Netlify / Vercel.

- `index.html` — Accueil
- `candidat.html` — Présentation du candidat
- `mouvement.html` — Le mouvement, sa charte, son organisation
- `programme.html` — Programme « Rufisque Ouest 2030 » (6 axes, 42 mesures)
- `actualites.html` — Communiqués et événements
- `contact.html` — Contact et formulaire d'adhésion
- `assets/css/styles.css` — Feuille de style
- `assets/js/main.js` — Interactions (menu mobile, formulaires)
- `assets/img/logo.svg` — Logo de secours (à remplacer par le logo officiel)
- `assets/img/hero-bg.svg` — Fond de la section d'en-tête

## Remplacer le logo

Un logo SVG de secours est fourni. Pour utiliser le vrai logo du mouvement :

1. Déposez votre fichier dans `assets/img/` sous le nom `logo.png`.
2. Dans les fichiers HTML, remplacez `assets/img/logo.svg` par
   `assets/img/logo.png` (un simple rechercher-remplacer suffit).

## Lancer en local

Aucune compilation nécessaire. Ouvrez `index.html` dans un navigateur,
ou servez le dossier avec :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Le programme en bref

Six axes prioritaires pour transformer Rufisque Ouest en 5 ans :

1. **Gouvernance citoyenne & transparence** — budget participatif, mairie ouverte, redevabilité trimestrielle.
2. **Cadre de vie & assainissement** — collecte renforcée, lutte contre l'érosion et les inondations, éclairage solaire.
3. **Économie locale & emploi des jeunes** — pépinière d'entreprises, fablab, soutien à la pêche et à l'artisanat.
4. **Éducation, santé & jeunesse** — cantines, bourses, postes de santé équipés, complexe culturel et sportif.
5. **Mobilité & infrastructures** — pavage, drainage, transport collectif, logement social.
6. **Femmes, inclusion & solidarité** — financement des GIE féminins, crèches, inclusion des aînés et personnes handicapées.

Financement : optimisation des recettes locales, FECL, coopération décentralisée,
mobilisation de la diaspora, PPP encadrés, sobriété budgétaire.
