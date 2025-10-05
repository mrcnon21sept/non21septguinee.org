# Déploiement (glisser ce dossier dans l'espace grisé)
Ce paquet contient un seul dossier 'deploy_site/' prêt à glisser dans l'interface qui demande :
"Need to update your project? Drag and drop your project output folder here."

Ce dossier contient TOUT votre site + la section 'information' enrichie :
- /information/index.html ← contenu fourni
- /information/style.css ← CSS légère (importe /style.css si présent)
- /information/user-content/raisons.html ← même contenu (include relatif)
- /user-content/raisons.html ← même contenu (include racine)

Sauvegardes automatiques si un fichier existait déjà :
- /information/user-content/raisons_old_backup.html
- /user-content/raisons_old_backup.html

Étapes :
1) Dézippez 'MCBR_deploy_with_information_v3.zip' sur votre ordinateur.
2) Ouvrez le dossier 'deploy_site/' extrait (il doit contenir votre index.html à la racine et le reste du site).
3) Faites glisser ce dossier 'deploy_site/' dans l'espace grisé de votre hébergeur.
4) Une fois le déploiement fini, ouvrez /information/ et vérifiez le rendu.
