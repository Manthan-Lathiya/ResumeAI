"""
Serializers for the Users app.

Serializers convert Python objects (like our User model) to JSON and back.
Think of them like "translators" between Django models and JSON data.

- SignupSerializer: Validates and processes signup form data
- LoginSerializer: Validates login credentials
- UserSerializer: Converts User model to JSON for API responses
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Converts a User object to JSON.
    Used in API responses — only exposes safe fields (never the password!).
    """

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'created_at']
        # These fields are read-only — can't be changed via the API
        read_only_fields = ['id', 'created_at']


class SignupSerializer(serializers.Serializer):
    """
    Validates signup form data.

    We use a plain Serializer (not ModelSerializer) because we need
    custom validation logic and want to handle password hashing ourselves.
    """

    name = serializers.CharField(
        max_length=255,
        error_messages={'blank': 'Name is required'}
    )
    email = serializers.EmailField(
        error_messages={'blank': 'Email is required', 'invalid': 'Enter a valid email'}
    )
    password = serializers.CharField(
        min_length=8,
        write_only=True,  # Never include password in responses!
        error_messages={
            'blank': 'Password is required',
            'min_length': 'Password must be at least 8 characters'
        }
    )

    def validate_email(self, value):
        """Check if a user with this email already exists."""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError('A user with this email already exists')
        return value.lower()  # Store emails in lowercase

    def create(self, validated_data):
        """Create a new user with the validated data."""
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Validates login credentials.
    Uses Django's built-in authenticate() function to check email + password.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validate that the email/password combination is correct.
        This method is called after individual field validation passes.
        """
        email = data.get('email', '').lower()
        password = data.get('password', '')

        # Django's authenticate() checks the password against the stored hash
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password')

        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated')

        # Attach the user object to the validated data so the view can access it
        data['user'] = user
        return data
