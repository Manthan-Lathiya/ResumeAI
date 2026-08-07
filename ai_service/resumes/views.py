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
from rest_framework.parsers import MultiPartParser, FormParser
from analysis.services.resume_parser import extract_text_from_file
from analysis.services.gemini_service import validate_is_resume, parse_resume_to_builder

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


class UploadResumeView(APIView):
    """
    POST /api/resumes/upload/
    Uploads a resume file (PDF or DOCX), extracts the text, and saves it
    as a raw resume in the user's profile.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response(
                {'error': 'Please upload a file'},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES['file']
        file_name = uploaded_file.name

        # Validate file size (max 10MB)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response(
                {'error': 'File size must be less than 10MB'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file type
        allowed_types = ['.pdf', '.docx']
        if not any(file_name.lower().endswith(ext) for ext in allowed_types):
            return Response(
                {'error': 'Only PDF and DOCX files are supported'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            file_content = uploaded_file.read()
            resume_text = extract_text_from_file(file_content, file_name)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that the uploaded document is actually a resume
        validation = validate_is_resume(resume_text)
        if not validation.get('isResume', False):
            return Response(
                {'error': f"Document doesn't appear to be a resume. {validation.get('reason', '')}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Parse the raw text into the builder JSON structure
        builder_data = parse_resume_to_builder(resume_text)
        
        # Clean title (remove extension and timestamp tags)
        clean_title = file_name.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
        if len(clean_title) > 50 or not clean_title:
            clean_title = 'Uploaded Resume'

        # Save to database
        resume = Resume.objects.create(
            user=request.user,
            title=clean_title,
            is_uploaded=True,
            resume_text=resume_text,
            personal_info=builder_data.get('personalInfo', {}),
            summary=builder_data.get('summary', ''),
            experience=builder_data.get('experience', []),
            education=builder_data.get('education', []),
            skills=builder_data.get('skills', []),
            projects=builder_data.get('projects', []),
            status='complete'
        )

        serializer = ResumeSerializer(resume)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InterviewPrepView(APIView):
    """
    POST /api/resumes/interview-prep/
    Generates role-specific behavioral (STAR method) and technical interview questions.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resumeId')
        job_title = request.data.get('jobTitle', '')
        job_description = request.data.get('jobDescription', '')
        question_type = request.data.get('questionType', 'all')

        resume_data = None
        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = {
                    'summary': resume.summary,
                    'skills': resume.skills,
                    'experience': resume.experience,
                    'education': resume.education,
                }
            except Resume.DoesNotExist:
                pass

        from .services.gemini_interview import generate_interview_prep
        try:
            result = generate_interview_prep(
                resume_data=resume_data,
                job_title=job_title,
                job_description=job_description,
                question_type=question_type
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TailorResumeView(APIView):
    """
    POST /api/resumes/tailor/
    Tailors resume summary & experience bullet points according to target JD keywords.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resumeId')
        job_description = request.data.get('jobDescription', '')
        target_title = request.data.get('targetTitle', '')

        if not job_description:
            return Response({'error': 'Job Description is required'}, status=status.HTTP_400_BAD_REQUEST)

        resume_data = request.data.get('resumeData')
        if not resume_data and resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                serializer = ResumeSerializer(resume)
                resume_data = serializer.data
            except Resume.DoesNotExist:
                return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

        if not resume_data:
            return Response({'error': 'Resume data or valid resumeId required'}, status=status.HTTP_400_BAD_REQUEST)

        from .services.gemini_tailor import tailor_resume_to_jd
        try:
            result = tailor_resume_to_jd(
                resume_data=resume_data,
                job_description=job_description,
                target_title=target_title
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


