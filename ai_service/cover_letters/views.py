from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CoverLetter
from .serializers import CoverLetterSerializer
from .services.gemini_cover_letter import generate_cover_letter
from resumes.models import Resume


class CoverLetterViewSet(viewsets.ModelViewSet):
    """
    CRUD viewset for saved user cover letters.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CoverLetterSerializer

    def get_queryset(self):
        return CoverLetter.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GenerateCoverLetterView(APIView):
    """
    POST /api/cover-letters/generate/
    Generates tailored cover letter paragraphs using Gemini AI.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resumeId')
        job_title = request.data.get('jobTitle', '')
        company_name = request.data.get('companyName', '')
        job_description = request.data.get('jobDescription', '')
        tone = request.data.get('tone', 'Professional')

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

        applicant_name = request.user.name or 'Applicant'

        try:
            result = generate_cover_letter(
                resume_data=resume_data,
                job_title=job_title,
                company_name=company_name,
                job_description=job_description,
                tone=tone,
                applicant_name=applicant_name
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to generate cover letter: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
