from pathlib import Path
import environ


BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    SECRET_KEY=(str, ''),
    TIME_ZONE=(str, 'America/Merida'),
    EMAIL_BACKEND = (str, "django.core.mail.backends.smtp.EmailBackend"),
    EMAIL_HOST = (str, "smtp.gmail.com"),
    EMAIL_PORT = (int, 587),
    EMAIL_USE_TLS = (bool, True),
    EMAIL_HOST_USER = (str, ''),
    EMAIL_HOST_PASSWORD = (str, ''),
)
env.read_env(BASE_DIR / '.env')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG", default=True)

ALLOWED_HOSTS = [
    '*'
    # 'localhost',
    # '127.0.0.1',
    # '192.168.0.5', 
    # '172.28.1.211',
    # '172.28.7.129',
    # '10.186.126.42',
]

# CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://192.168.0.5:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.5:5173", #mi PC

]
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    # 'http://*'
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.5:5173",
]

CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
# CSRF_COOKIE_HTTPONLY = True
# SESSION_COOKIE_HTTPONLY = True


# PROD ONLY
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True


from datetime import timedelta

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework_simplejwt',
    "corsheaders",
    'users',
    'api',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LOGIN_URL = '/login/'   # o el nombre del path a tu login
LOGIN_REDIRECT_URL = '/dashboard/'  # opcional

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
     ),

    # 'DEFAULT_PERMISSIONS_CLASSES':(
    #     'rest_framework.permissions.IsAuthenticated'
    # ),

    'DATETIME_FORMAT': "%Y-%m-%d %H:%M:%S",
    'USE_TZ': True,
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
    # 'alt': {
    #     'ENGINE': 'django.db.backends.mysql',  
    #     'NAME': 'citasweb',  
    #     'USER': env('DATABASE_USER'),
    #     'PASSWORD': env('DATABASE_PASSWORD'),
    #     'HOST': 'localhost',
    #     'PORT': '3306',                        
    # }
}

AUTH_USER_MODEL = 'users.Usuario'

EMAIL_BACKEND = env("EMAIL_BACKEND")
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = env("TIME_ZONE", default='America/Merida')

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_ROOT = BASE_DIR / "media"

MEDIA_URL = "/media/"