"""
Serializers for the Analysis app.
"""

from rest_framework import serializers
from .models import AnalysisResult


class AnalysisResultSerializer(serializers.ModelSerializer):
    """Serializer for analysis results — used in API responses."""

    class Meta:
        model = AnalysisResult
        fields = [
            'id', 'resume', 'analysis_type', 'ats_score',
            'result', 'job_description', 'file_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AnalyzeRequestSerializer(serializers.Serializer):
    """
    Validates the request to analyze a resume.
    Either a resumeId (for saved resumes) or a file upload is required.
    """
    resumeId = serializers.UUIDField(required=False)
    # File uploads are handled by the view, not the serializer


class CompareJDRequestSerializer(serializers.Serializer):
    """
    Validates the request to compare a resume with a job description.
    """
    resumeId = serializers.UUIDField(required=True)
    jobDescription = serializers.CharField(
        min_length=50,
        error_messages={
            'blank': 'Job description is required',
            'min_length': 'Job description must be at least 50 characters'
        }
    )
