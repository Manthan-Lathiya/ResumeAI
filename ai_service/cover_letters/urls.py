from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CoverLetterViewSet, GenerateCoverLetterView

router = DefaultRouter()
router.register(r'', CoverLetterViewSet, basename='cover-letter')

urlpatterns = [
    path('generate/', GenerateCoverLetterView.as_view(), name='cover-letter-generate'),
    path('', include(router.urls)),
]
