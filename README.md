# Footstats - Suivi des Championnats de Football

Footstats est une application permettant de suivre les classements de championnats de football européens en affichant les matches à venir.

![Alt text](screenshots/footstats1.png?raw=true "screenshot 1")

## Fonctionnalités

- Classements des équipes
- Calendrier des matchs à venir avec :
  - Mise en évidence des matchs clés (Top 4 vs Bottom 4)
  - Identification des confrontations importantes (≤ 3 positions d'écart)
  - Statut et horaires des matchs
- Statistiques détaillées par équipe :
  - Points, matchs joués, victoires, nuls, défaites
  - Buts marqués et encaissés
  - Forme actuelle

## Structure du Projet

```
footstats/
├── components/         # Composants Vue réutilisables
├── pages/             # Routes de l'application
├── server/
│   └── api/          # Routes API du serveur
├── cache/            # Cache
├── types/            # Types TypeScript
└── utils/            # Utilitaires et helpers
```

## Prérequis

- Node.js (v18 ou supérieur)


## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/yopkool29/footballstats
cd footstats
```

2. Installer les dépendances :
```bash
pnpm install ou npm i
```

3. Configurer les variables d'environnement :
```bash
# Créer un fichier .env en copiant .env.example et éditer la clef API fourni par football-data.org :
FOOTBALL_DATA_API_KEY=your_api_key_here
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

### Installation avec Docker

Pour utiliser l'application avec Docker :

1. Configurer les variables d'environnement comme ci-dessus dans le fichier `.env`

2. Utiliser les scripts fournis :
```bash
./scripts/docker-build.sh  # Construction de l'image
./scripts/docker-start.sh    # Démarrage du conteneur (en mode bloquant)
```

L'application sera disponible sur `http://localhost:3000`

## Stack Technique

- **Frontend** : 
  - Nuxt 3 avec Vue 3 Composition API
  - Nuxt UI pour les composants
  - TailwindCSS pour le style
- **Backend** :
  - API Routes Nuxt
- **API Externe** :
  - api-football via api-sports.io
  - Limitations : 100 requêtes/jour (tier gratuit)
  - Rafraîchissement des données : 15 minutes
