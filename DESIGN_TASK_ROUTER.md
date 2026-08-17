# SignalDesk - Routeur de contexte design

Ce fichier associe chaque type de tache aux sections utiles de `DESIGN_SYSTEM.md`.

Toujours lire `DESIGN_CONTEXT.md` avant les sections specialisees.

Commande :

```sh
./scripts/design-context.sh <topic>
```

## Topics disponibles

| Topic | Utiliser pour | Sections detaillees chargees |
|---|---|---|
| `core` | Toute decision visuelle generale | 2, 3, 4, 5, 6, 7 |
| `landing` | Landing, hero, marketing, FAQ | Fondations + assets + motion + pattern landing |
| `dashboard` | Control Room, metriques, graphiques | Fondations + composants data + pattern Control Room |
| `feed` | Signal Feed, table, filtres, pagination | Fondations + composants de liste + pattern Signal Feed |
| `detail` | Detail Signal, timeline, commentaires | Fondations + composants d'edition + pattern detail |
| `forms` | Formulaires et validation | Fondations + controles + etats + copy |
| `auth` | Connexion, inscription, onboarding | Marque + controles + patterns auth et onboarding |
| `public-form` | Formulaire public responsive | Marque + controles + pattern public mobile-first |
| `settings` | Membres, permissions, securite, legal | Controles sobres + patterns confiance et legal |
| `components` | Primitive ou composant metier | 9, 10, 12, 13, 14, 16, 17, 18, 19, 20, 24, 28, 30, 31, 32 |
| `motion` | GSAP, transitions, animations | Principe calme/expressif + assets + motion + reduced-motion |
| `feedback` | Loading, pending, server actions, transitions de route | Interaction + boutons + etats systeme + accessibilite |
| `charts` | Data visualisation, Signal Pulse | Fondations + composants data + visualisations + accessibilite |
| `responsive` | Mobile, tablet, layout, overflow | Grille + composants + patterns + responsive + checklists |
| `copy` | Labels, erreurs, emails, statuts | Personnalite + vocabulaire + etats + voix |
| `assets` | Logo, images, hero, iconographie | Identite + iconographie + assets + performance |
| `review` | Revue visuelle ou verification finale | 3, 5, 17, 20, 23, 24, 27, 29, 30, 31, 32, 33 |

## Regles de routage

- Une tache peut charger plusieurs topics.
- Une nouvelle page charge son topic de page, `components` et `responsive`.
- Une page avec animation charge aussi `motion`.
- Une page avec graphiques charge aussi `charts`.
- Une modification de texte visible charge `copy`.
- Une modification globale charge `core` et `review`.
- Une modification de loading, pending ou navigation asynchrone charge `feedback`.
- Une tache Rails sans effet UI ne charge aucun topic, sauf `copy` si ses sorties sont affichees.

## Exemples

```sh
./scripts/design-context.sh landing
./scripts/design-context.sh feed components responsive
./scripts/design-context.sh dashboard charts motion responsive
./scripts/design-context.sh feedback
./scripts/design-context.sh copy
./scripts/design-context.sh review
```
