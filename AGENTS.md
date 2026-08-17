# SignalDesk - Instructions permanentes pour Codex

Ces instructions s'appliquent a tout le repository.

## Avant toute modification

1. Lire `PLAN_SIGNALDESK.md` pour les frontieres produit et techniques si la tache touche l'architecture, les donnees ou le scope.
2. Pour toute tache frontend, UI, copywriting ou experience utilisateur, lire obligatoirement `DESIGN_CONTEXT.md`.
3. Identifier le type de tache dans `DESIGN_TASK_ROUTER.md`.
4. Executer `./scripts/design-context.sh <topic>` ou lire manuellement les sections indiquees de `DESIGN_SYSTEM.md`.
5. Ne jamais se fier uniquement au souvenir d'une conversation precedente.

## Pendant une tache UI

- Annoncer dans la mise a jour de travail le topic de design charge.
- Reutiliser les tokens et composants existants avant d'en creer de nouveaux.
- Respecter le niveau d'expression de la page.
- Traiter desktop, tablet, mobile, clavier et reduced-motion dans la meme tache.
- Implementer les etats loading, empty, error, success et disabled lorsqu'ils sont pertinents.
- Ne pas ajouter de couleur, spacing, rayon, ombre, taille ou duree arbitraire.

## Avant de terminer une tache UI

1. Relire les checklists des sections 29 et 30 de `DESIGN_SYSTEM.md`.
2. Verifier les viewports 390, 768, 1440 et 1728 lorsque la surface est responsive.
3. Produire des captures Playwright pour les changements visuels importants.
4. Verifier l'absence de debordement, chevauchement et layout shift.
5. Verifier clavier, focus visible, contraste et reduced-motion.
6. Mettre a jour le Design Lab lorsqu'un composant ou token change.

## Evolution du design system

- `DESIGN_SYSTEM.md` est la source de verite complete.
- `DESIGN_CONTEXT.md` est le resume operationnel obligatoire.
- Toute modification d'une regle globale doit mettre a jour les deux fichiers dans la meme pull request.
- Toute exception doit etre ajoutee au journal des decisions de `DESIGN_SYSTEM.md`.
- Un nouveau token ou composant n'est ajoute que s'il repond a un besoin recurrent ou retire une vraie complexite.

## Taches sans interface

Pour une tache Rails ou infrastructure sans effet utilisateur, il n'est pas necessaire de charger tout le design system.

Charger tout de meme le topic `copy` si la tache modifie :

- des messages d'erreur exposes ;
- des noms de statuts ;
- des emails ;
- des reponses API directement affichees ;
- des etats de chargement ou de reconnexion.

## Push et verification de production

Apres chaque push sur `main` :

1. Declencher explicitement le deploiement frontend avec `pnpm dlx vercel@latest --prod --yes` depuis la racine.
2. Attendre la fin complete de la commande et verifier que Vercel retourne `readyState: READY`.
3. Verifier que le deploiement est bien alias sur `https://signal-desk-lake.vercel.app`.
4. Effectuer au minimum une requete HTTP sur la landing page et une sur une route authentifiee.
5. Pour une modification Rails, attendre egalement le deploiement Render et verifier `/up` ainsi qu'une route concernee par le changement.
6. Ne jamais annoncer qu'un changement est en production sur la seule base d'un push GitHub.

Si la CLI Vercel n'est plus authentifiee ou si le projet n'est plus lie, signaler le blocage precis a l'utilisatrice et demander uniquement l'action d'acces necessaire.

## Hierarchie documentaire

En cas de contradiction :

1. accessibilite et securite ;
2. `PLAN_SIGNALDESK.md` pour les frontieres produit et techniques ;
3. `DESIGN_SYSTEM.md` pour les regles visuelles ;
4. `DESIGN_DIRECTION_35_DECISIONS.md` pour l'intention artistique ;
5. implementation locale.
