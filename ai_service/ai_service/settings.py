"""
Django settings for ResumeAI project.

This file configures the Django backend that handles:
- User authentication (JWT tokens)
- Resume data storage (SQLite)
- AI-powered resume analysis (Google Gemini API)
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ──────────────────────────────────────────────
# BASE DIRECTORY
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ──────────────────────────────────────────────
# SECURITY SETTINGS
# ──────────────────────────────────────────────
SECRET_KEY = os.getenv('SECRET_KEY', 'change-me-in-production')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ──────────────────────────────────────────────
# INSTALLED APPS
# ──────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',               # Django REST Framework for building APIs
    'rest_framework_simplejwt',      # JWT authentication
    'corsheaders',                   # Handle CORS for Express gateway

    # Our apps
    'users',                         # User authentication
    'resumes',                       # Resume CRUD operations
    'analysis',                      # AI-powered resume analysis
    'cover_letters',                 # Cover Letter generator & CRUD
]

# ──────────────────────────────────────────────
# MIDDLEWARE
# ──────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',     # CORS must be before CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ai_service.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ai_service.wsgi.application'

# ──────────────────────────────────────────────
# DATABASE — SQLite (simple, no setup needed)
# ──────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ──────────────────────────────────────────────
# CUSTOM USER MODEL
# We use our own User model instead of Django's default
# ──────────────────────────────────────────────
AUTH_USER_MODEL = 'users.User'

# ──────────────────────────────────────────────
# PASSWORD VALIDATION
# ──────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ──────────────────────────────────────────────
# DJANGO REST FRAMEWORK SETTINGS
# ──────────────────────────────────────────────
REST_FRAMEWORK = {
    # Use JWT for authentication (not sessions)
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # By default, all endpoints require authentication
    # We'll override this on specific views (like signup/login)
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    # Standard JSON parsing
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',   # For file uploads
        'rest_framework.parsers.FormParser',
    ),
}

# ──────────────────────────────────────────────
# JWT TOKEN SETTINGS
# ──────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),     # Short-lived access token
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),        # Long-lived refresh token
    'ROTATE_REFRESH_TOKENS': True,                      # Issue new refresh token on refresh
    'BLACKLIST_AFTER_ROTATION': False,                   # Don't blacklist old tokens (simpler)
    'AUTH_HEADER_TYPES': ('Bearer',),                   # Use "Bearer <token>" format
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# ──────────────────────────────────────────────
# CORS SETTINGS
# Only allow requests from Express gateway (port 3000)
# ──────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    os.getenv('CORS_ALLOWED_ORIGIN', 'http://localhost:3000'),
]
CORS_ALLOW_CREDENTIALS = True

# ──────────────────────────────────────────────
# INTERNATIONALIZATION
# ──────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ──────────────────────────────────────────────
# STATIC FILES
# ──────────────────────────────────────────────
STATIC_URL = 'static/'

# ──────────────────────────────────────────────
# FILE UPLOADS
# ──────────────────────────────────────────────
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Max upload size: 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

# ──────────────────────────────────────────────
# DEFAULT PRIMARY KEY TYPE
# ──────────────────────────────────────────────
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ──────────────────────────────────────────────
# GEMINI API KEY (for Google Gemini AI)
# ──────────────────────────────────────────────
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
