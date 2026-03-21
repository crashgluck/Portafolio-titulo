# SGC Backend

Backend base de SGC construido con Django REST Framework.

## Incluye

- Arquitectura por entornos (`base`, `dev`, `prod`)
- Autenticacion con JWT
- Registro de usuarios por email
- Login por email/password
- CORS listo para conectar el frontend en `http://localhost:5173`
- Pruebas minimas de autenticacion

## Stack

- Django
- Django REST Framework
- SimpleJWT
- django-cors-headers
- pytest + pytest-django

## Estructura

```text
sgc-backend/
  config/
    settings/
      base.py
      dev.py
      prod.py
    api.py
    urls.py
  users/
    migrations/
    admin.py
    models.py
    serializers.py
    urls.py
    views.py
  requirements/
    base.txt
    dev.txt
```

## Preparacion

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements\dev.txt
Copy-Item .env.example .env
```

## Migraciones y ejecucion

```powershell
.\.venv\Scripts\python manage.py makemigrations
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```

## Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/token/refresh`
- `GET /api/v1/health`

## Payloads

### Register

```json
{
  "email": "usuario@correo.com",
  "password": "SgcSecure2026!",
  "password_confirmation": "SgcSecure2026!",
  "first_name": "Juan",
  "last_name": "Perez"
}
```

### Login

```json
{
  "email": "usuario@correo.com",
  "password": "SgcSecure2026!"
}
```

## Pruebas

```powershell
.\.venv\Scripts\python -m pytest
```
