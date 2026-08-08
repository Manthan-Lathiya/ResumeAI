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
    prompt = f"""You are an elite ATS (Applicant Tracking System) Auditor and Senior Career Strategist.
Your job is to strictly and objectively audit the provided resume and return an accurate ATS score (0-100), category breakdowns, and actionable suggestions.

CRITICAL EVALUATION & SCORING RULES:
1. **Dynamic & Fair ATS Scoring (0 - 100)**:
   - Evaluate the resume text rigorously based on the presence of:
     a) Strong metrics, quantifiable achievements, and percentages/numbers in experience bullet points.
     b) Industry-relevant technical skills, tools, and domain keywords.
     c) Strong action verbs (e.g. "Spearheaded", "Architected", "Engineered", "Optimized", "Scaled") starting every bullet point.
     d) Complete essential sections (Personal Info, Professional Summary, Work Experience, Education, Skills, Projects).
     e) Professional summary with clear title and core competencies.
   - **SCORING RUBRIC**:
     - **90-100**: Exceptional ATS quality. Clear metrics (%, $, scale) in almost all bullets, rich keyword density, polished summary, strong action verbs, zero missing core elements.
     - **80-89**: Very strong. Most bullets have metrics or strong verbs, comprehensive skill list, solid summary.
     - **70-79**: Good foundation. Has experience bullets, but lacks quantitative metrics or specific industry keywords.
     - **55-69**: Basic/Needs work. Generic descriptions, missing key technical keywords, no metrics, passive language.
     - **Below 55**: Sub-par. Missing core sections, short/vague descriptions, weak layout.

2. **SCORE PROGRESSION FOR RE-ANALYSIS**:
   - Every time a user improves their resume (e.g. adding quantifiable metrics, incorporating relevant tech skills, rewriting weak bullets with action verbs, expanding the summary), YOU MUST RE-EVALUATE AND INCREASE THE ATS SCORE ACCORDINGLY to reflect the concrete improvements made.
   - Do NOT give the exact same score if the text has improved in quality, action verbs, metrics, or keywords.

3. **SPECIFIC & NON-DUPLICATIVE SUGGESTIONS**:
   - Provide 3 to 5 highly specific, actionable improvement suggestions.
   - Each suggestion MUST quote exact text from the resume in "original" and provide a significantly improved, high-impact version in "improved".
   - If an improvement has ALREADY been made in the text (e.g. metrics added, action verb present), DO NOT ask the user to make the same change again. Focus on remaining areas for growth.

RESUME TEXT TO AUDIT:
---
{resume_text}
---

Provide your audit response as a JSON object with EXACTLY this structure (no markdown fences, no extra text):
{{
    "atsScore": <integer 0-100 representing current quality>,
    "formatting": {{
        "score": <integer 0-100>,
        "issues": [
            {{
                "severity": "error",
                "message": "<description of formatting/clarity issue>",
                "location": "<section name>"
            }}
        ]
    }},
    "sections": {{
        "present": ["<sections found in resume>"],
        "missing": ["<essential sections missing, if any>"],
        "recommendations": ["<recommendations for section organization>"]
    }},
    "keywords": {{
        "score": <integer 0-100>,
        "found": ["<key skills and domain keywords present in text>"],
        "suggestedToAdd": ["<industry keywords that would boost ATS matching>"],
        "reasoning": "<explanation of keyword density and impact>"
    }},
    "suggestions": [
        {{
            "section": "<section name e.g. Work Experience | Summary | Skills>",
            "original": "<exact quote of text from resume>",
            "improved": "<high-impact rewrite featuring metrics, strong action verbs, and keywords>",
            "reasoning": "<why this rewrite increases ATS ranking and recruiter interest>"
        }}
    ]
}}"""

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

    prompt = f"""You are an elite Talent Acquisition Specialist and ATS Matching Systems Expert.
Your task is to conduct a rigorous, objective comparison between the candidate's Resume and the target Job Description (JD), calculating an accurate Match Score (0-100) and actionable alignment recommendations.

EVALUATION & MATCH SCORING RUBRIC:
1. **Dynamic Match Score (0 - 100)**:
   - Calculate `matchScore` strictly based on 4 key factors:
     a) **Hard & Technical Skill Overlap (40%)**: Does the resume contain the explicit technical skills, tools, frameworks, and domain expertise required in the JD?
     b) **Experience & Responsibility Alignment (30%)**: Do the experience bullet points demonstrate duties and projects matching the core responsibilities described in the JD?
     c) **Keyword & Terminology Precision (15%)**: Does the resume use the exact industry standard terminology and phrases referenced in the job posting?
     d) **Impact & Metrics (15%)**: Are accomplishments quantified with metrics (%, $, scale, velocity)?
   - **MATCH SCORE SCALE**:
     - **90-100**: Exceptional Alignment. Resume covers 90%+ of required hard skills, matches experience requirements, uses exact JD terminology, and includes quantified metrics.
     - **78-89**: Strong Alignment. Matches most key skills and duties, but missing 1-2 secondary keywords or specific metrics.
     - **60-77**: Partial Match. Has relevant general experience, but missing several critical technical skills or specific JD requirements.
     - **Below 60**: Low Match. Significant keyword gaps, missing core required qualifications, or unaligned domain background.

2. **SCORE PROGRESSION UPON RE-ANALYSIS**:
   - If the candidate has updated their resume (e.g. added missing keywords, incorporated required skills into their skills list or experience bullets, rewritten achievements to match JD requirements), YOU MUST RE-EVALUATE AND ACCORDINGLY INCREASE THE `matchScore` to reflect the concrete improvements made.
   - Do NOT give the exact same match score if missing keywords or bullet rewrites have been integrated into the resume!

3. **KEYWORDS ANALYSIS**:
   - `matchedKeywords`: Array of important skills, tools, and qualifications present in BOTH the resume and JD.
   - `missingKeywords`: Array of critical skills, certifications, or tools explicitly required in the JD but missing from the resume.

4. **ACTIONABLE SUGGESTIONS (Provide 3 to 5 high-impact items)**:
   - Provide concrete suggestions of types: "add_skill", "rewrite_bullet", "add_section", or "reorder".
   - For "rewrite_bullet": The "original" field MUST quote exact text from the resume, and "improved" MUST be a concrete, high-impact rewrite infusing required JD keywords and metrics.
   - Do NOT suggest adding skills or rewrites that the candidate has ALREADY incorporated into their resume.

RESUME TO EVALUATE:
---
{resume_text}
---

TARGET JOB DESCRIPTION:
---
{job_description}
---

Provide your analysis as a JSON object with EXACTLY this structure (no markdown fences, no extra text):
{{
    "matchScore": <integer 0-100 representing exact alignment percentage>,
    "matchedKeywords": ["<skills/tools found in BOTH resume and JD>"],
    "missingKeywords": ["<required skills/tools from JD missing in resume>"],
    "suggestions": [
        {{
            "type": "add_skill" | "rewrite_bullet" | "add_section" | "reorder",
            "skill": "<specific skill name if type is add_skill>",
            "section": "<Work Experience | Skills | Summary | Projects>",
            "original": "<exact quote from resume if type is rewrite_bullet, else empty>",
            "improved": "<high-impact tailored text incorporating missing JD keywords and metrics>",
            "reasoning": "<why this specific adjustment increases hiring manager interest and ATS match>"
        }}
    ],
    "overallAssessment": "<2-3 sentence executive summary of job match alignment, key strengths, and highest-priority gaps>"
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
