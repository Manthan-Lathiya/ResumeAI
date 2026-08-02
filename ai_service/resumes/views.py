"""
Views for the Resumes app.

Standard CRUD (Create, Read, Update, Delete) operations.
All endpoints require authentication — users can only access their own resumes.

Endpoints:
- GET    /api/resumes/        → List all resumes for the logged-in user
- POST   /api/resumes/        → Create a new resume
- GET    /api/resumes/<id>/   → Get a specific resume
- PUT    /api/resumes/<id>/   → Update a specific resume
- DELETE /api/resumes/<id>/   → Delete a specific resume
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Resume
from .serializers import ResumeSerializer, ResumeListSerializer


class ResumeListCreateView(APIView):
    """
    GET  /api/resumes/ → List user's resumes
    POST /api/resumes/ → Create a new resume
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """List all resumes belonging to the logged-in user."""
        resumes = Resume.objects.filter(user=request.user)
        serializer = ResumeListSerializer(resumes, many=True)
        return Response({'resumes': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new resume for the logged-in user."""
        serializer = ResumeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save with the current user as the owner
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResumeDetailView(APIView):
    """
    GET    /api/resumes/<id>/ → Get a specific resume
    PUT    /api/resumes/<id>/ → Update a specific resume
    DELETE /api/resumes/<id>/ → Delete a specific resume
    """

    permission_classes = [IsAuthenticated]

    def get_resume(self, resume_id, user):
        """
        Helper to get a resume by ID, ensuring it belongs to the current user.
        Returns 404 if not found or doesn't belong to the user.
        """
        return get_object_or_404(Resume, id=resume_id, user=user)

    def get(self, request, resume_id):
        """Get a specific resume."""
        resume = self.get_resume(resume_id, request.user)
        serializer = ResumeSerializer(resume)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, resume_id):
        """Update a specific resume."""
        resume = self.get_resume(resume_id, request.user)

        # partial=True allows updating only some fields (not all required)
        serializer = ResumeSerializer(resume, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, resume_id):
        """Delete a specific resume."""
        resume = self.get_resume(resume_id, request.user)
        resume.delete()
        return Response(
            {'message': 'Resume deleted successfully'},
            status=status.HTTP_200_OK
        )
