"""
Admin configuration for the Users app.

Registers the custom User model with the Django admin panel,
allowing superusers to manage users through the admin interface.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin configuration for the User model.

    Since we use a custom User model (email as username, UUID as ID),
    we need to customize the admin to match our fields.
    """

    # Columns shown in the user list view
    list_display = ('email', 'name', 'is_active', 'is_staff', 'created_at')

    # Filters in the right sidebar
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'created_at')

    # Fields that are searchable
    search_fields = ('email', 'name')

    # Default ordering
    ordering = ('-created_at',)

    # Fields shown on the user detail/edit page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    # Fields shown when creating a new user in admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )

    # Make timestamp fields read-only
    readonly_fields = ('created_at', 'updated_at')
