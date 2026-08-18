# SignalDesk - Plan d'action technique et produit

## Decision structurante

SignalDesk sera volontairement construit comme une application fullstack avec deux applications distinctes :

- Next.js pour l'experience utilisateur et la couche web ;
- Ruby on Rails en API only pour le coeur metier ;
- Supabase pour l'authentification et l'hebergement PostgreSQL ;
- Resend pour les emails transactionnels.

Rails n'est pas une API decorative. Toutes les donnees metier, les permissions, les validations serveur et les regles produit passent par Rails.

Next.js n'est pas non plus une simple maquette. Il gere le rendu serveur, les parcours, les formulaires, les etats d'interface et la communication securisee avec l'API Rails.

Cette architecture est plus complexe qu'une application Next.js fullstack seule, mais elle est justifiee par l'objectif du portfolio : demontrer a la fois une vraie competence Rails et une vraie competence Next.js.

## Objectif du projet

Construire un SaaS B2B de gestion de retours clients suffisamment credible pour montrer que je peux :

- comprendre un probleme produit ;
- definir et livrer un MVP realiste ;
- construire une interface Next.js moderne ;
- concevoir une API REST Rails ;
- modeliser une base PostgreSQL ;
- gerer une authentification externe ;
- implementer une autorisation multi-workspace ;
- tester les parcours importants ;
- deployer une architecture frontend/backend separee.

## Pitch court

SignalDesk aide les equipes produit a centraliser, organiser et prioriser les retours clients.

## Probleme resolu

Dans une startup SaaS, les retours clients arrivent depuis plusieurs sources : emails, Slack, support, appels, formulaires et notes internes.

Ces retours sont facilement oublies, dupliques ou difficiles a prioriser.

SignalDesk devient le point central ou une equipe peut collecter, qualifier, rechercher et suivre les feedbacks jusqu'a leur resolution.

## Utilisateurs cibles

- Product Managers ;
- Customer Success Managers ;
- equipes support ;
- fondateurs de petites startups SaaS ;
- equipes produit B2B.

## Persona principale

Une Product Manager dans une petite startup SaaS B2B qui recoit beaucoup de retours clients et doit identifier les demandes les plus importantes.

## Message a envoyer au recruteur

SignalDesk montre que je sais construire une interface SaaS avec Next.js et TypeScript, concevoir une API REST avec Rails, modeliser PostgreSQL, integrer une authentification externe, proteger une application multi-tenant, ecrire des tests et deployer plusieurs composants qui communiquent proprement.

## Architecture retenue

```text
Navigateur
  -> Application Next.js
       -> Supabase Auth
       -> API Rails
            -> PostgreSQL heberge par Supabase
            -> Resend pour les emails metier
```

Responsabilites des services :

```text
Next.js   -> interface, SSR, navigation, formulaires, etats UI, BFF leger
Rails     -> API, logique metier, validations, permissions, transactions, requetes SQL
Supabase  -> authentification et PostgreSQL manage
Resend    -> emails d'authentification et emails metier
Vercel    -> hebergement Next.js
Render    -> hebergement Rails
GitHub    -> repository, pull requests et CI
```

## Principe de circulation des donnees

Les donnees metier ne sont jamais lues ou modifiees directement depuis Supabase par le frontend.

Le parcours normal est toujours :

```text
Next.js -> API Rails -> PostgreSQL
```

Supabase est utilise comme fournisseur d'identite et comme hebergeur PostgreSQL. Rails reste l'unique porte d'entree vers les donnees metier.

Ce choix rend le role de Rails visible, testable et defendable en entretien.

## Architecture du repository

Le projet sera organise dans un monorepo.

```text
signal-desk/
  apps/
    web/        # Next.js
    api/        # Rails API only
  docs/
  README.md
```

Avantages :

- une seule histoire Git pour un seul produit ;
- une seule pull request peut montrer une fonctionnalite complete ;
- la CI peut tester separement le frontend et l'API ;
- les decisions produit et techniques restent centralisees ;
- le recruteur comprend rapidement l'architecture.

## Stack frontend

### Technologies conservees

- Next.js avec App Router ;
- React ;
- TypeScript strict ;
- Tailwind CSS ;
- composants accessibles inspires de shadcn/ui ;
- React Hook Form pour les formulaires complexes ;
- Zod pour les validations frontend ;
- Lucide pour les icones.

### TanStack Query

TanStack Query ne sera pas installe au demarrage.

Les Server Components, les Server Actions et les parametres d'URL suffisent pour le premier MVP.

TanStack Query sera ajoute uniquement si un besoin concret apparait, par exemple :

- mise a jour optimiste des commentaires ;
- rafraichissement client frequent ;
- cache client partage entre plusieurs ecrans ;
- interactions riches sans nouvelle navigation.

### Ce que Next.js doit demontrer

- App Router et layouts imbriques ;
- Server Components pour les lectures initiales ;
- Client Components uniquement pour les interactions necessaires ;
- Server Actions pour les mutations provenant des formulaires ;
- gestion propre des cookies et de la session Supabase ;
- pages loading, error, not-found et empty state ;
- filtres synchronises dans l'URL ;
- formulaires accessibles et validations utilisables ;
- interface responsive de niveau SaaS ;
- frontiere claire entre code serveur et code navigateur.

## Stack backend

### Technologies conservees

- Ruby on Rails en API only ;
- Active Record ;
- PostgreSQL ;
- RSpec ;
- Factory Bot ;
- Pundit ;
- gem JWT pour verifier les jetons Supabase ;
- Rack::Attack pour proteger les endpoints publics ;
- Action Mailer avec le SDK Resend.

### Ce que Rails doit demontrer

- API REST versionnee sous `/api/v1` ;
- routes et controleurs minces ;
- modeles Active Record avec associations et validations ;
- contraintes et index PostgreSQL ;
- policies et policy scopes Pundit ;
- service objects pour les operations metier ;
- query objects pour les filtres et statistiques ;
- transactions lors des operations multi-etapes ;
- reponses JSON coherentes ;
- pagination et metadonnees ;
- gestion centralisee des erreurs ;
- tests de modeles, policies, services et requetes API ;
- emails Rails via Action Mailer et Resend.

### Ce que Rails ne doit pas devenir

- une simple couche qui transmet les requetes a Supabase ;
- une collection de controleurs contenant toute la logique ;
- une API generique surdimensionnee ;
- une architecture avec trop de gems et d'abstractions prematurees.

## Authentification

### Choix retenu

Supabase Auth remplace Clerk et Devise.

Devise n'est pas ajoute car il dupliquerait la responsabilite de Supabase Auth et compliquerait l'authentification entre Next.js et une API sur un autre domaine.

### Parcours d'authentification

```text
1. L'utilisateur se connecte depuis Next.js avec Supabase Auth.
2. Supabase place la session dans des cookies geres cote serveur.
3. Next.js recupere le jeton d'acces pour appeler Rails.
4. Next.js transmet `Authorization: Bearer <token>` a Rails.
5. Rails verifie la signature du JWT avec le endpoint JWKS de Supabase.
6. Rails retrouve l'utilisateur local avec le claim `sub`.
7. Rails applique les policies Pundit et execute l'action.
```

Rails doit verifier au minimum :

- la signature ;
- l'algorithme attendu ;
- l'expiration ;
- l'emetteur ;
- l'audience si elle est configuree ;
- la presence du claim `sub`.

Les cles publiques JWKS sont mises en cache avec une duree courte et peuvent etre renouvelees lors d'une rotation.

### Synchronisation de l'utilisateur

Rails possede une table `users` metier distincte de `auth.users`.

Lors de la premiere requete authentifiee, Rails cree ou met a jour l'utilisateur local a partir du `sub` Supabase.

Le mot de passe n'est jamais stocke dans Rails.

## Autorisation et isolation multi-workspace

L'authentification repond a la question « qui est la personne ? ».

Rails et Pundit repondent a la question « que peut-elle faire dans ce workspace ? ».

Regles principales :

- un utilisateur ne voit que les workspaces auxquels il appartient ;
- toutes les ressources metier sont scopees par workspace ;
- un membre peut gerer les feedbacks, clients et commentaires ;
- un admin peut gerer les membres et les parametres ;
- un owner possede tous les droits et ne peut pas etre retire accidentellement ;
- le formulaire public peut uniquement creer un feedback ;
- aucun endpoint ne doit faire confiance a un `workspace_id` sans verifier le membership.

Rails utilise `Current.user` et `Current.workspace` pour porter le contexte de la requete.

Les Pundit policy scopes filtrent les collections avant la pagination.

## Securite de la base Supabase

Rails possede les migrations du schema metier. Il ne faut pas maintenir en parallele des migrations Rails et des migrations Supabase pour les memes tables.

La configuration Rails utilisera `structure.sql` afin de conserver correctement les extensions, contraintes et regles SQL.

Les tables metier ne doivent pas etre accessibles depuis la Data API Supabase avec la cle publique.

Deux protections seront utilisees :

- aucun privilege metier utile pour les roles Supabase `anon` et `authenticated` ;
- RLS activee sans policy d'acces direct pour ces roles.

Rails utilise une connexion PostgreSQL serveur et applique l'autorisation avec Pundit.

La cle `service_role` Supabase ne doit jamais etre exposee dans Next.js cote navigateur.

## Modele de donnees cible

### User

Profil metier lie au `sub` Supabase.

Champs principaux :

- `id` ;
- `supabase_user_id` unique ;
- `email` ;
- `display_name` ;
- timestamps.

### Workspace

Organisation qui possede les donnees.

Champs principaux :

- `id` ;
- `name` ;
- `slug` unique ;
- `public_form_enabled` ;
- `public_form_token` ou slug public ;
- timestamps.

### Membership

Lien entre un utilisateur et un workspace.

Roles :

- `owner` ;
- `admin` ;
- `member`.

Contrainte unique : un seul membership par couple utilisateur/workspace.

### WorkspaceInvitation

Invitation a rejoindre un workspace.

Champs principaux :

- email ;
- role ;
- token chiffre ou empreinte du token ;
- date d'expiration ;
- date d'acceptation ;
- utilisateur ayant envoye l'invitation.

### Customer

Client concerne par les retours.

Champs principaux :

- workspace ;
- name ;
- company ;
- email facultatif ;
- external_reference facultative ;
- timestamps.

### Feedback

Retour client principal.

Champs principaux :

- workspace ;
- customer facultatif ;
- title ;
- description ;
- status ;
- priority ;
- source ;
- created_by facultatif pour les soumissions publiques ;
- submitted_name et submitted_email facultatifs ;
- timestamps.

Statuts :

- `new` ;
- `reviewing` ;
- `planned` ;
- `resolved`.

Priorites :

- `low` ;
- `medium` ;
- `high` ;
- `critical`.

Sources :

- `internal` ;
- `public_form` ;
- `email` ;
- `support` ;
- `call` ;
- `other`.

### Tag

Etiquette limitee a un workspace.

Le nom est unique dans un workspace.

### FeedbackTag

Table de liaison entre feedbacks et tags.

Le couple feedback/tag est unique.

### Comment

Commentaire interne ajoute par un membre.

Un commentaire appartient a un feedback et a un auteur.

### ActivityEvent

Historique simple des actions metier importantes.

Exemples :

- feedback cree ;
- statut modifie ;
- priorite modifiee ;
- commentaire ajoute ;
- membre invite.

## Relations principales

```text
User
  -> Memberships
  -> Workspaces

Workspace
  -> Memberships
  -> WorkspaceInvitations
  -> Customers
  -> Feedbacks
  -> Tags

Customer
  -> Feedbacks

Feedback
  -> Customer
  -> Tags via FeedbackTags
  -> Comments
  -> ActivityEvents
```

## API Rails cible

### Session et onboarding

- `GET /api/v1/me`
- `POST /api/v1/onboarding`
- `GET /api/v1/workspaces`
- `POST /api/v1/workspaces`
- `PATCH /api/v1/workspaces/:id`

### Feedbacks

- `GET /api/v1/workspaces/:workspace_id/feedbacks`
- `POST /api/v1/workspaces/:workspace_id/feedbacks`
- `GET /api/v1/workspaces/:workspace_id/feedbacks/:id`
- `PATCH /api/v1/workspaces/:workspace_id/feedbacks/:id`
- `DELETE /api/v1/workspaces/:workspace_id/feedbacks/:id`

La liste accepte :

- `query` ;
- `status` ;
- `priority` ;
- `customer_id` ;
- `tag_id` ;
- `sort` ;
- `page` ;
- `per_page`.

### Clients

- `GET /api/v1/workspaces/:workspace_id/customers`
- `POST /api/v1/workspaces/:workspace_id/customers`
- `GET /api/v1/workspaces/:workspace_id/customers/:id`
- `PATCH /api/v1/workspaces/:workspace_id/customers/:id`

### Tags

- `GET /api/v1/workspaces/:workspace_id/tags`
- `POST /api/v1/workspaces/:workspace_id/tags`
- `PATCH /api/v1/workspaces/:workspace_id/tags/:id`
- `DELETE /api/v1/workspaces/:workspace_id/tags/:id`

### Commentaires

- `GET /api/v1/workspaces/:workspace_id/feedbacks/:feedback_id/comments`
- `POST /api/v1/workspaces/:workspace_id/feedbacks/:feedback_id/comments`
- `DELETE /api/v1/workspaces/:workspace_id/feedbacks/:feedback_id/comments/:id`
- `GET /api/v1/workspaces/:workspace_id/feedbacks/:feedback_id/activity_events`

### Membres et invitations

- `GET /api/v1/workspaces/:workspace_id/members`
- `GET /api/v1/workspaces/:workspace_id/invitations`
- `POST /api/v1/workspaces/:workspace_id/invitations`
- `DELETE /api/v1/workspaces/:workspace_id/invitations/:id`
- `GET /api/v1/invitations/:token`
- `POST /api/v1/invitations/:token/accept`

### Dashboard

- `GET /api/v1/workspaces/:workspace_id/dashboard`

### Formulaire public

- `GET /api/v1/public/forms/:slug`
- `POST /api/v1/public/forms/:slug/feedbacks`

## Format des reponses API

Les erreurs utilisent un format stable :

```json
{
  "error": {
    "code": "validation_failed",
    "message": "The request is invalid",
    "details": {
      "title": ["can't be blank"]
    }
  }
}
```

Les listes renvoient les metadonnees de pagination :

```json
{
  "feedbacks": [],
  "total": 48,
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 48,
    "total_pages": 3
  }
}
```

## Services Rails a forte valeur portfolio

### CreateFeedback

Ce service cree le feedback, associe les tags et ajoute un `ActivityEvent` dans une transaction.

### UpdateFeedbackStatus

Ce service valide la transition, met a jour le feedback et journalise l'ancien et le nouveau statut.

### InviteWorkspaceMember

Ce service cree une invitation a duree limitee et declenche un email Resend.

### AcceptWorkspaceInvitation

Ce service verifie le token, l'email et l'expiration puis cree le membership dans une transaction.

### FeedbackSearchQuery

Ce query object combine recherche, filtres, tri et pagination sans surcharger le controleur.

### DashboardMetricsQuery

Ce query object produit les statistiques avec des aggregations PostgreSQL simples.

## MVP en deux niveaux

### MVP coeur

Le premier produit fonctionnel contient :

1. inscription et connexion avec Supabase Auth ;
2. creation du profil Rails ;
3. creation automatique d'un workspace ;
4. creation et modification de feedbacks ;
5. statuts et priorites ;
6. creation de clients ;
7. association feedback/client ;
8. tags ;
9. recherche, filtres et tri ;
10. page detaillee d'un feedback ;
11. autorisation Pundit ;
12. isolation multi-workspace.

### Version portfolio complete

Une fois le coeur stable :

1. commentaires internes ;
2. historique simple ;
3. dashboard avec statistiques ;
4. membres et invitations ;
5. email d'invitation via Rails et Resend ;
6. formulaire public protege ;
7. pagination ;
8. tests end-to-end ;
9. donnees de demonstration.

## Hors MVP

- resume IA ;
- categorisation IA ;
- import CSV ;
- export CSV ;
- Slack ;
- votes ;
- fusion de doublons ;
- journal d'audit exhaustif ;
- API publique pour des integrations tierces ;
- cles API ;
- temps reel ;
- pieces jointes ;
- facturation Stripe ;
- jobs asynchrones et worker dedie.

## Formulaire public et abus

Le formulaire public ne doit jamais ecrire directement dans Supabase.

Il appelle un endpoint Rails dedie avec :

- validation stricte ;
- limite de taille ;
- champ honeypot ;
- rate limiting Rack::Attack ;
- aucune information privee renvoyee ;
- journalisation minimale des refus.

Un CAPTCHA externe ne sera ajoute que si le besoin apparait reellement.

## Emails

Resend est conserve.

Usages :

- SMTP Resend configure dans Supabase pour les emails d'authentification ;
- SDK Resend comme delivery method Action Mailer dans Rails ;
- invitation de membre envoyee par Rails ;
- notifications produit uniquement apres le MVP.

Pour envoyer a des destinataires autres que le compte de test, un domaine possede et verifie est necessaire.

## Monitoring

Sentry n'est pas ajoute au MVP.

Pour commencer :

- logs Vercel pour Next.js ;
- logs Render pour Rails ;
- logs Supabase pour Auth et PostgreSQL ;
- identifiant de requete partage entre Next.js et Rails ;
- endpoint Rails `/up` pour verifier la sante de l'API.

Sentry sera ajoute uniquement si l'application recoit de vrais utilisateurs ou si les logs ne suffisent plus.

## Strategie de tests

### Rails

- tests de modeles pour validations et associations importantes ;
- tests Pundit pour chaque role ;
- tests des policy scopes multi-workspace ;
- tests de service objects ;
- request specs pour les endpoints principaux ;
- tests des filtres et de la pagination ;
- test garantissant qu'un membre ne peut pas acceder a un autre workspace ;
- test du endpoint public et de son rate limiting.

### Next.js

- tests unitaires des schemas Zod et fonctions pures ;
- React Testing Library pour quelques composants critiques ;
- test des etats loading, empty et error ;
- Playwright pour le parcours principal.

### Parcours end-to-end prioritaire

```text
Connexion
  -> creation du workspace
  -> creation d'un client
  -> creation d'un feedback
  -> filtrage du feedback
  -> consultation de sa page detaillee
```

## CI GitHub Actions

La CI contient deux jobs principaux.

### Job web

- installation Node ;
- lint ;
- verification TypeScript ;
- tests frontend ;
- build Next.js.

### Job API

- installation Ruby ;
- service PostgreSQL ;
- migrations ;
- RuboCop ;
- RSpec.

Le test end-to-end peut rester dans un job separe lance sur la branche principale afin de ne pas ralentir toutes les pull requests.

## Deploiement retenu

### Next.js

Vercel Hobby pour le portfolio personnel.

### Rails

Render est le choix effectivement deploye pour l'API Rails :

- deploiement depuis le monorepo GitHub ;
- un seul processus Puma avec une concurrence limitee ;
- endpoint `/up` utilise pour la sante et le reveil du service ;
- cron externe actif uniquement pendant les heures utiles ;
- demarrage a froid accepte en dehors de cette plage.

### PostgreSQL et Auth

Supabase Free.

Limite importante : un projet gratuit peu actif peut etre mis en pause apres sept jours. Pendant une periode de candidatures, le projet doit etre verifie regulierement et relance avant de partager son lien.

### Emails

Resend Free, avec un domaine verifie.

## Nombre minimal de services externes

Services necessaires en production :

1. Vercel pour Next.js ;
2. Render pour Rails ;
3. Supabase pour Auth et PostgreSQL ;
4. Resend pour les emails.

GitHub est utilise pour le code et la CI, mais ne fait pas partie du chemin d'execution de l'application.

Conserver Rails et Next.js comme applications deployees distinctes rend difficile de descendre sous ces quatre services sans perdre en simplicite ou en qualite de demonstration.

Services explicitement retires :

- Clerk ;
- Firebase ;
- base PostgreSQL Render ;
- Sentry au demarrage ;
- stockage externe ;
- Redis ;
- service de recherche ;
- service de jobs asynchrones ;
- CAPTCHA externe.

## Roadmap verticale

### Etat d'avancement au 18 aout 2026

| Phase | Etat | Livre | Reste principal |
| --- | --- | --- | --- |
| 1. Cadrage et architecture | Avance | Plan produit, architecture, design system et routeur de contexte | Separer les livrables produit/API dans `docs/` |
| 2. Fondations techniques | Termine | Monorepo, Next.js, Rails, Supabase, commandes racine, CI, Vercel et Render | Maintenance uniquement |
| 3. Auth et workspace | Termine | Supabase Auth SSR, JWT Rails, onboarding, memberships, Pundit et isolation | Maintenance uniquement |
| 4. Feedback vertical | Termine | Creation, liste, detail, edition, suppression, erreurs et request specs | Maintenance uniquement |
| 5. Clients, tags et recherche | Termine | Clients, association client/Signal, tags, recherche, filtres, tri, pagination et URL partageables | Maintenance uniquement |
| 6. Collaboration et dashboard | Termine | Control Room, statistiques reelles, commentaires, ActivityEvents, services transactionnels et etats complets | Maintenance uniquement |
| 7. Membres et emails | Termine cote code | Invitations temporaires, acceptation securisee, Action Mailer, Resend et tests owner/admin/member | Ajouter la cle et l'expediteur verifies sur Render |
| 8. Formulaire public | Termine | Page publique, configuration workspace, endpoint anonyme, anti-abus et tests de securite | Maintenance uniquement |
| 9. Finition portfolio | En cours | Landing, design system, CI, E2E coeur, audit Axe, regressions accessibilite, donnees demo, README et architecture | VoiceOver, captures et verification finale |

Prochaine priorite : finaliser le README portfolio, le diagramme d'architecture et les captures de demonstration.

### Phase 1 - Cadrage et architecture

- finaliser le pitch et la persona ;
- definir les ecrans ;
- dessiner le modele de donnees ;
- definir le contrat API ;
- creer le monorepo ;
- documenter les decisions d'architecture.

Livrables :

- `docs/product-brief.md` ;
- `docs/screens.md` ;
- `docs/data-model.md` ;
- `docs/api-contract.md` ;
- `docs/architecture.md`.

### Phase 2 - Fondations techniques

- initialiser Next.js dans `apps/web` ;
- initialiser Rails API dans `apps/api` ;
- configurer PostgreSQL local ;
- configurer Supabase local ou un projet de developpement ;
- ajouter les commandes racine ;
- ajouter la CI minimale ;
- deployer une page Next.js et un endpoint Rails `/up`.

Objectif : prouver tres tot que les deux applications se lancent et se deploient.

### Phase 3 - Authentification et premier workspace

- integrer Supabase Auth dans Next.js ;
- ajouter le validateur JWT dans Rails ;
- creer `User`, `Workspace` et `Membership` ;
- ajouter Pundit ;
- creer le parcours d'onboarding ;
- tester l'isolation entre deux workspaces.

Objectif : obtenir une premiere tranche complete et securisee.

### Phase 4 - Feedback vertical

- creer le modele Feedback ;
- ajouter les migrations et contraintes ;
- creer les endpoints Rails ;
- creer la liste Next.js ;
- creer le formulaire ;
- creer la page detaillee ;
- gerer les erreurs Rails dans Next.js ;
- ajouter les request specs.

Objectif : pouvoir creer et consulter un feedback de bout en bout.

### Phase 5 - Clients, tags et recherche

- modele et ecrans clients ;
- association feedback/client ;
- tags et table de liaison ;
- recherche PostgreSQL simple ;
- filtres ;
- tri ;
- pagination ;
- URL partageable avec les filtres actifs.

### Phase 6 - Collaboration et dashboard

- commentaires ;
- ActivityEvents ;
- services Rails transactionnels ;
- statistiques ;
- dashboard Next.js ;
- etats vides, loading et erreur.

### Phase 7 - Membres et emails

- gestion des membres ;
- invitations temporaires ;
- acceptation d'invitation ;
- Action Mailer ;
- Resend ;
- tests de roles owner, admin et member.

### Phase 8 - Formulaire public

- [x] page publique Next.js responsive ;
- [x] activation par workspace et URL copiable dans Settings ;
- [x] endpoint public Rails a surface de donnees minimale ;
- [x] creation d'un feedback avec ou sans coordonnees ;
- [x] honeypot, limites de taille et rate limits par IP/workspace ;
- [x] CORS restreint aux origines SignalDesk ;
- [x] tests de validation, permissions et anti-abus.

### Phase 9 - Finition portfolio

- [x] test end-to-end du login, onboarding et premier Signal ;
- [x] audit Axe WCAG 2.2 A/AA sur les ecrans coeur et publics ;
- [x] regressions clavier des skip links et selects personnalises ;
- [x] reflow 390, 720, 768, 1440 et 1728 px et reduced-motion ;
- [ ] parcours clavier exhaustif, zoom navigateur 200 % et VoiceOver ;
- [x] donnees de demonstration ;
- [x] README final ;
- [x] diagramme d'architecture ;
- [x] captures d'ecran ;
- [ ] deploiement final ;
- [ ] verification des liens ;
- [x] explication des compromis techniques.

## Definition de fini

Le projet est termine pour le portfolio quand :

- Next.js est deploye ;
- Rails est deploye ;
- PostgreSQL Supabase fonctionne ;
- Supabase Auth fonctionne ;
- Rails valide correctement les JWT ;
- un utilisateur peut creer ou rejoindre un workspace ;
- un utilisateur peut creer des clients et des feedbacks ;
- recherche, filtres et tri fonctionnent ;
- les permissions sont testees ;
- les donnees d'un workspace sont inaccessibles aux autres ;
- le dashboard affiche des statistiques reelles ;
- les invitations sont envoyees avec Resend ;
- le formulaire public est protege ;
- la CI passe ;
- au moins un test end-to-end couvre le parcours principal ;
- le README explique le produit, l'architecture et les compromis ;
- les commandes locales sont documentees ;
- une demonstration peut etre lancee sans explication orale.

## Estimation realiste

- premiere tranche authentifiee complete : 30 a 40 heures ;
- MVP coeur : 60 a 80 heures ;
- version portfolio complete : 85 a 115 heures ;
- rythme de 8 a 10 heures par semaine : environ 9 a 12 semaines.

Cette estimation est volontairement plus haute que le plan initial, car une architecture Next.js + Rails merite des tests d'integration, une vraie autorisation et deux deploiements propres.

## Ordre de priorite immediat

1. Terminer VoiceOver, le zoom navigateur et le parcours clavier exhaustif.
2. Finaliser les donnees demo et les livrables portfolio.
3. Produire les captures et verifier la demonstration de production.

## Sources techniques de reference

- Supabase Auth SSR : https://supabase.com/docs/guides/auth/server-side
- Supabase JWT et JWKS : https://supabase.com/docs/guides/auth/jwts
- Supabase signing keys : https://supabase.com/docs/guides/auth/signing-keys
- Supabase pricing : https://supabase.com/pricing
- Supabase project pausing : https://supabase.com/docs/guides/platform/free-project-pausing
- Resend avec Rails : https://resend.com/docs/send-with-rails
- Resend pricing : https://resend.com/docs/knowledge-base/what-is-resend-pricing
- Render Rails : https://render.com/docs/deploy-rails
- Vercel Hobby : https://vercel.com/docs/plans/hobby
- GitHub Actions billing : https://docs.github.com/en/billing/concepts/product-billing/github-actions
- Rails controller rate limiting : https://api.rubyonrails.org/classes/ActionController/RateLimiting/ClassMethods.html
