"""
Root URL configuration for ResumeAI Django backend.

All API endpoints are prefixed with /api/ to keep things organized:
- /api/users/   → Authentication (signup, login, refresh, logout)
- /api/resumes/ → Resume CRUD operations
- /api/analysis/→ AI-powered resume analysis
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin panel (useful for debugging during development)
    path('admin/', admin.site.urls),

    # API endpoints — each app handles its own routes
    path('api/users/', include('users.urls')),
    path('api/resumes/', include('resumes.urls')),
    path('api/analysis/', include('analysis.urls')),
]
