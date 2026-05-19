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

Avec Node.js (recommandé, identique à la prod) :

```bash
npm start
# puis ouvrez http://localhost:3000
```

Ou avec Python si vous préférez :

```bash
python3 -m http.server 8000
```

> Note : pour le backoffice et le chargement de `data/site.json`, il est
> indispensable de servir le site via un serveur HTTP (les navigateurs
> bloquent les requêtes `fetch` en `file://`).

## Déploiement sur Railway

Le projet est prêt à être déployé sur [Railway](https://railway.app) :

- `server.js` — petit serveur HTTP Node (sans dépendances) qui sert les fichiers statiques et écoute sur `process.env.PORT`.
- `package.json` — déclare la commande `npm start`.
- `railway.json` — configuration de build (Nixpacks) et de déploiement.
- `.gitignore` / `.dockerignore` — exclusions.

### Étapes de déploiement

1. Connectez-vous sur [railway.app](https://railway.app) avec votre compte GitHub.
2. **New Project → Deploy from GitHub Repo** et sélectionnez ce dépôt (`papamamour-spec/MRP`).
3. Choisissez la branche à déployer (par défaut `main`, ou `claude/political-campaign-website-RtdTp` pour tester).
4. Railway détecte automatiquement Node.js, installe et lance `npm start`.
5. Dans l'onglet **Settings → Networking**, cliquez sur **Generate Domain** pour obtenir une URL publique (ex. `mrc-rufisque.up.railway.app`).
6. Optionnel : **Custom Domain** pour brancher un nom de domaine (`renouveau-citoyen.sn`).

Aucune variable d'environnement n'est requise. La variable `PORT` est fournie automatiquement par Railway.

### Mise à jour du contenu (actualités, logo, photos)

1. Dans le backoffice (`/admin/`) : modifiez ce qu'il faut, puis **Exporter site.json**.
2. Remplacez `data/site.json` dans le dépôt GitHub et committez.
3. Railway redéploie automatiquement à chaque `git push` sur la branche connectée.

> Note : pour le backoffice et le chargement de `data/site.json`, il est
> indispensable de servir le site via un serveur HTTP (les navigateurs
> bloquent les requêtes `fetch` en `file://`).

## Backoffice d'administration

Un espace d'administration permet de gérer les actualités, le logo et
les photos sans toucher au code.

- **URL :** `/admin/` (par exemple `http://localhost:8000/admin/`)
- **Première connexion :** vous définissez vous-même le mot de passe.
  Il est haché en SHA-256 et stocké dans votre navigateur.
- **Modifications locales :** toutes les modifications sont enregistrées
  dans le `localStorage` de votre navigateur — elles sont immédiatement
  visibles pour vous, sur l'appareil utilisé.
- **Publication :** pour que les modifications soient visibles par tout
  le monde, exportez `site.json` depuis l'onglet « Publication &
  sauvegarde », déposez-le dans `data/site.json` du dépôt et committez.
  Le déploiement (GitHub Pages, Netlify, etc.) propagera les changements.

### Fonctionnalités du backoffice

- Création / modification / suppression d'**actualités** (titre, date,
  catégorie, résumé, contenu, image)
- Remplacement du **logo**, de la **photo du candidat** et de l'**image
  d'arrière-plan** de la page d'accueil
- **Export / import** du fichier `site.json`
- **Changement de mot de passe** depuis la barre supérieure

### Limites (et évolution possible)

Le backoffice fonctionne entièrement côté client. C'est volontairement
simple et sans serveur. Pour une publication automatique, on peut
brancher Netlify CMS / Decap (gratuit, basé sur Git) ou une petite API
qui écrit `data/site.json` côté serveur.

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
