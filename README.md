# Japan 2026 Mobile App

Application mobile conçue en React Native pour centraliser la logistique, le planning et les bonnes adresses du voyage au Japon (5 au 26 octobre 2026). L'objectif : un voyage organisé.

## Fonctionnalités Principales (MVP)
- **Menu Latéral (Drawer) :** Navigation fluide entre les différentes sections de l'application.
- **Planning Quotidien :** Vision claire des activités et des logements pour les 22 jours.
- **To-Do & Réservations :** Checklist persistante pour ne rater aucune ouverture de réservation (Shinkansen, Bus).
- **Checklist Matériel :** Suivi des batteries et du matériel de stream.

## Stack Technique
- **Framework :** [React Native](https://reactnative.dev/)
- **Navigation :** [React Navigation (Drawer)](https://reactnavigation.org/docs/drawer-navigator)
- **Stockage Local :** AsyncStorage (Persistance des données hors-ligne)
- **Cartographie :** React Native Maps

## Installation et Lancement

1. Cloner le dépôt
\`\`\`bash
git clone <url-du-repo>
\`\`\`

2. Installer les dépendances
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. Lancer l'application (iOS / Android)
\`\`\`bash
npx react-native run-ios
# ou
npx react-native run-android
\`\`\`

## 📝 Roadmap des Fonctionnalités Futures
- [ ] Ajout de la "Food Map" interactive.
- [ ] Bouton SOS (Toilettes & Kombini).
- [ ] Lexique de survie.
- [ ] Wishlist Shopping avec budget prévisionnel.
