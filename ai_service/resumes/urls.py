"""
URL routing for the Resumes app.
"""

from django.urls import path
from .views import (
    ResumeListCreateView, ResumeDetailView, UploadResumeView,
    InterviewPrepView, TailorResumeView, GenerateResumeAIView, EnhanceFieldAIView
)

urlpatterns = [
    path('', ResumeListCreateView.as_view(), name='resume-list-create'),
    path('upload/', UploadResumeView.as_view(), name='resume-upload'),
    path('generate/', GenerateResumeAIView.as_view(), name='resume-generate'),
    path('enhance-field/', EnhanceFieldAIView.as_view(), name='resume-enhance-field'),
    path('interview-prep/', InterviewPrepView.as_view(), name='resume-interview-prep'),
    path('tailor/', TailorResumeView.as_view(), name='resume-tailor'),
    path('<uuid:resume_id>/', ResumeDetailView.as_view(), name='resume-detail'),
]
