from datetime import timedelta
from pathlib import Path
import os



from os import environ

import environ 



# Initialize environment variables
env = environ.Env()
environ.Env.read_env()  # Read .env file


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&v+-hn81c8)-u(nwrpeuc4zu00v)npt0x1h4k4fy2$#3siool5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'ckeditor',
    'rest_framework',
    'rest_framework_simplejwt',
    'Cart',
    'CategoryAndSubCategory',
    'Coupon',
    'EmailTemplate',
    'HomePage',
    'Orders',
    'Products',
    'Slider',
    'Users',
    'AllOrders'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# import pymysql
# pymysql.install_as_MySQLdb()


# #MySql Database

# DATABASES = {
#     'default': {
#         'ENGINE': env('MYSQL_ENGINE'),
#         'NAME': env('MYSQL_NAME'),
#         'USER': env('MYSQL_USER'),
#         'PASSWORD': env('MYSQL_PASSWORD'),
#         'HOST': env('MYSQL_HOST'),   # Or the IP address of your MySQL server
#         'PORT': env('MYSQL_PORT'),
#         'OPTIONS': {
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
#             'charset': 'utf8mb4',
#             'use_unicode': True,
#             },
#     }
# }


# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

CKEDITOR_UPLOAD_PATH = 'uploads/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'Users.User'



# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=14400),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    'JTI_CLAIM': 'jti',

}

# Reset Password token LifeTime

PASSWORD_RESET_TIMEOUT=300          # 300 Sec = 5 Min

from corsheaders.defaults import default_headers

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://staypurebd.com",
    "http://staypurebd.com"
]

# Allow the custom header 'Device-ID'
CORS_ALLOW_HEADERS = list(default_headers) + [
    'device',
]

CORS_ALLOW_CREDENTIALS = True

# Session Key Configuration
# SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Default engine
# SESSION_COOKIE_AGE = 1209600  # 2 weeks for session to expire
# SESSION_SAVE_EVERY_REQUEST = True  # Save session on every request
# SESSION_COOKIE_SECURE = False  # Only if you're testing locally; otherwise, it should be True in production

#### Bkash Live

BKASH_APP_KEY = env('APP_KEY')
BKASH_APP_SECRET = env('APP_SECRET')
BKASH_USERNAME = env('USERNAME')
BKASH_PASSWORD = env('PASSWORD')
BKASH_SANDBOX = env('SANDBOX')
BKASH_BASE_URL = env('BASE_URL')

BKASH_PAYMENT_CALLBACK_URL = env('BKASH_PAYMENT_CALLBACK_URL')
PAYMENT_SUCCESS_OR_FAILURE_BASE_URL = env('PAYMENT_SUCCESS_OR_FAILURE_BASE_URL')

# send email configaration
# EMAIL_BACKEND = env('EMAIL_BACKEND')
# EMAIL_HOST = env('EMAIL_HOST')
# EMAIL_PORT = env('EMAIL_PORT')
# EMAIL_USE_TLS = env('EMAIL_USE_TLS')
# DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
# EMAIL_HOST_USER = env('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'decorationbd.com'
EMAIL_PORT = 465  # Change to SSL port
EMAIL_USE_TLS = False  # TLS is not needed for SSL
EMAIL_USE_SSL=True  # Required for SMTP port 465
DEFAULT_FROM_EMAIL = "staypure@decorationbd.com"
EMAIL_HOST_USER = "staypure@decorationbd.com"
EMAIL_HOST_PASSWORD = "@Ausa444222333"

# OAuth Credential Google

GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = env('GOOGLE_CLIENT_SECRET')

SOCIAL_AUTH_PASSWORD = env('SOCIAL_AUTH_PASSWORD')
