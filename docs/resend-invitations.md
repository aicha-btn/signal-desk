# Invitations de workspace avec Resend

## Architecture

Rails possede toute la logique d'invitation : role autorise, expiration, email attendu, creation du membership et envoi Action Mailer. Next.js ne recoit jamais le token brut depuis l'API ; le token existe uniquement dans le lien envoye par email et seul son SHA-256 est stocke en base.

Une invitation expire apres sept jours. Un owner peut inviter un admin ou un member. Un admin peut uniquement inviter un member. Un member ne peut ni voir ni creer d'invitation.

## Developpement et tests

Le delivery method local est `:test`. Aucun email externe n'est envoye et aucun quota Resend n'est consomme. Les request specs inspectent `ActionMailer::Base.deliveries`.

## Activation sur Render

1. Creer une API key d'envoi dans Resend.
2. Verifier un domaine d'envoi dans Resend avant d'inviter de vraies adresses.
3. Dans Render, ouvrir `signal-desk-api` puis `Environment`.
4. Ajouter `RESEND_API_KEY` avec la cle `re_...`.
5. Ajouter `MAILER_FROM`, par exemple `SignalDesk <hello@ton-domaine.fr>`.
6. Verifier que `APP_URL` vaut `https://signal-desk-lake.vercel.app`.
7. Sauvegarder puis lancer un nouveau deploiement.

`onboarding@resend.dev` sert uniquement aux essais limites autorises par Resend. Un domaine verifie est requis pour envoyer librement aux membres invites.

## Variables

```dotenv
APP_URL=https://signal-desk-lake.vercel.app
RESEND_API_KEY=re_xxxxxxxxx
MAILER_FROM=SignalDesk <hello@ton-domaine.fr>
```

Ne jamais exposer `RESEND_API_KEY` dans Vercel, dans une variable `NEXT_PUBLIC_*`, dans Git ou dans une reponse API.
