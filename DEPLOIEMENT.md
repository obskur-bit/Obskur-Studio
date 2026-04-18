# OBSKUR CONTENT STUDIO — GUIDE DE DÉPLOIEMENT PWA

## Ce que tu vas obtenir
Une app installable sur ton téléphone, accessible via une URL,
qui fonctionne même hors connexion. Gratuit, en 15 minutes.

---

## PRÉREQUIS (à installer une seule fois)

1. **Node.js** → https://nodejs.org  (télécharge la version LTS)
2. **Compte GitHub** → https://github.com  (gratuit)
3. **Compte Vercel** → https://vercel.com  (gratuit, connecte avec GitHub)

---

## ÉTAPE 1 — Prépare le projet sur ton ordinateur

Ouvre le Terminal (Mac/Linux) ou PowerShell (Windows) :

```bash
# Va dans le dossier du projet
cd obskur-studio

# Installe les dépendances
npm install

# Test en local (optionnel mais recommandé)
npm run dev
# → Ouvre http://localhost:5173 dans ton navigateur
# → Si ça marche, continue
```

---

## ÉTAPE 2 — Publie sur GitHub

```bash
# Initialise Git
git init
git add .
git commit -m "OBSKUR Content Studio v1.0"

# Crée un repo sur github.com (bouton "New repository")
# Nomme-le : obskur-studio
# NE PAS cocher "Initialize with README"

# Puis dans le terminal :
git remote add origin https://github.com/TON_USERNAME/obskur-studio.git
git branch -M main
git push -u origin main
```

---

## ÉTAPE 3 — Déploie sur Vercel

1. Va sur **vercel.com** → connecte-toi avec GitHub
2. Clique **"Add New Project"**
3. Sélectionne ton repo **obskur-studio**
4. Vercel détecte automatiquement Vite → clique **"Deploy"**
5. En 2 minutes tu reçois une URL du type :
   `https://obskur-studio.vercel.app`

---

## ÉTAPE 4 — Installe l'app sur ton téléphone

### Sur iPhone (Safari) :
1. Ouvre l'URL dans **Safari** (pas Chrome)
2. Tape l'icône **Partager** (carré avec flèche)
3. Scroll → **"Sur l'écran d'accueil"**
4. Nomme-la **OBSKUR** → Ajouter
5. ✓ L'icône apparaît sur ton bureau

### Sur Android (Chrome) :
1. Ouvre l'URL dans **Chrome**
2. Une bannière apparaît : "Ajouter à l'écran d'accueil"
   (ou via menu ⋮ → "Ajouter à l'écran d'accueil")
3. ✓ L'icône apparaît sur ton bureau

---

## MISES À JOUR FUTURES

Quand tu veux modifier l'app :
```bash
# Modifie le code dans src/App.jsx
# Puis :
git add .
git commit -m "Update : description de la modif"
git push
# → Vercel redéploie automatiquement en 1 minute
```

---

## DOMAINE PERSONNALISÉ (optionnel)

Si tu veux `studio.obskur.com` au lieu de `obskur-studio.vercel.app` :
1. Sur Vercel → Settings → Domains
2. Ajoute ton domaine
3. Configure le DNS chez ton registrar (Vercel te donne les instructions)

---

## STRUCTURE DU PROJET

```
obskur-studio/
├── index.html          ← Point d'entrée HTML (PWA meta tags)
├── vite.config.js      ← Config Vite + PWA manifest
├── package.json        ← Dépendances
├── public/
│   └── icons/
│       ├── icon-192.png   ← Icône téléphone
│       └── icon-512.png   ← Icône haute résolution
└── src/
    ├── main.jsx        ← Point d'entrée React
    └── App.jsx         ← Toute l'application
```

---

Built in tension · OBSKUR · Dakar
