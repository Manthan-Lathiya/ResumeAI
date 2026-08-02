"""
URL routing for the Resumes app.

- GET/POST   /api/resumes/       → List & Create
- GET/PUT/DELETE /api/resumes/<id>/ → Detail, Update, Delete
"""

from django.urls import path
from .views import ResumeListCreateView, ResumeDetailView

urlpatterns = [
    path('', ResumeListCreateView.as_view(), name='resume-list-create'),
    path('<uuid:resume_id>/', ResumeDetailView.as_view(), name='resume-detail'),
]
