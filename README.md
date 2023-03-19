# Booking

## Configuration du projet
1. Copier le fichier **env.exemple** et renomer le copie du fichier **env.exemple** en **.env** .
2. Changer la valeur de la variable **DATABASE_URL** dans le fichier **.env** vers l'url de votre base de donnée MongoDB.
- `DATABASE_URL="mongodb://<Utilisateur>:<Mot de passe>@<Url Serveur>:<Port>/<Base de donnée>" `
3. completez aussi la section #config mail dans .env
- `MAIL_USER= votre adresse mail `
- `MAIL_PASSWORD= mot de passe d'application de votre l'adresse mail `
- `MAIL_FROM= votre adresse mail `
>Section **Optionnel**.
4. ***(OPTIONNEL)*** Si vous préfere que docker gère la base de donnée pour vous, la variable **DATABASE_URL** dans le fichier **.env** reste la valeur par defaut. Executer la commande suivante. 
```bash 

# pour demarrer la base de donnée
docker compose up

# pour stoper la base de donnée
docker compose down

```
>Section **Optionnel**.

********
## Synchronisation du schéma Prisma avec la base de donnée MongoDB
>**NB**.
Les commandes ci-dessous doit être exécutées.

```bash
npm install

npx prisma generate

npx prisma db push

npx prisma db seed

```

********
## Demarrer le projet avec npm

```bash
npm run start:dev
```

Ouvrir [http://localhost:4000/api](http://localhost:4000/api) avec votre navigateur pour voir le résultat.
