# SignalDesk Design System

Version : `0.1.0`

Statut : source de verite pour toute conception et implementation visuelle.

Document amont : `DESIGN_DIRECTION_35_DECISIONS.md`.

## 1. Role de ce document

Ce fichier definit les regles qui doivent guider chaque nouvel ecran, composant, animation et modification de SignalDesk.

Il doit etre consulte :

- avant de concevoir une page ;
- avant de creer un composant ;
- avant d'ajouter une couleur, une taille, une ombre ou une animation ;
- pendant la revue visuelle ;
- avant de valider une pull request qui modifie l'interface.

En cas de conflit, l'ordre de priorite est :

1. accessibilite et securite ;
2. comprehension et efficacite du parcours ;
3. coherence avec ce design system ;
4. originalite locale d'un ecran.

Une exception n'est jamais silencieuse. Elle doit etre justifiee et documentee dans la section « Journal des decisions ».

## 2. Manifeste

> SignalDesk est un instrument de precision habille comme un objet culturel : radical dans son expression, calme dans son usage et impeccable dans sa fonction.

La promesse visuelle est :

> Je n'ai jamais vu un SaaS B2B comme celui-ci, mais je comprends immediatement comment il fonctionne.

## 3. Principes directeurs

### 3.1 Radical, jamais chaotique

L'originalite vient de la typographie, des aplats, des angles, des changements d'echelle et de la composition. Elle ne vient pas d'une navigation incomprehensible ou d'une accumulation d'effets.

### 3.2 Calme au repos, expressif a l'action

Une page stable ne bouge pas en permanence. Le mouvement apparait lorsqu'une action, une transition ou un changement d'etat le justifie.

### 3.3 Pop et professionnel

La couleur est franche et culturelle. Les donnees, controles et permissions restent rigoureux, previsibles et exacts.

### 3.4 Brut et delicat

Les compositions utilisent des masses fortes et des contours nets. Les details, espacements, transitions et textes sont soignes.

### 3.5 Familier dans l'usage, singulier dans l'expression

Un bouton reste identifiable comme un bouton. Un tableau reste scannable comme un tableau. Leur traitement visuel appartient cependant clairement a SignalDesk.

### 3.6 La donnee domine la decoration

Dans l'application, aucun element decoratif ne doit masquer, deplacer ou rendre ambigue une information metier.

## 4. Personnalite

SignalDesk est :

- radical ;
- precis ;
- pop ;
- chaleureux ;
- structure ;
- elegant ;
- assure ;
- legerement provocateur.

SignalDesk n'est jamais :

- froid ;
- neutre ;
- conventionnel ;
- bancaire ;
- judiciaire ;
- enfantin ;
- nostalgique ;
- chaotique ;
- humoristique sans raison.

La formule de personnalite est :

> Direction artistique d'une architecte, allure d'une DJ, methodologie d'une ingenieure.

## 5. Echelle d'expression

Chaque surface recoit un niveau d'expression de 1 a 10. Ce niveau controle la quantite de couleur, le contraste d'echelle, les assets et le mouvement.

| Surface | Niveau | Regle |
|---|---:|---|
| Landing page | 9 | Typographie massive, palette complete, GSAP, assets de marque |
| Onboarding | 7 | Experience memorable mais courte et guidee |
| Control Room | 7 | Composition editoriale, donnees dominantes, mouvement ponctuel |
| Signal Feed | 6 | Table structuree avec marqueurs de marque |
| Detail d'un Signal | 6 | En-tete fort, dossier de travail calme |
| Clients | 5 | Identites visuelles controlees, densite moyenne |
| Formulaire public | 7 | Marque forte, parcours tres simple |
| Formulaires internes | 4 | Fonctionnels, nets, peu decoratifs |
| Membres et permissions | 3 | Confiance, precision et explicite |
| Authentification | 6 | Marque visible, formulaire rassurant |
| Parametres et securite | 3 | Sobriete structuree |
| Emails | 5 | Identite nette, contenu prioritaire |
| FAQ | 4 | Editoriale mais calme |
| CGU, confidentialite | 2 | Lisibilite et confiance avant tout |

Un composant ne doit jamais depasser le niveau d'expression de la page qui le contient.

## 6. Univers et vocabulaire visuel

SignalDesk est un studio de controle des signaux clients. Il ne doit pas ressembler a un cockpit de science-fiction.

Elements conceptuels :

- le signal : information entrante ;
- l'intensite : priorite ;
- le pulse : pression et tendance ;
- la boucle : cycle entre reception et resolution ;
- l'interference : erreur ou interruption ;
- la stabilisation : resolution ou succes.

Ces concepts s'expriment par des lignes, bandes, interruptions, aplats et rythmes. Ils ne doivent pas etre illustres litteralement par des radars, satellites, ondes neon ou interfaces futuristes.

## 7. Vocabulaire produit

L'interface est prioritairement en anglais. Les termes de marque ne remplacent pas la clarte.

| Terme SignalDesk | Sens metier | Usage principal |
|---|---|---|
| `Signal` | Feedback | Nom d'objet dans l'interface |
| `Signal Feed` | Liste des feedbacks | Navigation et titre de page |
| `Control Room` | Dashboard | Navigation et titre de page |
| `Pulse` | Tendance actuelle | Dashboard et data visualisation |
| `Intensity` | Priorite | Champs et filtres |
| `Incoming` | Nouveau | Statut |
| `In Focus` | A analyser | Statut |
| `On Track` | Planifie | Statut |
| `Closed Loop` | Resolu | Statut |
| `Capture a Signal` | Creer un feedback | Action principale |

Lors de la premiere utilisation, un terme de marque peut etre accompagne d'une explication courte, par exemple `Intensity - Priority`.

## 8. Logo et signes distinctifs

### 8.1 Wordmark

Le nom s'ecrit toujours `SignalDesk`.

La wordmark doit etre :

- epaisse ;
- compacte ;
- geometrique ;
- stable en monochrome ;
- lisible a petite taille ;
- sans effet nostalgique ou futuriste caricatural.

### 8.2 Symbole

Le symbole sera construit autour d'une impulsion, d'une barre interrompue ou d'un angle coupe.

Il doit fonctionner :

- en favicon ;
- en 16 px ;
- en une couleur ;
- sur fond clair et sombre ;
- dans une animation de moins de 600 ms.

### 8.3 Interdictions

- aucune mascotte ;
- aucune bulle de discussion generique comme symbole principal ;
- aucun radar, satellite ou eclair ;
- aucun degrade comme identite principale ;
- aucune version du logo differente par page.

Le dessin final du logo reste a produire. Jusqu'a validation, la wordmark textuelle est la reference.

## 9. Couleurs

### 9.1 Regle generale

La palette est multicolore, franche et fondee sur des aplats. Les couleurs vives sont des accents, pas des fonds permanents de toutes les surfaces.

Une page de l'application utilise au maximum :

- une couleur dominante ;
- une couleur d'accent ;
- les couleurs semantiques strictement necessaires ;
- la gamme neutre.

La landing page peut utiliser la palette complete.

### 9.2 Palette de fondation v1

Les valeurs ci-dessous sont la premiere baseline a implementer et tester sur de vrais ecrans.

| Token | Nom | Valeur | Usage |
|---|---|---|---|
| `ink-950` | Signal Ink | `#121212` | Texte principal, contours forts |
| `ink-800` | Carbon | `#343434` | Texte secondaire fort |
| `ink-600` | Graphite | `#5F5F5F` | Texte secondaire |
| `ink-300` | Alloy | `#A7A7A7` | Texte desactive, reperes |
| `line-200` | Fine Line | `#D8DADD` | Bordures et separateurs |
| `canvas-50` | Canvas | `#F4F5F7` | Fond secondaire |
| `paper-0` | Paper | `#FFFFFF` | Surface principale |
| `cobalt-500` | Electric Cobalt | `#2447FF` | Action et signal primaire |
| `coral-500` | Signal Coral | `#FF5A45` | Alerte et energie chaude |
| `acid-400` | Acid Light | `#D8FF3E` | Accent lumineux et focus sombre |
| `magenta-500` | Controlled Magenta | `#F13EAF` | Intensite et expression |
| `mint-500` | Closed Mint | `#45D49E` | Resolution et succes |
| `cyan-400` | Clear Cyan | `#57D9E8` | Information et faible intensite |

La gamme neutre est une infrastructure de lisibilite. Elle ne doit jamais devenir l'atmosphere dominante de la marque.

### 9.3 Paires de contraste autorisees

| Fond | Texte autorise | Contraste approximatif |
|---|---|---:|
| Signal Ink | Paper | 18.73:1 |
| Paper | Signal Ink | 18.73:1 |
| Canvas | Signal Ink | 17.17:1 |
| Electric Cobalt | Paper | 6.14:1 |
| Signal Coral | Signal Ink | 6.07:1 |
| Acid Light | Signal Ink | 16.32:1 |
| Controlled Magenta | Signal Ink | 5.40:1 |
| Closed Mint | Signal Ink | 9.96:1 |
| Clear Cyan | Signal Ink | 11.15:1 |

Le blanc n'est pas autorise pour du petit texte sur Coral, Magenta, Mint, Cyan ou Acid.

Toute nouvelle paire doit etre testee avant implementation.

### 9.4 Tokens semantiques

| Token | Couleur | Texte | Signal secondaire |
|---|---|---|---|
| `action-primary` | Cobalt | Paper | Fleche ou angle interrompu |
| `status-incoming` | Cobalt | Paper | Ligne pleine |
| `status-focus` | Magenta | Ink | Ligne divisee |
| `status-track` | Acid | Ink | Ligne orientee vers l'avant |
| `status-closed` | Mint | Ink | Boucle fermee |
| `priority-low` | Cyan | Ink | 1 segment actif |
| `priority-medium` | Cobalt | Paper | 2 segments actifs |
| `priority-high` | Coral | Ink | 3 segments actifs |
| `priority-critical` | Magenta | Ink | 4 segments + motif |
| `feedback-error` | Coral | Ink | Icône + texte explicite |
| `feedback-success` | Mint | Ink | Icône + texte explicite |
| `feedback-info` | Cyan | Ink | Icône + texte explicite |

### 9.5 Interdictions couleur

- aucun arc-en-ciel gratuit dans l'application ;
- aucune couleur brute hors tokens ;
- aucune information communiquee uniquement par couleur ;
- aucun degrade violet-bleu generique ;
- aucune grande surface beige, marron ou bleu nuit comme theme dominant ;
- aucun fond colore derriere un long texte sans contraste valide ;
- aucune palette differente inventee pour un seul composant.

## 10. Typographie

### 10.1 Familles

| Role | Famille candidate | Usage |
|---|---|---|
| Display | `Archivo` Variable | Landing, grands titres, chiffres hero |
| Interface | `Instrument Sans` | Navigation, formulaires, tableaux, corps |
| Technique | `IBM Plex Mono` | Identifiants, metadonnees techniques, chiffres ponctuels |

Ces familles doivent etre testees ensemble avant validation definitive. Elles ne peuvent etre remplacees que dans tout le produit, jamais localement.

### 10.2 Regles generales

- letter-spacing toujours egal a `0` ;
- aucune taille de texte calculee en fonction de la largeur du viewport ;
- les changements de taille se font a des breakpoints fixes ;
- les chiffres de tableaux utilisent des variantes tabulaires ;
- les titres expressifs sont reserves aux vraies zones hero ;
- les titres de panneaux restent compacts ;
- le texte courant ne descend pas sous 14 px dans l'application ;
- les labels ne reposent jamais sur des capitales uniquement.

### 10.3 Echelle marketing desktop

| Token | Taille | Ligne | Graisse | Usage |
|---|---:|---:|---:|---|
| `display-xl` | 96 px | 92 px | 800 | Hero principal |
| `display-lg` | 72 px | 70 px | 800 | Titre de section forte |
| `display-md` | 48 px | 50 px | 750 | Sous-section editoriale |
| `marketing-lead` | 22 px | 32 px | 450 | Proposition de valeur |
| `marketing-body` | 18 px | 28 px | 400 | Texte marketing |

### 10.4 Echelle marketing mobile

| Token | Taille | Ligne | Graisse |
|---|---:|---:|---:|
| `display-xl` | 56 px | 55 px | 800 |
| `display-lg` | 44 px | 45 px | 800 |
| `display-md` | 34 px | 38 px | 750 |
| `marketing-lead` | 19 px | 28 px | 450 |
| `marketing-body` | 16 px | 25 px | 400 |

### 10.5 Echelle application

| Token | Taille | Ligne | Graisse | Usage |
|---|---:|---:|---:|---|
| `app-title` | 32 px | 36 px | 700 | Titre principal de page |
| `section-title` | 24 px | 30 px | 700 | Section |
| `panel-title` | 18 px | 24 px | 650 | Panneau, modal, item fort |
| `body` | 16 px | 24 px | 400 | Texte courant |
| `body-small` | 14 px | 20 px | 400 | Tableaux et metadonnees |
| `label` | 13 px | 18 px | 650 | Label de controle |
| `meta` | 12 px | 16 px | 500 | Usage rare et secondaire |
| `data-xl` | 48 px | 48 px | 750 | Statistique principale |
| `data-lg` | 32 px | 34 px | 700 | Statistique secondaire |
| `data-sm` | 14 px | 18 px | 600 | Donnee tabulaire |

Un mot trop long doit passer a la ligne. Si cela reste insuffisant dans un format fixe, une variante de taille explicite doit etre definie ; aucune reduction dynamique par viewport n'est autorisee.

## 11. Grille et mise en page

### 11.1 Breakpoints

| Nom | Largeur |
|---|---:|
| `mobile` | 0-767 px |
| `tablet` | 768-1023 px |
| `desktop` | 1024-1439 px |
| `wide` | 1440 px et plus |

Viewports de verification obligatoires :

- 390 x 844 ;
- 768 x 1024 ;
- 1440 x 900 ;
- 1728 x 1117.

### 11.2 Application

| Element | Dimension |
|---|---:|
| Sidebar ouverte | 232 px |
| Sidebar reduite | 64 px |
| Topbar | 64 px |
| Padding contenu mobile | 16 px |
| Padding contenu tablet | 24 px |
| Padding contenu desktop | 32 px |
| Largeur maximale application | 1680 px |
| Largeur formulaire standard | 720 px |
| Largeur texte long | 680 px |

Le dashboard peut occuper toute la largeur utile. Les formulaires et textes longs restent contraints.

### 11.3 Landing page

- grille de 12 colonnes sur desktop ;
- gouttiere de 24 px ;
- marge laterale de 32 px a 1440 px ;
- composition pleine largeur pour les sections fortes ;
- contenu textuel long limite a 720 px ;
- le hero laisse toujours apercevoir la section suivante ;
- le nom `SignalDesk` est un signal de premier viewport ;
- le hero n'est jamais une carte ;
- aucune composition split-screen texte d'un cote et media encadre de l'autre ;
- le media principal est plein cadre, en fond ou integre a une scene immersive.

## 12. Espacement

Le systeme repose sur une base de 4 px.

| Token | Valeur | Usage |
|---|---:|---|
| `space-0` | 0 | Aucun espace |
| `space-1` | 4 px | Micro-ajustement |
| `space-2` | 8 px | Icone-label, elements proches |
| `space-3` | 12 px | Interieur compact |
| `space-4` | 16 px | Padding controle, petit groupe |
| `space-6` | 24 px | Groupe standard |
| `space-8` | 32 px | Section interne |
| `space-12` | 48 px | Separation de sections |
| `space-16` | 64 px | Grande section application |
| `space-24` | 96 px | Section marketing |
| `space-32` | 128 px | Rupture marketing forte |

Regles :

- aucune valeur arbitraire si un token convient ;
- les composants compacts utilisent 8, 12 ou 16 px ;
- les sections utilisent 24, 32, 48 ou 64 px ;
- les grands espacements 96 et 128 px sont reserves au marketing ;
- l'espace ne sert jamais a masquer un manque de hierarchie.

## 13. Rayons, bordures et elevation

### 13.1 Rayons

| Token | Valeur | Usage |
|---|---:|---|
| `radius-none` | 0 | Aplats et bandes |
| `radius-xs` | 2 px | Repere, mini-element |
| `radius-sm` | 4 px | Champs, boutons, tags |
| `radius-md` | 6 px | Menus, panneaux |
| `radius-lg` | 8 px | Modal et carte repetee maximum |

Aucun composant applicatif ne depasse 8 px de rayon. Les pills completes sont reservees aux tres petits indicateurs lorsque leur forme porte un sens.

### 13.2 Bordures

| Token | Valeur | Usage |
|---|---:|---|
| `border-fine` | 1 px | Structure standard |
| `border-strong` | 2 px | Focus, action, separation forte |
| `border-signal` | 4 px | Marqueur ou bande de signal |

### 13.3 Ombres

L'elevation vient d'abord de la couleur et de la superposition.

- aucune ombre sur les sections de page ;
- aucune ombre diffuse decorative ;
- ombre douce autorisee uniquement pour menus, popovers et modales ;
- ombre dure de 4 px autorisee sur une piece expressive marketing ;
- aucune ombre coloree derriere un tableau ou un formulaire.

## 14. Iconographie

Lucide constitue la bibliotheque principale.

Regles :

- taille standard 18 px ;
- taille compacte 16 px ;
- taille expressive 24 px ;
- epaisseur coherente dans une meme zone ;
- un bouton d'action connue utilise une icone plutot qu'un rectangle avec un mot inutile ;
- toute icone inhabituelle possede une infobulle ;
- une icone seule conserve un nom accessible ;
- aucune icone decorative ne recoit de focus.

Icones sur mesure autorisees :

- Signal ;
- Intensity ;
- Pulse ;
- Closed Loop ;
- SignalDesk mark.

Elles doivent partager la grille et l'epaisseur visuelle de Lucide.

## 15. Images, assets et textures

### 15.1 Direction

Les assets doivent ressembler a des pieces de campagne culturelle contemporaine : compositions typographiques, photographie d'objet, volumes abstraits nets ou bitmap genere sur mesure.

### 15.2 Landing page

La landing page doit utiliser un asset visuel principal montrant le produit, son univers ou une composition de marque identifiable.

Le hero utilise :

- un bitmap genere ou photographie ;
- ou une scene interactive pleine largeur reellement utile ;
- jamais un SVG decoratif generique ;
- jamais un simple degrade ;
- jamais une image sombre, floue ou purement atmospherique qui cache le produit.

### 15.3 Application

- aucune photo de stock ;
- aucun personnage cartoon ;
- aucune illustration SaaS avec personnages flottants ;
- aucun bokeh, orbe ou blob decoratif ;
- grain autorise uniquement sur marketing et etats vides ;
- aucune texture sous un tableau, graphique ou formulaire ;
- un etat vide peut recevoir un asset specifique si l'action suivante reste dominante.

## 16. Mouvement

### 16.1 Principes

- pas de mouvement permanent ;
- pas de rebond cartoon ;
- pas de scroll hijacking ;
- pas de mouvement qui deplace une cible interactive ;
- pas d'animation decorative avant que le contenu soit utilisable ;
- toute animation communique un changement, une relation ou une confirmation.

### 16.2 Tokens

| Token | Duree | Usage |
|---|---:|---|
| `motion-instant` | 0 ms | Etat immediat |
| `motion-fast` | 120 ms | Hover, pression, focus |
| `motion-base` | 180 ms | Etat composant |
| `motion-deliberate` | 260 ms | Changement de statut |
| `motion-panel` | 320 ms | Drawer, modal, navigation |
| `motion-brand-short` | 600 ms | Logo, celebration courte |
| `motion-marketing` | 600-1200 ms | Sequence GSAP |

Courbes :

- standard : `cubic-bezier(0.2, 0.8, 0.2, 1)` ;
- entree : `cubic-bezier(0.16, 1, 0.3, 1)` ;
- sortie : `cubic-bezier(0.4, 0, 1, 1)`.

### 16.3 GSAP

GSAP et ScrollTrigger sont reserves a :

- landing page ;
- page de presentation du design system ;
- eventuelle introduction de portfolio.

Ils ne sont pas utilises pour les formulaires, tableaux, menus, parametres ou interactions courantes.

Une page marketing peut avoir une seule sequence epinglee majeure. Elle ne doit pas bloquer la progression ni exiger un scroll excessif.

### 16.4 Reduced motion

Avec `prefers-reduced-motion` :

- suppression des translations, zooms et parallax ;
- remplacement des sequences par des fondus tres courts ou des changements instantanes ;
- graphiques affiches directement dans leur etat final ;
- aucune perte d'information ou de fonctionnalite.

## 17. Interaction

### 17.1 Etats obligatoires

Tout composant interactif doit definir :

- default ;
- hover ;
- focus-visible ;
- active ;
- disabled ;
- loading si pertinent ;
- error si pertinent ;
- success si pertinent.

### 17.2 Stabilite

- aucun hover ne modifie les dimensions du composant ;
- aucun label dynamique ne deplace les elements voisins ;
- les icones, compteurs et loaders utilisent des cadres de taille stable ;
- les tableaux conservent leurs colonnes pendant le chargement ;
- les textes longs passent a la ligne sans recouvrir une autre zone.

### 17.3 Feedback

- une action locale recoit un feedback local ;
- un toast est reserve a un evenement global ou non visible dans la zone actuelle ;
- une erreur conserve les donnees saisies ;
- une sauvegarde en cours ne bloque pas la lecture ;
- une action destructive indique clairement l'objet et le workspace.

## 18. Architecture des composants

Les composants seront organises en trois niveaux.

### 18.1 Primitives

Exemples : Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Tooltip, Dialog.

Ils ne connaissent pas le metier.

### 18.2 Composants SignalDesk

Exemples : SignalStrip, IntensityMeter, SignalStatus, SignalRow, PulseMetric, GeneratedIdentity.

Ils appliquent le langage de marque et la semantique metier.

### 18.3 Patterns

Exemples : SignalFeed, FeedbackEditor, ActivityTimeline, WorkspaceSwitcher, DashboardBand.

Ils assemblent primitives et composants metier sans redefinir leurs styles.

Regles :

- aucun style metier duplique dans une page ;
- aucune couleur brute dans un composant ;
- aucune variante ajoutee pour un seul ecran sans justification ;
- une nouvelle abstraction doit etre utilisee au moins deux fois ou retirer une vraie complexite ;
- les composants acceptent le contenu, mais la page controle la composition.

## 19. Composants fondamentaux

### 19.1 Button

Tailles :

| Variante | Hauteur | Padding horizontal | Usage |
|---|---:|---:|---|
| Compact | 32 px | 12 px | Tableau et toolbar |
| Standard | 40 px | 16 px | Application |
| Large | 48 px | 20 px | Landing et onboarding |

Variantes :

- `primary` : Cobalt, texte Paper ;
- `secondary` : Paper, texte Ink, bordure Ink ;
- `quiet` : fond transparent, texte Ink ;
- `expressive` : Acid ou Magenta avec texte Ink, uniquement page niveau 7+ ;
- `danger` : Coral avec texte Ink ;
- `disabled` : Canvas, texte Ink-300.

Regles :

- rayon 4 px ;
- aucun bouton pill ;
- un verbe clair pour une commande textuelle ;
- une action connue comme fermer, supprimer, telecharger ou revenir utilise son icone habituelle ;
- loader dans un cadre fixe sans changer la largeur ;
- une seule action primaire dominante par zone.

### 19.2 IconButton

- 40 x 40 px standard ;
- 32 x 32 px compact desktop ;
- minimum 44 x 44 px sur mobile ;
- rayon 4 px ;
- tooltip obligatoire si l'action n'est pas evidente ;
- label accessible obligatoire.

### 19.3 Liens

- soulignement ou signal de forme visible, pas couleur seule ;
- liens inline soulignes ;
- liens de navigation identifies par position et etat actif ;
- aucun faux lien utilise comme bouton.

### 19.4 Champs

- hauteur 44 px ;
- rayon 4 px ;
- bordure 1 px Line ;
- fond Paper ;
- texte 16 px ;
- label visible au-dessus ;
- texte d'aide sous le champ ;
- focus 2 px Cobalt sur fond clair ;
- erreur 2 px Coral + icone + message ;
- placeholder uniquement comme exemple, jamais comme label.

Textarea :

- hauteur minimale 160 px pour un Signal ;
- redimensionnement vertical autorise ;
- compteur uniquement en cas de limite reelle.

### 19.5 Selecteurs

- controle segmente pour un choix court de 2 a 4 options frequentes ;
- `DesignSelect` pour un choix dans un formulaire ou une barre de filtres ;
- aucun `<select>` natif visible : le menu doit porter les contours francs, les aplats et les etats de la marque ;
- le choix reste synchronise dans un champ de formulaire nomme pour les Server Actions ;
- ouverture au clavier, navigation par fleches, selection par Entree, fermeture par Echap et clic exterieur ;
- option active Cobalt/Paper, survol Acid/Ink et focus toujours visible ;
- toggle uniquement pour une valeur binaire ;
- checkbox pour une selection independante ;
- aucun menu si toutes les options peuvent tenir clairement a l'ecran.

### 19.6 SignalStatus

Le statut est un rectangle compact, jamais une pastille coloree seule.

- hauteur 28 px ;
- rayon 4 px ;
- icone ou motif 12 px ;
- label 13 px ;
- largeur adaptee au texte sans devenir une pill ;
- chaque statut combine couleur, label et motif.

### 19.7 IntensityMeter

Le marqueur de priorite utilise quatre segments de taille fixe.

- cadre 36 x 14 px ;
- quatre segments egaux ;
- nombre de segments actifs selon l'intensite ;
- couleur semantique ;
- label textuel dans les formulaires et details ;
- motif hachure ou coupe supplementaire pour Critical ;
- aucune variation de largeur ou hauteur selon le niveau.

### 19.8 Tag

- hauteur 24 px ;
- rayon 4 px ;
- bordure 1 px ;
- texte 12 ou 13 px ;
- fond neutre par defaut ;
- couleur limitee a une palette de tags approuvee ;
- suppression via icone `X` dans un IconButton integre ;
- pas plus de trois tags visibles dans une ligne dense, puis compteur `+N`.

### 19.9 SignalStrip

Composant signature.

- rail fixe de 6 px ;
- vertical dans SignalRow et detail ;
- horizontal dans graphiques, hero et transitions ;
- couleur issue du token semantique ;
- motif d'etat dans le rail ;
- intensite exprimee par remplissage ou segmentation, jamais par changement de largeur ;
- animation uniquement lors d'un changement d'etat.

### 19.10 SignalRow

Hauteurs :

- 64 px standard ;
- 48 px compact ;
- 80 px mobile.

Ordre desktop recommande :

1. SignalStrip ;
2. titre et extrait ;
3. client ;
4. statut ;
5. intensity ;
6. tags ;
7. date ;
8. actions.

Regles :

- grille de colonnes stable ;
- titre sur une ligne en compact, deux maximum en standard ;
- actions revelees au hover mais accessibles au clavier ;
- etat selectionne visible par bordure et fond, pas couleur seule ;
- critical ne modifie jamais la hauteur de ligne ;
- mobile transforme la ligne en item structure, pas en carte decorative.

### 19.11 Navigation

Sidebar :

- 232 px ouverte, 64 px reduite ;
- fond Ink ou Paper selon le theme valide ;
- indicateur actif de 4 px inspire de SignalStrip ;
- icone 18 px ;
- label 14 px ;
- groupe espace de 24 px ;
- workspace switcher en haut ;
- profil et parametres en bas.

Topbar :

- hauteur 64 px ;
- contexte de page a gauche ;
- recherche et actions globales a droite ;
- aucune deuxieme navigation complete dupliquee.

### 19.12 Tabs

- texte + indicateur de ligne ou aplat ;
- hauteur stable 40 px ;
- pas de pills multiples ;
- cinq onglets visibles maximum avant menu supplementaire ;
- navigation clavier obligatoire.

### 19.13 Cards

Les cards sont reservees :

- aux objets repetes ;
- aux items selectionnables ;
- aux modales ;
- aux outils qui necessitent un cadre reel.

Interdictions :

- aucune card dans une card ;
- aucune section de page transformee en card flottante ;
- aucun dashboard construit uniquement avec une grille de cards ;
- rayon maximum 8 px ;
- aucune ombre decorative par defaut.

### 19.14 Dialog et Drawer

Dialog :

- largeurs 420, 560 ou 720 px ;
- rayon 6 px ;
- titre compact ;
- actions alignees en bas ;
- focus trap ;
- fermeture `Escape` sauf action critique en cours ;
- aucun panneau interne stylise comme une seconde card.

Drawer :

- 420 px standard desktop ;
- maximum 560 px ;
- plein ecran sur mobile ;
- pousse ou recouvre selon le contexte, mais ne redimensionne pas continuellement le contenu.

### 19.15 Tooltip, Menu et Popover

- rayon 4 px ;
- bordure 1 px ;
- ombre fonctionnelle legere ;
- apparition 120 ms ;
- pas de contenu essentiel uniquement dans un tooltip ;
- menu avec cible minimum 36 px desktop et 44 px mobile ;
- raccourci clavier aligne a droite si pertinent.

### 19.16 Toast et messages inline

Toast :

- bas droite desktop ;
- bas centre mobile ;
- trois visibles maximum ;
- duree 5 secondes pour succes ;
- erreurs persistantes ou fermables ;
- texte direct et action eventuelle.

Un message inline est prefere lorsqu'il concerne un champ, une section ou un resultat visible.

### 19.17 GeneratedIdentity

Representation sans photo pour client, membre ou workspace.

- initiales ou monogramme lisible ;
- forme geometrique issue du systeme ;
- combinaison de deux couleurs approuvees ;
- taille stable ;
- le nom reste toujours present dans les contextes importants ;
- aucune generation aleatoire qui change entre deux sessions.

## 20. Etats systeme

### 20.1 Loading

- squelette qui preserve la mise en page ;
- animation discrete d'une ligne qui se stabilise ;
- aucun spinner plein ecran si une partie du contenu est disponible ;
- texte uniquement si l'attente depasse un delai perceptible ;
- chargement de l'API Rails explique sans jargon technique.

Contrat global :

- toute navigation interne affiche immediatement un rail Signal de 4 px en haut du viewport ;
- si la route attend des donnees, un squelette preserve la structure de la page ;
- toute action locale affiche son pending dans la cible elle-meme ;
- un bouton pending est disabled, expose `aria-busy` et conserve exactement ses dimensions ;
- le Signal loader utilise trois barres fixes et remplace l'icone dans un cadre de 19 px ;
- les verbes pending decrivent l'action : `Saving`, `Filtering`, `Deleting`, `Signing out` ;
- les animations disparaissent avec `prefers-reduced-motion`, mais le rail, le squelette et le label restent visibles ;
- le timeout visuel de securite d'une navigation est de 12 secondes ;
- l'architecture et la checklist sont detaillees dans `docs/loading-and-action-feedback.md`.

### 20.2 Empty

- titre clair ;
- une phrase maximum ;
- une action principale ;
- asset possible pour les pages niveau 6+ ;
- aucune description visible des fonctionnalites du produit ;
- l'etat vide conduit directement a une action reelle.

### 20.3 Error

- aucun « Oops » ;
- aucun humour ;
- dire ce qui n'a pas fonctionne ;
- dire si les donnees saisies sont conservees ;
- proposer une prochaine action ;
- fournir un identifiant de requete pour une erreur serveur importante.

Exemple :

> This signal could not be saved. Your edits are still here. Try again.

### 20.4 Success

Les succes ordinaires restent calmes. Les deux celebrations autorisees sont :

- fin de l'onboarding ;
- passage d'un Signal a Closed Loop.

La celebration dure moins de 600 ms et ne bloque jamais l'action suivante.

## 21. Data visualisation

### 21.1 Principes

- exactitude avant spectacle ;
- valeur et unite toujours visibles ;
- axe et periode explicites ;
- legende proche du graphique ;
- zero tronque uniquement avec justification ;
- aucune perspective 3D ;
- aucune animation qui modifie la lecture finale ;
- alternative textuelle ou tabulaire disponible.

### 21.2 Palette de series

Ordre recommande :

1. Cobalt ;
2. Coral ;
3. Acid ;
4. Magenta ;
5. Mint ;
6. Cyan.

Au-dela de six series, regrouper, filtrer ou changer de visualisation. Ne jamais inventer douze couleurs supplementaires.

### 21.3 Graphiques recommandes

- barres pour comparer des volumes ;
- lignes pour une evolution temporelle ;
- barres empilees pour la repartition des statuts ;
- matrice pour intensite x volume ;
- grand chiffre avec variation pour une metrique principale ;
- donut uniquement pour deux a quatre categories simples.

### 21.4 Signal Pulse

Visualisation signature combinant :

- volume entrant ;
- intensite moyenne ;
- vitesse de resolution ;
- tendance par rapport a la periode precedente.

Elle doit avoir une version compacte et une version detaillee. Elle ne doit pas devenir un score opaque unique.

## 22. Patterns de pages

### 22.1 Landing page

Objectif : niveau d'expression 9.

- `SignalDesk` est le H1 ou le premier signal de marque ;
- proposition de valeur dans le texte de soutien ;
- hero pleine largeur, jamais dans une card ;
- asset de marque ou produit visible des le premier viewport ;
- la section suivante reste partiellement visible ;
- palette complete autorisee ;
- GSAP pour une narration courte et controlee ;
- preuve produit reelle avant les longues explications ;
- aucune grille de cartes marketing generiques ;
- CTA principal clair, CTA secondaire discret.

### 22.2 Authentification

- marque forte sur une grande surface ;
- formulaire compact et rassurant ;
- une seule action principale ;
- aucune animation autour du champ actif ;
- erreurs explicites ;
- pas de carousel de temoignages.

### 22.3 Onboarding

- trois etapes maximum avant le premier Signal ;
- nom et accent du workspace ;
- option de donnees de demonstration ;
- progression visible ;
- premiere valeur en moins de deux minutes ;
- celebration finale courte.

### 22.4 Control Room

- bande d'introduction avec contexte et grande metrique ;
- Signal Pulse comme piece principale ;
- bandes analytiques pleine largeur ;
- apercu du Signal Feed ;
- zero card imbriquee ;
- informations scannables en cinq secondes ;
- graphiques accompagnes de donnees exactes.

### 22.5 Signal Feed

- toolbar fixe ou stable ;
- recherche, filtres et tri dans l'URL ;
- tableau hybride desktop ;
- liste structuree mobile ;
- mode compact ;
- selection multiple uniquement si actions groupees reelles ;
- pagination explicite ;
- colonnes et lignes stables pendant le chargement.

### 22.6 Detail d'un Signal

- en-tete avec titre, statut, intensity et actions ;
- contenu et contexte dans une grille a deux colonnes desktop ;
- timeline commentaires + activite ;
- edition en place uniquement pour les champs simples ;
- formulaire complet pour les changements complexes ;
- Closed Loop comme seule transformation celebratoire.

### 22.7 Clients

- liste dense avec GeneratedIdentity ;
- nom et organisation dominants ;
- historique des Signals sur la page detail ;
- pas d'esthetique CRM traditionnelle surchargee ;
- aucun score client opaque dans le MVP.

### 22.8 Membres, permissions et securite

- expression 3 ;
- roles explicites ;
- email et statut d'invitation visibles ;
- action destructive separee ;
- workspace actif toujours nomme ;
- aucune metaphore de marque qui masque une permission.

### 22.9 Formulaire public

- mobile-first ;
- nom et accent du workspace ;
- marque SignalDesk secondaire ;
- description comme champ principal ;
- tres peu de champs ;
- confirmation claire ;
- animation facultative ;
- aucun acces aux informations internes.

### 22.10 Pages legales

- expression 2 ;
- largeur texte 680 px ;
- navigation de sections simple ;
- aucun mouvement decoratif ;
- typographie d'interface ;
- date de mise a jour visible.

## 23. Responsive

### 23.1 Strategie

L'application est desktop-first mais les parcours principaux restent fonctionnels sur mobile.

### 23.2 Desktop

- sidebar + topbar ;
- Signal Feed tabulaire ;
- deux colonnes sur les details ;
- graphiques comparatifs complets ;
- raccourcis clavier et actions au hover.

### 23.3 Tablet

- sidebar reduite ou drawer ;
- detail en colonnes selon largeur disponible ;
- graphiques simplifies ;
- toolbar recomposee sur deux lignes si necessaire.

### 23.4 Mobile

- navigation simplifiee ;
- cible tactile minimum 44 px ;
- tableau transforme en liste ;
- actions principales visibles sans hover ;
- panneaux en plein ecran ;
- aucune decoration qui retire de l'espace au contenu ;
- texte display reduit par breakpoint fixe ;
- contenu sans chevauchement a 320 px.

### 23.5 Regles de stabilite

- utiliser grid tracks, minmax, aspect-ratio et dimensions fixes pour les elements formates ;
- ne pas laisser une icone, un compteur ou un loader redimensionner une barre ;
- tester le contenu le plus long plausible ;
- ne jamais masquer une action essentielle uniquement pour faire tenir le layout.

## 24. Accessibilite

Objectif : WCAG 2.2 AA.

### 24.1 Contraste

- 4.5:1 minimum pour texte normal ;
- 3:1 minimum pour grand texte et composants graphiques essentiels ;
- verification de chaque nouvelle paire ;
- couleur jamais seule porteuse de sens.

### 24.2 Clavier

- ordre de tabulation logique ;
- toutes les actions accessibles ;
- focus-visible jamais supprime ;
- menus, tabs, dialogs et combobox conformes aux patterns ARIA ;
- raccourcis documentes dans la palette de commandes ou les tooltips, pas en texte decoratif permanent.

### 24.3 Focus

- 2 px Cobalt avec offset 2 px sur fond clair ;
- 2 px Acid avec offset 2 px sur fond sombre ;
- forme nette et visible ;
- aucun changement de taille.

### 24.4 Mouvement

- support obligatoire de `prefers-reduced-motion` ;
- aucune information disponible seulement pendant une animation ;
- aucun clignotement ;
- aucune pulsation permanente de priorite critique.

### 24.5 Texte et zoom

- fonctionnement a 200 % de zoom ;
- reflow sans scroll horizontal pour les parcours standards ;
- textes alternatifs pour assets informatifs ;
- icones seules nommees ;
- labels toujours associes aux champs.

## 25. Voix et microcopy

### 25.1 Ton

- concis ;
- competent ;
- assure ;
- chaleureux ;
- legerement impertinent dans le marketing ;
- strictement utile en cas d'erreur ou de securite.

### 25.2 Regles

- phrase case par defaut ;
- verbes directs pour les commandes ;
- pas de point d'exclamation dans l'application courante ;
- pas de blague dans une erreur ;
- pas de jargon d'entreprise ;
- pas de slogan a la place d'un label ;
- pas de texte visible qui explique comment utiliser une interface evidente ;
- utiliser les tooltips et etats contextuels lorsque necessaire.

### 25.3 Formulations recommandees

| Contexte | Formulation |
|---|---|
| Creation | `Capture a Signal` |
| Creation reussie | `Signal captured` |
| Sauvegarde | `Changes saved` |
| Resolution | `Loop closed` |
| Liste vide | `No signals here yet` |
| Recherche vide | `No signals match these filters` |
| Erreur sauvegarde | `This signal could not be saved. Your edits are still here.` |
| API en reveil | `Reconnecting to the signal` |

### 25.4 Mots a eviter

- synergy ;
- leverage ;
- seamless ;
- revolutionize ;
- game-changing ;
- effortless lorsque l'action demande un effort ;
- magic pour decrire une fonction normale.

## 26. Theme sombre et personnalisation

### 26.1 Theme clair

Le theme clair est le seul theme requis pour le MVP. Il doit etre complet avant tout travail sur le sombre.

### 26.2 Night Shift

Le theme sombre futur s'appelle `Night Shift`.

Il doit etre reconcu token par token. Il ne sera pas obtenu par inversion automatique.

Contraintes :

- Ink devient surface principale ;
- Paper devient texte principal ;
- Acid sert de focus ;
- les accents sont ajustes pour le contraste ;
- les grandes surfaces colorees sont reduites ;
- aucun bleu nuit ou gris ardoise dominant.

### 26.3 Accent de workspace

Un workspace choisit un accent parmi une liste approuvee. Il ne peut pas fournir une couleur libre dans le MVP.

L'accent peut modifier :

- un repere de navigation ;
- la GeneratedIdentity du workspace ;
- le formulaire public ;
- quelques surfaces de marque.

Il ne modifie jamais :

- les couleurs de statut ;
- les couleurs d'erreur ;
- le contraste des textes ;
- la structure des composants.

## 27. Performance

### 27.1 Application

- interactions visuelles a 60 fps sur un ordinateur professionnel moyen ;
- aucun asset marketing charge dans l'application authentifiee ;
- aucune librairie d'animation chargee globalement si elle n'est utilisee que sur la landing page ;
- chargement differe des graphiques secondaires ;
- images dimensionnees et optimisees ;
- pas de layout shift visible ;
- les animations n'attendent pas une reponse reseau pour rendre le controle.

### 27.2 Landing page

- GSAP charge uniquement sur les routes concernees ;
- assets prioritaires limites au premier viewport ;
- scenes suivantes chargees progressivement ;
- version reduced-motion et version sans asset lourd ;
- aucune video auto-play avec son ;
- aucune animation ne retarde le CTA.

### 27.3 Budget de complexite

Avant d'ajouter un effet :

1. identifier l'information communiquee ;
2. verifier qu'un token de mouvement existe ;
3. verifier reduced-motion ;
4. tester mobile et desktop ;
5. mesurer le poids et la fluidite ;
6. supprimer l'effet s'il n'ameliore ni comprehension ni marque.

## 28. Contrat d'implementation frontend

Lorsque le code sera cree, l'organisation cible sera :

```text
apps/web/src/
  app/
  components/
    ui/
    signal/
    patterns/
  styles/
    tokens.css
    globals.css
  lib/
  app/design-lab/
```

### 28.1 Tokens

- toutes les valeurs de marque dans `tokens.css` ;
- variables CSS semantiques ;
- Tailwind mappe les tokens au lieu de dupliquer les hex ;
- aucune couleur hex dans un composant ;
- aucun spacing arbitraire sans justification ;
- les themes changent les tokens, pas les composants.

### 28.2 Design Lab

Une route non publique `design-lab` doit montrer :

- palette ;
- typographie ;
- spacing ;
- boutons ;
- champs ;
- statuts ;
- intensity ;
- SignalStrip ;
- SignalRow ;
- navigation ;
- etats loading, empty, error et success ;
- themes et reduced-motion ;
- contenu court, long et extreme.

### 28.3 Expression

Les primitives peuvent recevoir un niveau `quiet`, `standard` ou `expressive` uniquement si les trois variantes sont documentees.

Une page fixe son niveau d'expression. Un composant enfant ne l'augmente pas de lui-meme.

## 29. Checklist pour chaque nouvel ecran

Avant implementation :

- [ ] Le besoin utilisateur principal est formule en une phrase.
- [ ] L'action principale est identifiee.
- [ ] Le niveau d'expression de la page est defini.
- [ ] Le pattern de page existant le plus proche est reutilise.
- [ ] Les donnees extremes et l'etat vide sont prevus.
- [ ] La version mobile est dessinee en meme temps que la version desktop.
- [ ] Les composants necessaires existent ou sont identifies.

Avant validation :

- [ ] La page est comprehensible sans animation.
- [ ] Une seule action primaire domine chaque zone.
- [ ] Aucun texte, bouton ou badge ne deborde.
- [ ] Aucun element ne chevauche incoheremment un autre.
- [ ] Aucun composant ne redimensionne le layout au hover ou au loading.
- [ ] Les couleurs utilisent uniquement les tokens.
- [ ] Les contrastes sont valides.
- [ ] Le parcours clavier fonctionne.
- [ ] Les focus sont visibles.
- [ ] Reduced-motion fonctionne.
- [ ] Loading, empty, error, success et disabled sont verifies.
- [ ] Les viewports 390, 768, 1440 et 1728 sont verifies.
- [ ] Le contenu le plus long plausible est teste.
- [ ] Aucune card n'est imbriquee dans une autre.
- [ ] Les captures de verification sont jointes a la revue.

## 30. Checklist pour chaque nouveau composant

- [ ] Le composant resout un besoin reutilisable.
- [ ] Une primitive existante ne suffit pas.
- [ ] Son niveau architectural est clair : primitive, metier ou pattern.
- [ ] Ses dimensions sont stables.
- [ ] Toutes les variantes sont necessaires.
- [ ] Default, hover, focus, active, disabled et loading sont definis.
- [ ] Error et success sont definis si pertinents.
- [ ] Le composant fonctionne au clavier.
- [ ] Son nom accessible est correct.
- [ ] La couleur n'est pas le seul signal.
- [ ] Le contenu long et traduit est teste.
- [ ] Le composant fonctionne sur mobile.
- [ ] Il respecte reduced-motion.
- [ ] Il est ajoute au Design Lab.
- [ ] Il n'introduit aucune valeur brute hors tokens.

## 31. Interdictions globales

- pas de landing page SaaS generique construite comme une suite de cards ;
- pas de hero split-screen ;
- pas de hero en degrade ou illustration SVG decorative generique ;
- pas de palette dominee par un seul bleu, violet, beige ou gris ;
- pas de blobs, orbes ou bokeh decoratifs ;
- pas de grandes cards arrondies ;
- pas de cards imbriquees ;
- pas de titre hero dans un panneau compact ;
- pas de texte a taille fluide selon le viewport ;
- pas de letter-spacing negatif ;
- pas de boutons pills par defaut ;
- pas de texte dans un bouton lorsqu'une icone universelle suffit ;
- pas d'icone inconnue sans tooltip ;
- pas de couleur seule pour le statut ou la priorite ;
- pas d'animation permanente ;
- pas de parallax dans les flux de travail ;
- pas d'humour dans les erreurs, permissions ou suppressions ;
- pas de jargon corporate ;
- pas d'effet qui diminue la vitesse de saisie ;
- pas de divergence visuelle non documentee.

## 32. Gouvernance

### 32.1 Source de verite

`DESIGN_SYSTEM.md` est la source de verite implementationnelle.

`DESIGN_DIRECTION_35_DECISIONS.md` explique l'intention artistique.

Le code ne devient jamais la seule documentation d'une decision de design.

### 32.2 Ajouter un token

Un nouveau token est autorise si :

- aucun token existant ne convient ;
- la valeur repond a un besoin recurrent ;
- le nom est semantique ;
- les themes et contrastes sont traites ;
- le Design Lab et ce document sont mis a jour.

### 32.3 Modifier un composant

Une modification doit :

1. identifier les ecrans consommateurs ;
2. verifier les regressions responsive ;
3. verifier tous les etats ;
4. fournir des captures avant/apres ;
5. mettre a jour le Design Lab ;
6. mettre a jour ce fichier si le contrat change.

### 32.4 Dette visuelle

Une exception temporaire recoit :

- une issue ;
- une raison ;
- un proprietaire ;
- une date ou condition de resolution.

Elle ne devient pas un precedent automatique.

## 33. Definition de fini visuelle

Une fonctionnalite n'est pas terminee visuellement tant que :

- tous ses etats ne sont pas implementes ;
- desktop, tablet et mobile ne sont pas verifies ;
- clavier et lecteur d'ecran ne sont pas raisonnablement couverts ;
- les contrastes ne sont pas valides ;
- reduced-motion n'est pas teste ;
- le contenu long ne tient pas correctement ;
- aucune valeur visuelle brute n'est ajoutee ;
- le composant ou pattern n'est pas documente ;
- les captures de controle ne sont pas produites ;
- l'ecran ne respecte pas son niveau d'expression.

## 34. Elements encore a valider visuellement

Ces decisions sont des hypotheses solides mais necessitent une exploration avant d'etre declarees definitives :

- dessin du logo et du favicon ;
- association exacte Archivo + Instrument Sans ;
- palette sur de vrais ecrans complets ;
- motif exact de la SignalStrip ;
- silhouette exacte des statuts ;
- rendu du Signal Pulse ;
- direction des GeneratedIdentity ;
- asset hero de la landing page ;
- comportement de la transition Closed Loop ;
- palette et surfaces de Night Shift.

La validation se fera sur un premier Design Lab, puis sur trois ecrans pilotes :

1. landing page ;
2. Control Room ;
3. Signal Feed.

## 35. Journal des decisions

### `0.3.0` - 17 aout 2026

- remplacement de tous les selects natifs par `DesignSelect` ;
- menu angulaire avec contraste de marque et dimensions tactiles stables ;
- contrat clavier et ARIA obligatoire pour chaque liste de choix ;
- timeline unifiee pour commentaires et ActivityEvents dans le detail d'un Signal.

### `0.2.0` - 17 aout 2026

- adoption d'un contrat global de feedback pour chaque interaction asynchrone ;
- rail Signal pour les navigations internes ;
- Signal loader a trois barres pour les boutons pending ;
- squelettes stables pour les routes du workspace ;
- interdiction des actions sans feedback immediat ;
- ajout du topic de contexte `feedback` et d'une checklist d'implementation dediee.

### `0.1.0`

- creation du design system canonique ;
- definition des principes de marque ;
- premiere palette et paires de contraste ;
- premiere echelle typographique ;
- grille, spacing, rayons et mouvement ;
- specification des composants fondamentaux ;
- patterns de pages ;
- regles d'accessibilite, performance et gouvernance.

Les prochaines modifications devront etre ajoutees ici avec la date, la version et la raison du changement.
