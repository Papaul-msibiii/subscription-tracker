# Étape 1 : Utiliser une image Node officielle
FROM node:18-alpine

# Étape 2 : Créer un répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste du code source
COPY . .

# Étape 6 : Exposer le port sur lequel ton app écoute (souvent 3000)
EXPOSE 3000

# Étape 7 : Démarrer l’application
CMD ["node", "app.js"]
