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
from .services.gemini_service import analyze_resume, compare_with_job_description, validate_is_resume, parse_resume_to_builder
from .services.resume_parser import extract_text_from_file, resume_to_text
from resumes.models import Resume
from resumes.serializers import ResumeSerializer


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
        resume_data = None

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
                
                # Check if it's a valid resume
                is_resume_result = validate_is_resume(resume_text)
                if not is_resume_result.get('isResume', True):
                    reason = is_resume_result.get('reason', 'The uploaded document does not appear to be a resume.')
                    return Response(
                        {'error': f'This doesn\'t look like a resume. {reason}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Parse and save as a native Resume object
                resume_data = parse_resume_to_builder(resume_text)
                clean_title = file_name.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
                if len(clean_title) > 50 or not clean_title:
                    clean_title = 'Uploaded Resume'

                resume = Resume.objects.create(
                    user=request.user,
                    title=clean_title,
                    is_uploaded=True,
                    resume_text=resume_text,
                    personal_info=resume_data.get('personalInfo', {}),
                    summary=resume_data.get('summary', ''),
                    experience=resume_data.get('experience', []),
                    education=resume_data.get('education', []),
                    skills=resume_data.get('skills', []),
                    projects=resume_data.get('projects', []),
                    status='complete'
                )
                resume_id = str(resume.id)
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
            
            # Serialize the saved resume to builder format
            serializer = ResumeSerializer(resume)
            data = serializer.data
            resume_data = {
                'personalInfo': data.get('personal_info', {}),
                'summary': data.get('summary', ''),
                'experience': data.get('experience', []),
                'education': data.get('education', []),
                'skills': data.get('skills', []),
                'projects': data.get('projects', [])
            }

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

        # Validation was already handled during upload or it's a saved resume

        # Call Claude AI to analyze the resume
        try:
            analysis_result = analyze_resume(resume_text)
            # If we don't have resume_data (e.g., from file upload), parse it now
            if not resume_data:
                resume_data = parse_resume_to_builder(resume_text)
            # Embed it in the result
            analysis_result['resumeData'] = resume_data
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
            'resumeText': resume_text,
            'createdAt': analysis.created_at.isoformat()
        }

        return Response(response_data, status=status.HTTP_200_OK)


class CompareJDView(APIView):
    """
    POST /api/analysis/compare-jd/

    Compares a resume against a job description.
    Accepts either:
    - A file upload (PDF/DOCX) + jobDescription
    - A resumeId + jobDescription (for saved resumes)
    Returns a match score and tailored suggestions.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        resume_text = None
        resume_id = None
        file_name = ''
        resume_data = None

        # Get job description from request
        job_description = request.data.get('jobDescription', '')
        if not job_description or len(job_description.strip()) < 50:
            return Response(
                {'error': 'Job description must be at least 50 characters.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Option 1: File upload
        if 'file' in request.FILES:
            uploaded_file = request.FILES['file']
            file_name = uploaded_file.name

            # Validate file type
            allowed_types = ['.pdf', '.docx']
            if not any(file_name.lower().endswith(ext) for ext in allowed_types):
                return Response(
                    {'error': 'Only PDF and DOCX files are supported.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Extract text from the uploaded file
            try:
                file_content = uploaded_file.read()
                resume_text = extract_text_from_file(file_content, file_name)
                
                # Check if it's a valid resume
                is_resume_result = validate_is_resume(resume_text)
                if not is_resume_result.get('isResume', True):
                    reason = is_resume_result.get('reason', 'The uploaded document does not appear to be a resume.')
                    return Response(
                        {'error': f'This doesn\'t look like a resume. {reason}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Parse and save as a native Resume object
                resume_data = parse_resume_to_builder(resume_text)
                resume = Resume.objects.create(
                    user=request.user,
                    title=file_name,
                    is_uploaded=True,
                    resume_text=resume_text,
                    personal_info=resume_data.get('personalInfo', {}),
                    summary=resume_data.get('summary', ''),
                    experience=resume_data.get('experience', []),
                    education=resume_data.get('education', []),
                    skills=resume_data.get('skills', []),
                    projects=resume_data.get('projects', []),
                    status='complete'
                )
                resume_id = str(resume.id)
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
            
            # Serialize the saved resume to builder format
            serializer = ResumeSerializer(resume)
            data = serializer.data
            resume_data = {
                'personalInfo': data.get('personal_info', {}),
                'summary': data.get('summary', ''),
                'experience': data.get('experience', []),
                'education': data.get('education', []),
                'skills': data.get('skills', []),
                'projects': data.get('projects', [])
            }

        else:
            return Response(
                {'error': 'Please upload a file or select a saved resume.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not resume_text or not resume_text.strip():
            return Response(
                {'error': 'Resume has no content to compare.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call AI for comparison
        try:
            comparison_result = compare_with_job_description(
                resume_text, job_description
            )
            # If we don't have resume_data (e.g., from file upload), parse it now
            if not resume_data:
                resume_data = parse_resume_to_builder(resume_text)
            # Embed it in the result
            comparison_result['resumeData'] = resume_data
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
            file_name=file_name,
            resume_text=resume_text
        )

        response_data = {
            'id': str(analysis.id),
            **comparison_result,
            'jobDescription': job_description,
            'resumeText': resume_text,
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
