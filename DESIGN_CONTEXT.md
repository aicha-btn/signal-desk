# SignalDesk - Contexte design operationnel

Ce fichier est le minimum obligatoire a lire avant toute tache frontend ou UI.

La reference detaillee reste `DESIGN_SYSTEM.md`. Utiliser `DESIGN_TASK_ROUTER.md` et `./scripts/design-context.sh <topic>` pour charger seulement les sections utiles.

## Promesse

> Un instrument de precision habille comme un objet culturel : radical dans son expression, calme dans son usage et impeccable dans sa fonction.

L'utilisateur doit penser :

> Je n'ai jamais vu un SaaS B2B comme celui-ci, mais je comprends immediatement comment il fonctionne.

## Principes non negociables

1. Radical, jamais chaotique.
2. Calme au repos, expressif a l'action.
3. Pop et professionnel.
4. Brut dans les masses, delicat dans les details.
5. Familier dans l'usage, singulier dans l'expression.
6. La donnee domine toujours la decoration.

## Personnalite

Mots directeurs : radical, precis, pop, chaleureux, structure.

Mots interdits : froid, neutre, conventionnel, bancaire, judiciaire, enfantin, nostalgique, chaotique.

Formule : direction artistique d'une architecte, allure d'une DJ, methodologie d'une ingenieure.

## Niveaux d'expression

| Surface | Niveau |
|---|---:|
| Landing page | 9/10 |
| Onboarding | 7/10 |
| Control Room | 7/10 |
| Signal Feed | 6/10 |
| Detail d'un Signal | 6/10 |
| Clients | 5/10 |
| Formulaire public | 7/10 |
| Authentification | 6/10 |
| Formulaires internes | 4/10 |
| Membres, permissions, parametres | 3/10 |
| Pages legales | 2/10 |

Un composant ne depasse jamais le niveau de sa page.

## Vocabulaire produit

| Terme | Sens |
|---|---|
| Signal | Feedback |
| Signal Feed | Liste des feedbacks |
| Control Room | Dashboard |
| Pulse | Tendance actuelle |
| Intensity | Priorite |
| Incoming | Nouveau |
| In Focus | A analyser |
| On Track | Planifie |
| Closed Loop | Resolu |
| Capture a Signal | Creer un feedback |

L'interface est prioritairement en anglais. Un terme de marque ambigu reste accompagne d'un label explicite.

## Palette v1

| Role | Valeur | Texte |
|---|---|---|
| Signal Ink | `#121212` | Paper |
| Paper | `#FFFFFF` | Signal Ink |
| Canvas | `#F4F5F7` | Signal Ink |
| Electric Cobalt | `#2447FF` | Paper |
| Signal Coral | `#FF5A45` | Signal Ink |
| Acid Light | `#D8FF3E` | Signal Ink |
| Controlled Magenta | `#F13EAF` | Signal Ink |
| Closed Mint | `#45D49E` | Signal Ink |
| Clear Cyan | `#57D9E8` | Signal Ink |

Pas de couleur brute hors tokens. Une page applicative utilise une couleur dominante, une couleur d'accent, les couleurs semantiques necessaires et la gamme neutre.

## Typographie

- Display candidate : Archivo Variable.
- Interface candidate : Instrument Sans.
- Technique candidate : IBM Plex Mono.
- Letter-spacing toujours `0`.
- Aucun texte dimensionne selon la largeur du viewport.
- Titres massifs uniquement sur landing et vraies zones hero.
- Titres compacts dans panneaux, formulaires, tableaux et sidebars.
- Corps minimum 14 px dans l'application.
- Chiffres tabulaires dans les tableaux.

## Formes et structure

- angles francs et rayons faibles ;
- rayons autorises : 0, 2, 4, 6 et 8 px ;
- aucun composant applicatif au-dessus de 8 px ;
- bordures 1, 2 ou 4 px ;
- pas de cards imbriquees ;
- pas de section transformee en card flottante ;
- pas de dashboard compose uniquement de cards ;
- ombres rares et fonctionnelles ;
- aucun blob, orbe, bokeh ou degrade SaaS generique.

## Espacement

Base de 4 px.

Tokens : 4, 8, 12, 16, 24, 32, 48, 64, 96 et 128 px.

Les valeurs 96 et 128 sont reservees au marketing.

## Dimensions stables

- sidebar : 232 px ouverte, 64 px reduite ;
- topbar : 64 px ;
- champ : 44 px ;
- bouton : 32, 40 ou 48 px ;
- IconButton : 32 ou 40 px, minimum tactile 44 px ;
- SignalRow : 64 px standard, 48 px compact, 80 px mobile ;
- modal : 420, 560 ou 720 px ;
- formulaire standard : 720 px maximum.

Aucun hover, loader, label ou compteur ne modifie les dimensions de son parent.

## Composants signatures

### SignalStrip

Rail fixe de 6 px exprimant etat ou intensite par couleur, motif et remplissage. Sa largeur ne change jamais.

### IntensityMeter

Quatre segments fixes. Le nombre de segments actifs, la couleur, le motif et le label expriment la priorite.

### SignalStatus

Rectangle compact de 28 px avec couleur, motif, icone et label. Jamais une pastille seule.

### SignalRow

Table professionnelle enrichie par SignalStrip, statut et intensity. Grille stable, deux lignes de titre maximum, actions accessibles au clavier.

### Signal Pulse

Visualisation de volume entrant, intensity moyenne, vitesse de resolution et tendance. Jamais un score opaque.

## Mouvement

- GSAP et ScrollTrigger reserves a la landing et a la presentation portfolio ;
- pas de scroll hijacking ;
- pas de rebond cartoon ;
- pas de mouvement permanent ;
- application : 120, 180, 260 ou 320 ms ;
- marque : 600 ms maximum pour une celebration ;
- marketing : 600 a 1200 ms ;
- `prefers-reduced-motion` obligatoire ;
- l'interface reste complete sans animation.

## Assets

- landing avec bitmap ou scene immersive pleine largeur ;
- pas de hero split-screen ;
- pas de hero dans une card ;
- pas de simple degrade ou SVG generique comme visuel principal ;
- pas de photo de stock ;
- pas de personnage cartoon ;
- pas d'image sombre ou floue qui cache le produit ;
- application coherente meme sans image.

## Responsive et accessibilite

- verifier 390, 768, 1440 et 1728 px ;
- desktop-first pour l'application, mobile-first pour le formulaire public ;
- tableau transforme en liste structuree sur mobile ;
- cible tactile minimum 44 px ;
- WCAG 2.2 AA ;
- contraste texte 4.5:1 minimum ;
- focus visible 2 px avec offset 2 px ;
- clavier complet ;
- couleur jamais seule porteuse de sens ;
- zoom 200 % ;
- reduced-motion ;
- aucun debordement ou chevauchement.

## Voix

Concise, competente, assuree, chaleureuse et legerement impertinente dans le marketing.

Pas d'humour dans les erreurs, permissions, suppressions ou securite. Pas de jargon corporate. Pas de « Oops ».

## Interdictions rapides

- pas de cards dans des cards ;
- pas de gros rayons mous ;
- pas de boutons pills par defaut ;
- pas de texte dans un bouton si une icone universelle suffit ;
- pas d'icone inhabituelle sans tooltip ;
- pas de couleur seule pour statut ou priorite ;
- pas d'animation dans les tableaux pendant la lecture ;
- pas de valeur visuelle arbitraire ;
- pas de divergence non documentee.

## Avant de terminer

Lire les sections 29 et 30 de `DESIGN_SYSTEM.md`, verifier les quatre viewports, tous les etats, clavier, contrastes et reduced-motion, puis produire des captures pour les changements visuels importants.
