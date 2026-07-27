from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.writer_health, name='writer_health'),
]
