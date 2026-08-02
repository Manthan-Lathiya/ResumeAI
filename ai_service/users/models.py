"""
User model for ResumeAI.

We create a CUSTOM user model instead of using Django's default User.
This gives us full control over the fields (email as username, UUID as ID, etc.)

Key concepts:
- AbstractBaseUser: Provides password hashing and authentication logic
- BaseUserManager: Lets us customize how users are created
- PermissionsMixin: Adds is_superuser, groups, and permissions fields
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    """
    Custom manager for creating users.
    Django needs this to know HOW to create regular users and superusers.
    """

    def create_user(self, email, name, password=None):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError('Users must have an email address')

        # Normalize email — lowercases the domain part (user@GMAIL.com → user@gmail.com)
        email = self.normalize_email(email)

        # Create the user object (doesn't save to DB yet)
        user = self.model(email=email, name=name)

        # Hash the password (never store plain text!)
        user.set_password(password)

        # Save to database
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        """Create and return a superuser (for Django admin access)."""
        user = self.create_user(email=email, name=name, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model.

    Uses EMAIL instead of username for login.
    Uses UUID instead of auto-increment integer for the primary key.
    """

    # UUID primary key — more secure than sequential integers
    # (prevents someone from guessing user IDs like /users/1, /users/2, etc.)
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    # User's full name
    name = models.CharField(max_length=255)

    # Email — used as the login username (must be unique)
    email = models.EmailField(unique=True)

    # Django admin fields
    is_active = models.BooleanField(default=True)    # Can the user log in?
    is_staff = models.BooleanField(default=False)     # Can access Django admin?

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)   # Set once on creation
    updated_at = models.DateTimeField(auto_now=True)        # Updated on every save

    # Tell Django to use our custom manager
    objects = UserManager()

    # Use email as the "username" field for authentication
    USERNAME_FIELD = 'email'

    # Fields required when creating a superuser (besides email and password)
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'           # Table name in SQLite
        ordering = ['-created_at']   # Newest users first

    def __str__(self):
        return f'{self.name} ({self.email})'
