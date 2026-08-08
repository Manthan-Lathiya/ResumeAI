"""
Google Gemini AI Service — Resume Generator & In-Line Builder Assistant
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
            'Add it to your .env file to use AI Resume Generation.'
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


def generate_full_resume(job_title='', experience_level='Mid-Level', skills_input='', background_notes=''):
    """
    Generates a complete, high-impact, ATS-optimized resume schema using Google Gemini AI.

    Args:
        job_title (str): Target position (e.g. "Senior Full-Stack Developer")
        experience_level (str): Candidate level (e.g. "Entry-Level", "Mid-Level", "Senior / Lead", "Executive")
        skills_input (str): User-provided list of core tools or skills
        background_notes (str): Optional user background context or target job description

    Returns:
        dict: Complete structured resume data ready for ResumeBuilder state
    """
    client = get_gemini_client()

    prompt = f"""You are an elite Career Strategist and Professional Executive Resume Writer.
Create a complete, highly realistic, ATS-optimized professional resume for a candidate applying for the target position of "{job_title if job_title else 'Professional Candidate'}".

CANDIDATE PARAMETERS:
- Target Job Title: {job_title if job_title else 'Professional Candidate'}
- Experience Level: {experience_level}
- Key Skills & Technologies: {skills_input if skills_input else 'Include top industry-standard tools and skills for this role'}
- Background Context / Target Requirements: {background_notes if background_notes else 'Focus on high-growth industry achievements and modern standards.'}

REQUIREMENTS:
1. **Personal Info**: Generate a clean placeholder name like "Alex Morgan" or realistic full name, professional email, phone, location, LinkedIn, and portfolio link.
2. **Professional Summary**: Write a compelling 3-4 sentence summary highlighting target role leadership, core skills, and track record.
3. **Work Experience**: Generate 2 to 3 realistic work experience entries matching the candidate's level. Each entry MUST feature 3-4 high-impact bullet points starting with strong action verbs (e.g. "Engineered", "Spearheaded", "Optimized", "Scaled") and quantified metrics (percentages %, dollar amounts $, user scale).
4. **Education**: Generate 1-2 realistic degrees aligned with the target role.
5. **Skills**: Generate an array of 8-12 top technical and domain skills for this job title.
6. **Projects**: Generate 2 realistic key projects showcasing relevant tech stack.

Respond ONLY with a valid JSON object matching this schema (no markdown code blocks, no extra text):
{{
    "title": "{job_title if job_title else 'AI Generated'} Resume",
    "personalInfo": {{
        "fullName": "Alex Morgan",
        "email": "alex.morgan@example.com",
        "phone": "+1 (555) 234-5678",
        "location": "San Francisco, CA",
        "linkedin": "linkedin.com/in/alexmorgan",
        "website": "alexmorgan.dev"
    }},
    "summary": "<compelling 3-4 sentence professional summary>",
    "experience": [
        {{
            "company": "<realistic company name>",
            "title": "<job title>",
            "location": "<city, state>",
            "startDate": "Jan 2021",
            "endDate": "Present",
            "current": true,
            "bullets": [
                "<bullet point starting with action verb and including quantified metrics>",
                "<bullet point with metrics and achievements>",
                "<bullet point highlighting technical impact>"
            ]
        }}
    ],
    "education": [
        {{
            "institution": "<University Name>",
            "degree": "<B.S. / M.S. in relevant field>",
            "startDate": "2016",
            "endDate": "2020",
            "gpa": "3.8"
        }}
    ],
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
    "projects": [
        {{
            "name": "<Project Name>",
            "description": "<Concise high-impact project description>",
            "technologies": ["Tech 1", "Tech 2", "Tech 3"],
            "link": "github.com/alexmorgan/project"
        }}
    ],
    "templateId": "classic",
    "themeColor": "#2563eb"
}}"""

    response_text = call_gemini_models(client, prompt)

    if response_text.startswith('```'):
        response_text = response_text.split('\n', 1)[1]
        response_text = response_text.rsplit('```', 1)[0]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        raise ValueError('Failed to parse AI-generated resume JSON response.')

    return result


def enhance_resume_field(field_type, current_value='', context=''):
    """
    Enhances a specific field in the resume (summary, bullet point, or skills).

    Args:
        field_type (str): 'summary', 'bullet', or 'skills'
        current_value (str): The existing text value in the field
        context (str): Additional context like job title or section info

    Returns:
        dict: { "enhancedValue": str | list }
    """
    client = get_gemini_client()

    if field_type == 'summary':
        prompt = f"""You are an expert resume editor. Polish and enhance the following professional summary to make it punchy, powerful, and ATS-friendly.
Target Role Context: {context}
Current Summary:
"{current_value}"

Respond with ONLY a JSON object:
{{
    "enhancedValue": "<improved 3-4 sentence summary>"
}}"""

    elif field_type == 'bullet':
        prompt = f"""You are an executive resume writer. Rewrite the following resume bullet point using a strong action verb (e.g. Spearheaded, Engineered, Architected, Scaled) and include realistic quantifiable metrics (%, $, efficiency gains).
Target Role / Company Context: {context}
Current Bullet:
"{current_value}"

Respond with ONLY a JSON object:
{{
    "enhancedValue": "<improved high-impact bullet point with action verb and metrics>"
}}"""

    elif field_type == 'skills':
        prompt = f"""You are a tech recruiter. Suggest 8 to 12 top industry-standard skills and tools for a candidate in the role of "{context if context else current_value}".

Respond with ONLY a JSON object:
{{
    "enhancedValue": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"]
}}"""
    else:
        raise ValueError(f"Invalid field_type: {field_type}")

    response_text = call_gemini_models(client, prompt)

    if response_text.startswith('```'):
        response_text = response_text.split('\n', 1)[1]
        response_text = response_text.rsplit('```', 1)[0]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        raise ValueError('Failed to parse AI field enhancement response.')

    return result
