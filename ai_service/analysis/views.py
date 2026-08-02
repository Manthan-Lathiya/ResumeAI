"""
Views for the Analysis app.

These views handle AI-powered resume analysis:
- AnalyzeView: Analyze a resume (uploaded file or saved resume)
- CompareJDView: Compare a resume against a job description
- AnalysisHistoryView: Get past analysis results

The analysis flow:
1. User uploads a PDF/DOCX file OR selects a saved resume
2. We extract the text from the resume
3. We send the text to Claude AI for analysis
4. We store the result in the database
5. We return the analysis to the user
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

from .models import AnalysisResult
from .serializers import AnalysisResultSerializer, CompareJDRequestSerializer
from .services.claude_service import analyze_resume, compare_with_job_description
from .services.resume_parser import extract_text_from_file, resume_to_text
from resumes.models import Resume


class AnalyzeView(APIView):
    """
    POST /api/analysis/analyze/

    Analyzes a resume and returns an ATS score with detailed feedback.

    Accepts either:
    - A file upload (PDF or DOCX) via multipart/form-data
    - A resumeId in the request body to analyze a saved resume
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        resume_text = None
        resume_id = None
        file_name = ''

        # Option 1: File upload
        if 'file' in request.FILES:
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

            # Extract text from the uploaded file
            try:
                file_content = uploaded_file.read()
                resume_text = extract_text_from_file(file_content, file_name)
            except ValueError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Option 2: Use a saved resume
        elif request.data.get('resumeId'):
            resume_id = request.data['resumeId']
            resume = get_object_or_404(
                Resume, id=resume_id, user=request.user
            )
            resume_text = resume_to_text(resume)

        else:
            return Response(
                {'error': 'Please upload a file or select a saved resume'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check that we actually got some text to analyze
        if not resume_text or not resume_text.strip():
            return Response(
                {'error': 'Could not extract text from the resume'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call Claude AI to analyze the resume
        try:
            analysis_result = analyze_resume(resume_text)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': f'AI analysis failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save the analysis result to the database
        analysis = AnalysisResult.objects.create(
            resume_id=resume_id,
            user=request.user,
            analysis_type='analysis',
            ats_score=analysis_result.get('atsScore', 0),
            result=analysis_result,
            file_name=file_name,
            resume_text=resume_text
        )

        # Return the analysis result
        response_data = {
            'id': str(analysis.id),
            'resumeId': str(resume_id) if resume_id else None,
            **analysis_result,
            'createdAt': analysis.created_at.isoformat()
        }

        return Response(response_data, status=status.HTTP_200_OK)


class CompareJDView(APIView):
    """
    POST /api/analysis/compare-jd/

    Compares a saved resume against a job description.
    Returns a match score and tailored suggestions.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CompareJDRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_id = serializer.validated_data['resumeId']
        job_description = serializer.validated_data['jobDescription']

        # Get the resume and convert to text
        resume = get_object_or_404(Resume, id=resume_id, user=request.user)
        resume_text = resume_to_text(resume)

        if not resume_text.strip():
            return Response(
                {'error': 'Resume has no content to compare'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call Claude AI for comparison
        try:
            comparison_result = compare_with_job_description(
                resume_text, job_description
            )
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': f'AI comparison failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save the result
        analysis = AnalysisResult.objects.create(
            resume_id=resume_id,
            user=request.user,
            analysis_type='jd_comparison',
            ats_score=comparison_result.get('matchScore', 0),
            result=comparison_result,
            job_description=job_description,
            resume_text=resume_text
        )

        response_data = {
            'id': str(analysis.id),
            **comparison_result,
            'createdAt': analysis.created_at.isoformat()
        }

        return Response(response_data, status=status.HTTP_200_OK)


class AnalysisHistoryView(APIView):
    """
    GET /api/analysis/history/

    Returns all past analysis results for the logged-in user.
    Used in the Dashboard to show analysis history.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = AnalysisResult.objects.filter(user=request.user)
        serializer = AnalysisResultSerializer(analyses, many=True)
        return Response(
            {'analyses': serializer.data},
            status=status.HTTP_200_OK
        )
