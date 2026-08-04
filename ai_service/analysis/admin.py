"""
Admin configuration for the Analysis app.

Registers the AnalysisResult model with the Django admin panel,
allowing superusers to view AI analysis results.
"""

from django.contrib import admin
from .models import AnalysisResult


@admin.register(AnalysisResult)
class AnalysisResultAdmin(admin.ModelAdmin):
    """Admin configuration for the AnalysisResult model."""

    # Columns shown in the analysis list view
    list_display = ('analysis_type', 'user', 'ats_score', 'file_name', 'created_at')

    # Filters in the right sidebar
    list_filter = ('analysis_type', 'created_at')

    # Fields that are searchable
    search_fields = ('user__name', 'user__email', 'file_name')

    # Default ordering
    ordering = ('-created_at',)

    # Make most fields read-only (analysis results shouldn't be edited)
    readonly_fields = ('id', 'created_at', 'result')

    # Organize fields into sections on the detail page
    fieldsets = (
        (None, {'fields': ('id', 'user', 'resume', 'analysis_type')}),
        ('Results', {'fields': ('ats_score', 'result')}),
        ('Context', {'fields': ('file_name', 'resume_text', 'job_description')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
