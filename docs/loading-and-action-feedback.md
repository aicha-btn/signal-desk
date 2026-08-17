# SignalDesk - Contrat de loading et feedback d'action

Ce document definit le comportement obligatoire de toute interaction asynchrone dans SignalDesk.

La source de verite visuelle reste `DESIGN_SYSTEM.md`, sections 17 et 20. Ce fichier traduit ces regles en architecture frontend et en checklist d'implementation.

## Objectif

Chaque clic doit produire une reaction perceptible immediatement, sans bloquer la lecture ni deplacer la mise en page.

Un utilisateur ne doit jamais se demander :

> Est-ce que mon clic a fonctionne ?

## Couches de feedback

| Interaction | Feedback immediat | Feedback prolonge | Fin |
| --- | --- | --- | --- |
| Navigation interne | Rail Signal en haut du viewport | Squelette de la page si les donnees attendent | Nouvelle route visible |
| Formulaire Rails ou Supabase | Bouton disabled, Signal loader et verbe en cours | Message inline si l'attente echoue | Redirection ou message success |
| Filtre du Signal Feed | Bouton `Filtering...` stable | Rail de navigation | Resultats et URL mis a jour |
| Action destructive | Confirmation explicite | Bouton `Deleting Signal...` | Retour au feed avec confirmation |
| Deconnexion | IconButton disabled avec Signal loader | Rail pendant la redirection | Landing ou page de connexion |
| Interaction locale instantanee | Etat active/selected | Aucun loader | Etat local visible |

## Architecture

### `NavigationFeedback`

Monte dans le layout racine. Il detecte les liens internes, les formulaires GET et la navigation historique.

- visible en moins de 100 ms ;
- ne capture pas les liens externes, telechargements, nouveaux onglets ou ancres locales ;
- se ferme lorsque le pathname ou les query params changent ;
- possede un timeout de securite de 12 secondes ;
- annonce le chargement avec `aria-live` ;
- respecte `prefers-reduced-motion`.

### `PendingButtonContent`

Primitive utilisee dans tous les boutons asynchrones.

- les labels idle et pending occupent la meme cellule de grille ;
- le bouton conserve donc exactement sa largeur ;
- le label inactif reste dans le layout mais est masque et retire de l'arbre accessible ;
- le Signal loader remplace l'icone sans modifier ses dimensions.

### Squelettes de route

Le fichier `apps/web/src/app/(workspace)/loading.tsx` preserve la structure generale de l'ecran pendant le chargement des donnees.

- aucune card imbriquee ;
- aucune valeur fictive ;
- pulsation d'opacite uniquement ;
- contenu `aria-busy` et statut accessible ;
- structure responsive sans debordement.

## Regles d'implementation

1. Toute action asynchrone locale utilise `disabled={pending}` et `aria-busy={pending}`.
2. Le libelle pending contient un verbe precis : `Saving`, `Filtering`, `Deleting`, `Signing out`.
3. Un loader ne remplace jamais tout un ecran lorsque du contenu lisible existe deja.
4. Une erreur reste locale a l'action et conserve les donnees saisies.
   Les formulaires Server Action neutralisent le reset automatique de React.
5. Une navigation ne doit pas afficher un toast de succes generique.
6. Une interaction locale instantanee ne doit pas afficher de faux loading.
7. Aucun etat pending ne modifie la largeur, la hauteur ou la position de sa cible.

## Checklist QA

- [ ] Tous les liens internes declenchent le rail Signal.
- [ ] Les ancres de landing restent instantanees et sans rail.
- [ ] Tous les formulaires affichent un libelle pending.
- [ ] Tous les boutons pending sont disabled et exposes avec `aria-busy`.
- [ ] Un double-clic ne cree pas deux requetes.
- [ ] Les erreurs conservent les champs saisis.
- [ ] Les redirections terminent le loading.
- [ ] Le Signal Feed affiche son etat `Filtering...`.
- [ ] La deconnexion affiche un feedback dans l'IconButton.
- [ ] Les squelettes ne provoquent aucun layout shift incoherent.
- [ ] Les viewports 390, 768, 1440 et 1728 ne debordent pas.
- [ ] Reduced-motion supprime les translations et pulsations.
- [ ] Le clavier et le focus visible restent fonctionnels.

## Routage du contexte

Pour toute future modification de latence, transition, server action ou navigation :

```sh
./scripts/design-context.sh feedback
```
