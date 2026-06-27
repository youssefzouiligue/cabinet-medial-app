# Cabinet Médical — Gestion de rendez-vous en ligne

Projet réalisé d'après le cahier des charges de Youssef Zouiligue : un site de
gestion de cabinet médical avec calendrier interactif, prise de rendez-vous
(présentiel ou appel vidéo simulé), paiement en ligne en mode test, et trois
espaces (Patient, Médecin, Administrateur).

- **Backend** : Laravel (API REST) + MySQL + Sanctum (tokens)
- **Frontend** : React (Vite) + Tailwind CSS

```
medical-cabinet-app/
├── backend-laravel/   → fichiers applicatifs à copier dans un projet Laravel neuf
└── frontend/          → application React complète, prête à lancer
```

---

## 1. Pourquoi `backend-laravel/` n'est pas un projet Laravel complet

Cet environnement ne dispose pas de PHP/Composer pour générer le squelette
Laravel (vendor/, bootstrap, artisan, etc.). Le dossier `backend-laravel/`
contient donc **uniquement le code applicatif** (modèles, migrations,
contrôleurs, routes, middleware) à copier dans un projet Laravel généré chez
vous. C'est en réalité la bonne pratique : on ne committe jamais `vendor/`.

### Installation pas à pas

```bash
# 1. Créer un projet Laravel neuf (Laravel 11+)
composer create-project laravel/laravel backend
cd backend

# 2. Installer Sanctum (authentification par token pour l'API React)
php artisan install:api

# 3. Copier les fichiers fournis dans ce projet (en écrasant les fichiers par défaut)
#    Depuis le dossier medical-cabinet-app/ téléchargé :
cp -r ../backend-laravel/app/Models/*            backend/app/Models/
cp -r ../backend-laravel/app/Http/Controllers/Api  backend/app/Http/Controllers/
cp    ../backend-laravel/app/Http/Middleware/CheckRole.php backend/app/Http/Middleware/
cp    ../backend-laravel/database/migrations/*   backend/database/migrations/
cp    ../backend-laravel/database/seeders/DatabaseSeeder.php backend/database/seeders/
cp    ../backend-laravel/routes/api.php          backend/routes/api.php
cp    ../backend-laravel/config/cors.php         backend/config/cors.php
cp    ../backend-laravel/.env.example            backend/.env   # puis adaptez les valeurs
```

> Remplacez la migration `xxxx_create_users_table.php` générée par défaut par
> celle fournie (même nom de fichier conseillé, ou supprimez l'ancienne).

### Enregistrer le middleware `role`

Laravel 11 configure les middlewares dans `bootstrap/app.php`. Ouvrez ce
fichier et ajoutez l'alias :

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

### Base de données et lancement

```bash
# Dans backend/.env : renseignez DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan key:generate
php artisan migrate --seed   # crée les tables + 3 comptes de démonstration
php artisan serve            # démarre l'API sur http://localhost:8000
```

### Comptes de démonstration (créés par le seeder)

| Rôle     | Email                  | Mot de passe |
|----------|-------------------------|--------------|
| Admin    | admin@cabinet.test      | password     |
| Médecin  | medecin@cabinet.test    | password     |
| Patient  | patient@cabinet.test    | password     |

---

## 2. Lancer le frontend React

```bash
cd frontend
npm install
cp .env.example .env   # vérifiez que VITE_API_URL pointe vers votre API Laravel
npm run dev            # démarre sur http://localhost:5173
```

---

## 3. Fonctionnalités couvertes (cahier des charges)

- **Espace Patient** : création de compte, calendrier des créneaux (vert =
  disponible, cadenas = indisponible), réservation présentiel/vidéo,
  paiement en ligne (carte, mode test), liste et annulation de ses rendez-vous.
- **Espace Médecin** : génération de créneaux par plage horaire, suppression
  de créneaux libres, liste des rendez-vous reçus, changement de statut
  (confirmé / terminé / annulé), accès à l'appel vidéo simulé.
- **Espace Administrateur** : liste et filtrage des utilisateurs,
  activation/désactivation de comptes, suppression, supervision de tous les
  rendez-vous et de tous les paiements.
- **Paiement** : simulation de carte bancaire en mode test (toute carte est
  acceptée sauf celles se terminant par `0000`, utile pour démontrer un échec).
  Le rendez-vous passe au statut "confirmé" uniquement après paiement réussi.
- **Appel vidéo** : page de simulation pédagogique avec minuteur, accessible
  une fois le rendez-vous confirmé.

## 4. Notes techniques

- Authentification par token (Laravel Sanctum), stocké côté client dans
  `localStorage` et envoyé en `Authorization: Bearer`.
- Autorisations par rôle via le middleware `role:patient|medecin|admin` sur
  les routes API.
- Réservation d'un créneau protégée par une transaction + verrou
  (`lockForUpdate`) pour éviter que deux patients réservent le même créneau
  simultanément.
- Le design (palette pin/sable/miel/argile, typographies Fraunces + Manrope +
  JetBrains Mono, carnet de rendez-vous avec point pulsé) a été pensé
  spécifiquement pour ce projet plutôt que d'utiliser un thème générique.
