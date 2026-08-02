"""
URL routing for the Users app.

Maps URLs to views:
- POST /api/users/signup/  → SignupView
- POST /api/users/login/   → LoginView
- POST /api/users/refresh/ → RefreshView
- POST /api/users/logout/  → LogoutView
- GET  /api/users/me/      → MeView
"""

from django.urls import path
from .views import SignupView, LoginView, RefreshView, LogoutView, MeView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
]
