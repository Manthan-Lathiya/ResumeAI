from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.analyzer_health, name='analyzer_health'),
]
