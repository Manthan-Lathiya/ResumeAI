"""
Admin configuration for the Resumes app.

Registers the Resume model with the Django admin panel,
allowing superusers to view and manage resumes.
"""

from django.contrib import admin
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    """Admin configuration for the Resume model."""

    # Columns shown in the resume list view
    list_display = ('title', 'user', 'status', 'created_at', 'updated_at')

    # Filters in the right sidebar
    list_filter = ('status', 'created_at')

    # Fields that are searchable
    search_fields = ('title', 'user__name', 'user__email')

    # Default ordering
    ordering = ('-updated_at',)

    # Make timestamp fields read-only
    readonly_fields = ('id', 'created_at', 'updated_at')

    # Organize fields into sections on the detail page
    fieldsets = (
        (None, {'fields': ('id', 'user', 'title', 'status')}),
        ('Personal Info', {'fields': ('personal_info',)}),
        ('Content', {'fields': ('summary', 'experience', 'education', 'skills', 'projects')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
