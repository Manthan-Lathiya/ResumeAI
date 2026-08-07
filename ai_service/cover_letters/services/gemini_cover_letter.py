import json
from google import genai
from django.conf import settings


def get_gemini_client():
    """Create and return a Google GenAI client."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError(
            'GEMINI_API_KEY is not set. '
            'Add it to your .env file to use Cover Letter AI generation.'
        )
    return genai.Client(api_key=api_key)


def generate_cover_letter(resume_data=None, job_title='', company_name='', job_description='', tone='Professional', applicant_name='Applicant'):
    """
    Generate a highly tailored cover letter using Google Gemini AI.

    Args:
        resume_data (dict, optional): Structured resume data (experience, skills, summary, etc.)
        job_title (str): Target role title
        company_name (str): Target company name
        job_description (str, optional): Target job description
        tone (str): Desired writing tone ('Professional', 'Enthusiastic', 'Executive', 'Creative', 'Direct')
        applicant_name (str): Full name of the applicant

    Returns:
        dict: {
            "salutation": "Dear Hiring Manager,",
            "bodyParagraphs": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3...", "Paragraph 4..."],
            "closing": "Sincerely,"
        }
    """
    client = get_gemini_client()

    resume_context = ''
    if resume_data:
        resume_context = f"""
CANDIDATE RESUME DATA:
- Name: {applicant_name}
- Summary: {resume_data.get('summary', '')}
- Key Skills: {', '.join(resume_data.get('skills', []))}
- Experience Highlights: {json.dumps(resume_data.get('experience', []))}
"""

    prompt = f"""You are an elite career strategist and executive cover letter writer.
Write a compelling, tailored, 4-paragraph cover letter for {applicant_name} applying for the position of "{job_title}" at "{company_name}".

{resume_context}

TARGET JOB DETAILS:
- Role Title: {job_title}
- Company Name: {company_name}
- Job Description / Requirements:
{job_description if job_description else "Focus on general industry best practices and core competencies for this role."}

DESIRED WRITING TONE: {tone}
- Professional: Authoritative, polished, traditional.
- Enthusiastic: High energy, passionate, forward-looking.
- Executive: Strategic, metrics-driven, leadership-focused.
- Creative: Engaging narrative, bold personality.
- Direct: Concise, action-oriented, zero filler.

Provide your response as a JSON object with EXACTLY this structure (no markdown code blocks, pure JSON):
{{
    "salutation": "Dear Hiring Manager,",
    "bodyParagraphs": [
        "Paragraph 1 (Hook & Introduction): Express enthusiasm for the role at {company_name}, state the target position, and summarize top value proposition.",
        "Paragraph 2 (Core Accomplishments & Value Match): Connect 2-3 specific past achievements directly to {company_name}'s needs.",
        "Paragraph 3 (Cultural & Strategic Alignment): Explain why {company_name}'s mission/industry resonates and how candidate's approach fits.",
        "Paragraph 4 (Call to Action & Closing): Reiterate excitement, request an interview opportunity, and thank the hiring team."
    ],
    "closing": "Sincerely,"
}}

RULES:
1. Do NOT use generic place-holder brackets like [Your Name] inside the paragraphs. Use actual relevant details.
2. Return ONLY the JSON object, no markdown, no conversational text.
"""

    models_to_try = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest']
    response_text = ""

    for m_name in models_to_try:
        try:
            res = client.models.generate_content(
                model=m_name,
                contents=prompt,
            )
            if res and res.text:
                response_text = res.text.strip()
                break
        except Exception as err:
            print(f"Model {m_name} failed in cover letter: {err}")
            continue

    if response_text.startswith('```'):
        response_text = response_text.split('\n', 1)[1]
        response_text = response_text.rsplit('```', 1)[0]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        result = {
            'salutation': 'Dear Hiring Manager,',
            'bodyParagraphs': [
                f'I am writing to express my strong interest in the {job_title} position at {company_name}. With my background and proven track record, I am confident in my ability to contribute effectively to your team.',
                'Throughout my career, I have consistently driven results by combining technical expertise with strategic execution.',
                f'I admire {company_name}\'s vision and work in the industry and am eager to bring my skills to your projects.',
                'Thank you for your time and consideration. I welcome the opportunity to discuss my application further in an interview.'
            ],
            'closing': 'Sincerely,'
        }

    return result
