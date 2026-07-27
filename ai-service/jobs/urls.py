from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.jobs_health, name='jobs_health'),
]
