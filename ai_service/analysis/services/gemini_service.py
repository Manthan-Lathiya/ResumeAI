"""
Google Gemini AI Service — Google GenAI API Integration

This module handles all communication with the Google Gemini API.
It sends resume text to Gemini and gets back structured analysis results.

How it works:
1. We send Gemini a carefully crafted prompt with the resume text
2. Gemini analyzes the resume and returns a structured JSON response
3. We parse that JSON and return it to the caller

The key to good AI results is the PROMPT — we tell Gemini exactly
what format to return the data in, so we always get consistent results.
"""

import json
from google import genai
from django.conf import settings


def get_gemini_client():
    """Create and return a Google GenAI client."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError(
            'GEMINI_API_KEY is not set. '
            'Add it to your .env file to use AI analysis.'
        )
    return genai.Client(api_key=api_key)


def call_gemini_models(client, prompt):
    """Helper to try supported Gemini models in sequence."""
    models_to_try = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest']
    for m_name in models_to_try:
        try:
            res = client.models.generate_content(
                model=m_name,
                contents=prompt
            )
            if res and res.text:
                return res.text.strip()
        except Exception as err:
            print(f"Model {m_name} failed: {err}")
            continue
    raise RuntimeError("All Gemini API models failed.")


def analyze_resume(resume_text):
    """
    Analyze a resume using Google Gemini AI.

    Takes the full text of a resume and returns a detailed analysis including:
    - ATS compatibility score
    - Formatting issues
    - Missing sections
    - Keyword analysis
    - Specific improvement suggestions

    Args:
        resume_text (str): The full text content of the resume

    Returns:
        dict: Structured analysis result
    """
    client = get_gemini_client()

    # This prompt is the most important part — it tells Gemini exactly
    # what to analyze and how to format the response
    prompt = f"""You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.
Analyze the following resume and provide a detailed, actionable review.

RESUME TEXT:
---
{resume_text}
---

Provide your analysis as a JSON object with EXACTLY this structure (no markdown, no code blocks, just pure JSON):
{{
    "atsScore": <number 0-100>,
    "formatting": {{
        "score": <number 0-100>,
        "issues": [
            {{
                "severity": "<error|warning|info>",
                "message": "<specific issue description>",
                "location": "<which section has the issue>"
            }}
        ]
    }},
    "sections": {{
        "present": ["<list of sections found in the resume>"],
        "missing": ["<list of important sections that are missing>"],
        "recommendations": ["<specific recommendations for section improvements>"]
    }},
    "keywords": {{
        "found": ["<technical and professional keywords found>"],
        "suggestedToAdd": ["<keywords that should be added based on the resume's target role>"],
        "reasoning": "<explain why these keywords matter>"
    }},
    "suggestions": [
        {{
            "section": "<which section this suggestion is for>",
            "original": "<the original text from the resume>",
            "improved": "<your improved version>",
            "reasoning": "<why this improvement matters for ATS and readability>"
        }}
    ]
}}

IMPORTANT RULES:
1. Be SPECIFIC — reference actual content from the resume, not generic advice
2. The "original" field in suggestions must quote actual text from the resume
3. The "improved" field must be a concrete rewrite, not a vague suggestion
4. Score ATS compatibility based on: keyword density, formatting, section completeness, quantified achievements, action verbs
5. Suggest at least 3 specific improvements with before/after examples
6. Return ONLY the JSON object, no other text"""

    # Call Gemini API with dynamic model fallback
    response_text = call_gemini_models(client, prompt)

    # Parse the JSON response
    # Sometimes Gemini wraps JSON in markdown code blocks, so we clean that up
    if response_text.startswith('```'):
        # Remove markdown code block markers
        response_text = response_text.split('\n', 1)[1]  # Remove first line (```)
        response_text = response_text.rsplit('```', 1)[0]  # Remove last ```
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        # If JSON parsing fails, return a basic error result
        result = {
            'atsScore': 0,
            'formatting': {'score': 0, 'issues': []},
            'sections': {'present': [], 'missing': [], 'recommendations': []},
            'keywords': {'found': [], 'suggestedToAdd': [], 'reasoning': ''},
            'suggestions': [],
            'error': 'Failed to parse AI response. Please try again.'
        }

    return result


def compare_with_job_description(resume_text, job_description):
    """
    Compare a resume against a job description using Google Gemini AI.

    Returns a match score and specific suggestions for aligning
    the resume to the job requirements.

    Args:
        resume_text (str): The full text content of the resume
        job_description (str): The job description to compare against

    Returns:
        dict: Structured comparison result with match score and suggestions
    """
    client = get_gemini_client()

    prompt = f"""You are an expert resume consultant and hiring specialist.
Compare the following resume against the job description and provide a detailed match analysis.

RESUME:
---
{resume_text}
---

JOB DESCRIPTION:
---
{job_description}
---

Provide your analysis as a JSON object with EXACTLY this structure (no markdown, no code blocks, just pure JSON):
{{
    "matchScore": <number 0-100>,
    "matchedKeywords": ["<skills/keywords found in BOTH the resume and JD>"],
    "missingKeywords": ["<important skills/keywords in the JD but NOT in the resume>"],
    "suggestions": [
        {{
            "type": "<add_skill|rewrite_bullet|add_section|reorder>",
            "skill": "<relevant skill if type is add_skill>",
            "section": "<relevant section>",
            "original": "<original text from resume if rewriting>",
            "improved": "<suggested improvement>",
            "reasoning": "<why this change improves the match>"
        }}
    ],
    "overallAssessment": "<2-3 sentence summary of how well the resume matches and top priorities for improvement>"
}}

IMPORTANT RULES:
1. Be SPECIFIC to THIS resume and THIS job description
2. Missing keywords should only include skills/requirements explicitly mentioned in the JD
3. Only suggest adding skills the candidate might plausibly have based on their background
4. Provide at least 3 concrete rewrite suggestions with before/after
5. The matchScore should reflect actual keyword and experience alignment
6. Return ONLY the JSON object, no other text"""

    response_text = call_gemini_models(client, prompt)

    # Clean up markdown code blocks if present
    if response_text.startswith('```'):
        response_text = response_text.split('\n', 1)[1]
        response_text = response_text.rsplit('```', 1)[0]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        result = {
            'matchScore': 0,
            'matchedKeywords': [],
            'missingKeywords': [],
            'suggestions': [],
            'overallAssessment': 'Failed to parse AI response. Please try again.',
            'error': 'Failed to parse AI response.'
        }

    return result


def validate_is_resume(text):
    """
    Validate whether the given text is from a resume/CV document.

    Uses Gemini to quickly classify the document type. This is a lightweight
    check run BEFORE the full analysis to avoid wasting AI credits on
    non-resume documents (invoices, reports, random PDFs, etc.).

    Args:
        text (str): Extracted text from the uploaded document

    Returns:
        dict: { "isResume": bool, "reason": str }
    """
    client = get_gemini_client()

    # Use only the first 500 chars for classification — faster and cheaper
    sample_text = text[:500]

    prompt = f"""You are a document classifier. Look at the following text extracted from a document and determine if it is a resume or CV (curriculum vitae).

TEXT SAMPLE:
---
{sample_text}
---

A resume/CV typically contains: personal contact information, work experience, education, skills, and/or a professional summary.

Respond with ONLY a JSON object (no markdown, no code blocks):
{{
    "isResume": true or false,
    "reason": "Brief explanation if NOT a resume (1 sentence). Empty string if it IS a resume."
}}"""

    response_text = call_gemini_models(client, prompt)

    # Clean up markdown code blocks if present
    if response_text.startswith('```'):
        response_text = response_text.split('\n', 1)[1]
        response_text = response_text.rsplit('```', 1)[0]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        # If parsing fails, assume it's a resume (don't block the user)
        result = {'isResume': True, 'reason': ''}

    return result


def parse_resume_to_builder(resume_text):
    """
    Parse a raw resume text into the structured JSON format used by the Resume Builder.
    
    Args:
        resume_text (str): The raw text extracted from a PDF/DOCX
        
    Returns:
        dict: A dictionary containing personalInfo, summary, experience, education, skills, projects
    """
    client = get_gemini_client()

    prompt = f"""You are a resume parsing AI. Extract the information from the following resume text and structure it exactly into the specified JSON format.

RESUME TEXT:
---
{resume_text}
---

Provide your analysis as a JSON object with EXACTLY this structure (no markdown, no code blocks):
{{
    "personalInfo": {{
        "fullName": "Extracted full name or empty string",
        "email": "Extracted email or empty string",
        "phone": "Extracted phone or empty string",
        "location": "Extracted location/address or empty string",
        "linkedin": "Extracted LinkedIn URL or empty string",
        "website": "Extracted other website/portfolio or empty string"
    }},
    "summary": "Extracted professional summary or objective, or empty string",
    "experience": [
        {{
            "company": "Company name",
            "title": "Job title",
            "location": "Job location or empty string",
            "startDate": "Start date (e.g. Jan 2020) or empty string",
            "endDate": "End date (e.g. Present) or empty string",
            "current": false,
            "bullets": [
                "Bullet point 1",
                "Bullet point 2"
            ]
        }}
    ],
    "education": [
        {{
            "institution": "University/School name",
            "degree": "Degree name (e.g. B.S. Computer Science)",
            "startDate": "Start date or empty string",
            "endDate": "End date or empty string",
            "gpa": "GPA or empty string"
        }}
    ],
    "skills": ["skill 1", "skill 2"],
    "projects": [
        {{
            "name": "Project name",
            "description": "Project description",
            "technologies": ["React", "Node.js"],
            "link": "Project link or empty string"
        }}
    ]
}}

IMPORTANT RULES:
1. If a section is missing from the resume, return an empty array [] or empty string "" as appropriate.
2. Return ONLY the JSON object, no other text."""

    response_text = call_gemini_models(client, prompt)

    if response_text.startswith('```'):
        response_text = response_text.split('\n', 1)[1]
        response_text = response_text.rsplit('```', 1)[0]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        # Fallback empty structure
        result = {
            "personalInfo": {"fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": ""},
            "summary": "",
            "experience": [],
            "education": [],
            "skills": [],
            "projects": []
        }

    return result
