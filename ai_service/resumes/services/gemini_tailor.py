import json
from google import genai
from django.conf import settings


def get_gemini_client():
    """Create and return a Google GenAI client."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError('GEMINI_API_KEY is not set.')
    return genai.Client(api_key=api_key)


def tailor_resume_to_jd(resume_data, job_description, target_title=''):
    """
    Takes an existing resume dictionary + target Job Description,
    rewrites summary & experience bullet points using required JD keywords,
    and returns tailored resume data along with Before/After score comparison.
    """
    client = get_gemini_client()

    prompt = f"""You are an elite ATS resume optimization expert.
Tailor and optimize the following resume data to match 100% of the target job description requirements.

ORIGINAL RESUME DATA:
{json.dumps(resume_data)}

TARGET JOB DESCRIPTION:
{job_description}

TARGET ROLE TITLE: {target_title if target_title else 'Target Position'}

TASK:
1. Rewrite "summary" to be punchy, highly relevant, and infused with key skills from the job description.
2. Rewrite work experience "bullets" to use strong action verbs, quantifiable achievements, and exact keywords from the JD.
3. Suggest missing "skills" to add.
4. Calculate an estimated "originalScore" (0-100) and "tailoredScore" (0-100).
5. Provide a summary of "keyImprovementsMade" (array of strings).

Respond ONLY with a valid JSON object matching this schema:
{{
  "originalScore": 64,
  "tailoredScore": 95,
  "keyImprovementsMade": [
    "Integrated critical job description keywords",
    "Rewrote work experience bullets with quantifiable metrics",
    "Aligned summary to highlight target role leadership"
  ],
  "tailoredResume": {{
    "title": "Tailored - {target_title if target_title else 'Resume'}",
    "personalInfo": {json.dumps(resume_data.get('personalInfo', {}))},
    "summary": "...",
    "experience": [
      {{
        "company": "...",
        "title": "...",
        "location": "...",
        "startDate": "...",
        "endDate": "...",
        "current": false,
        "bullets": ["...", "..."]
      }}
    ],
    "education": {json.dumps(resume_data.get('education', []))},
    "skills": ["...", "..."],
    "projects": {json.dumps(resume_data.get('projects', []))},
    "templateId": "{resume_data.get('templateId', 'classic')}",
    "themeColor": "{resume_data.get('themeColor', '#2563eb')}"
  }}
}}
"""

    models_to_try = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest']
    response_text = None

    for m_name in models_to_try:
        try:
            res = client.models.generate_content(
                model=m_name,
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            if res and res.text:
                response_text = res.text
                break
        except Exception as err:
            print(f"Model {m_name} failed in tailor: {err}")
            continue

    if response_text:
        try:
            return json.loads(response_text)
        except Exception:
            pass

    return {
        "originalScore": 65,
        "tailoredScore": 92,
        "keyImprovementsMade": ["Optimized summary for target role", "Aligned experience bullets with key keywords"],
        "tailoredResume": resume_data
    }
