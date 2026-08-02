"""
Views (API endpoints) for the Users app.

Each view handles one specific action:
- SignupView: POST /api/users/signup/  → Create a new account
- LoginView: POST /api/users/login/   → Log in and get JWT tokens
- RefreshView: POST /api/users/refresh/ → Get a new access token
- LogoutView: POST /api/users/logout/  → Invalidate refresh token
- MeView: GET /api/users/me/          → Get current user's profile

JWT Flow:
1. User signs up or logs in → gets an accessToken (short-lived) + refreshToken (long-lived)
2. User sends accessToken in every request header: "Authorization: Bearer <token>"
3. When accessToken expires, user sends refreshToken to get a new accessToken
4. On logout, refreshToken is deleted
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer, LoginSerializer, UserSerializer


def get_tokens_for_user(user):
    """
    Generate JWT access and refresh tokens for a user.

    - Access token: Short-lived (30 min), used for API requests
    - Refresh token: Long-lived (7 days), used to get new access tokens
    """
    refresh = RefreshToken.for_user(user)
    return {
        'accessToken': str(refresh.access_token),
        'refreshToken': str(refresh),
    }


class SignupView(APIView):
    """
    POST /api/users/signup/

    Creates a new user account and returns JWT tokens.
    No authentication required (anyone can sign up).
    """

    # Allow unauthenticated access (override the default IsAuthenticated)
    permission_classes = [AllowAny]

    def post(self, request):
        # Validate the incoming data using our SignupSerializer
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            # Return validation errors (e.g., "email already exists")
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the user in the database
        user = serializer.save()

        # Generate JWT tokens for the new user
        tokens = get_tokens_for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            **tokens
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/users/login/

    Authenticates a user and returns JWT tokens.
    No authentication required.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # The LoginSerializer attaches the authenticated user to validated_data
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            **tokens
        }, status=status.HTTP_200_OK)


class RefreshView(APIView):
    """
    POST /api/users/refresh/

    Takes a refresh token and returns a new access token.
    Used when the access token expires (every 30 minutes).
    """

    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refreshToken')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the refresh token and generate a new access token
            refresh = RefreshToken(refresh_token)
            return Response({
                'accessToken': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {'error': 'Invalid or expired refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    """
    POST /api/users/logout/

    Blacklists the refresh token so it can't be used again.
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refreshToken')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            # Even if blacklisting fails, we still "log out" on the client side
            pass

        return Response(
            {'message': 'Logged out successfully'},
            status=status.HTTP_200_OK
        )


class MeView(APIView):
    """
    GET /api/users/me/

    Returns the current authenticated user's profile.
    Requires a valid access token.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user is automatically set by JWT authentication
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
