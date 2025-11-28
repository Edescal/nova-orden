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
DEBUG = env("DEBUG", default=False)

ALLOWED_HOSTS = [
    '*'
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://192.168.0.5:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.5:5173", #mi PC

]
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_ALL_HEADERS = True
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

# Application definition

INSTALLED_APPS = [
    # 'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework_simplejwt',
    'whitenoise',
    "corsheaders",
    'storages',
    'users',
    'api',
]

MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LOGIN_URL = '/login/' 
LOGIN_REDIRECT_URL = '/dashboard/'

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,

    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],

    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
     ),
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
        'DIRS': [BASE_DIR / 'frontend' / 'dist'],
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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
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


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


MEDIA_ROOT = BASE_DIR / "media"

MEDIA_URL = "/media/"

#configuración de archivos estáticos para producción
STATIC_ROOT = BASE_DIR / 'prodstatic'
#es la ruta donde se servirán los archivos estáticos en producción
STATIC_URL = 'assets/'
# directorios de contenido estático
STATICFILES_DIRS = [BASE_DIR / 'frontend' / 'dist' / 'assets' ]
# Usar WhiteNoise para manejar archivos estáticos, los comprime para mejorar el rendimiento
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'



AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID", default='')
AWS_SECRET_ACCESS_KEY = env("4gAZ64dpJjTb9Y8k8MDUCRlGYTD3gXoBpay+2c6H", default='')
AWS_STORAGE_BUCKET_NAME = 'nova-orden-bucket'  # Nombre de tu bucket
AWS_S3_REGION_NAME = 'us-east-2'  # Región del bucket
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_DEFAULT_ACL = None  # Para evitar que los archivos sean públicos por defecto
AWS_S3_VERITY = True  

# URL pública de acceso a los archivos
MEDIA_URL = f'https://nova-orden-bucket.s3.us-east-2.amazonaws.com/'

# Usar S3 para almacenar archivos de medios
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'