"""
Serializers for the Resumes app.

- ResumeListSerializer: Lightweight version for listing resumes (Dashboard)
- ResumeSerializer: Full version for creating/updating/viewing a single resume
"""

from rest_framework import serializers
from .models import Resume


class ResumeListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for the resume list (Dashboard).
    Only includes basic info, not the full resume content.
    """

    class Meta:
        model = Resume
        fields = ['id', 'title', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResumeSerializer(serializers.ModelSerializer):
    """
    Full serializer for creating, updating, and viewing resumes.
    Includes all resume sections.
    """

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'personal_info', 'summary',
            'experience', 'education', 'skills', 'projects',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        """Ensure the resume title is not empty."""
        if not value.strip():
            raise serializers.ValidationError('Resume title cannot be empty')
        return value.strip()
