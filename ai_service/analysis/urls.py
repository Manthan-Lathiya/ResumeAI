"""
URL routing for the Analysis app.

- POST /api/analysis/analyze/    → Analyze a resume
- POST /api/analysis/compare-jd/ → Compare resume vs job description
- GET  /api/analysis/history/    → Get analysis history
"""

from django.urls import path
from .views import AnalyzeView, CompareJDView, AnalysisHistoryView

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('compare-jd/', CompareJDView.as_view(), name='compare-jd'),
    path('history/', AnalysisHistoryView.as_view(), name='analysis-history'),
]
