"""
WSGI config for ResumeAI project.
Used by Django's development server and production WSGI servers.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_service.settings')
application = get_wsgi_application()
