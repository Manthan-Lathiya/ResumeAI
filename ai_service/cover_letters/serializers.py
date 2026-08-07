from rest_framework import serializers
from .models import CoverLetter


class CoverLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetter
        fields = [
            'id', 'title', 'job_title', 'company_name', 'recipient_name',
            'tone', 'job_description', 'salutation', 'body_paragraphs',
            'closing', 'template_id', 'theme_color', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
