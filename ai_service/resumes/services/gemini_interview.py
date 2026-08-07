import json
from google import genai
from django.conf import settings


def get_gemini_client():
    """Create and return a Google GenAI client."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError('GEMINI_API_KEY is not set.')
    return genai.Client(api_key=api_key)


def generate_interview_prep(resume_data=None, job_title='', job_description='', question_type='all'):
    """
    Generates 8 to 10 role-specific behavioral, technical, and situational interview questions
    with tailored STAR model answers using Google Gemini AI.
    """
    client = get_gemini_client()

    resume_context = ""
    if resume_data:
        resume_context = f"""
CANDIDATE RESUME EXPERIENCE & SKILLS:
- Summary: {resume_data.get('summary', '')}
- Key Skills: {', '.join(resume_data.get('skills', []))}
- Past Work Experience: {json.dumps(resume_data.get('experience', []))}
- Education: {json.dumps(resume_data.get('education', []))}
"""

    prompt = f"""You are an executive interview coach and hiring manager at a top enterprise.
Generate 8 comprehensive, highly tailored interview questions for a candidate applying for the position of "{job_title if job_title else 'Target Professional Role'}".

{resume_context}

TARGET JOB DESCRIPTION:
{job_description if job_description else "Focus on core competencies, technical leadership, problem solving, system design, and industry best practices."}

QUESTION CATEGORY FILTER: {question_type}

Generate 8 distinct questions covering:
- Behavioral questions (STAR method)
- Technical & architecture questions
- Situational & problem solving questions
- Leadership & team collaboration questions

For each question, provide:
1. "id": integer (1 to 8)
2. "question": The exact interview question recruiters ask.
3. "category": "Behavioral (STAR)", "Technical", "Situational", or "Leadership".
4. "whyAsked": Explanation of what the interviewer is evaluating.
5. "starAnswer": A complete, detailed model answer formatted using the STAR method (Situation, Task, Action, Result) referencing candidate's experience.
6. "talkingPoints": Array of 3 key bullet points the candidate should emphasize.

Respond ONLY with a valid JSON object matching this schema:
{{
  "questions": [
    {{
      "id": 1,
      "question": "...",
      "category": "Behavioral (STAR)",
      "whyAsked": "...",
      "starAnswer": "...",
      "talkingPoints": ["...", "...", "..."]
    }}
  ]
}}
"""

    # Active supported models for user's API key
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
        except Exception as e:
            print(f"Model {m_name} failed in interview prep: {e}")
            continue

    if response_text:
        try:
            return json.loads(response_text)
        except Exception:
            pass

    # Fallback response
    role_name = job_title if job_title else 'this role'
    return {
        "questions": [
            {
                "id": 1,
                "question": f"Tell me about a complex project you led relevant to {role_name}.",
                "category": "Behavioral (STAR)",
                "whyAsked": "Assesses end-to-end ownership, technical execution, and problem solving under constraints.",
                "starAnswer": "Situation: In my previous project, our platform experienced high latency under load. Task: I was responsible for re-architecting the data pipeline. Action: I benchmarked query bottlenecks, implemented asynchronous caching, and refactored core service modules. Result: Reduced latency by 42% and improved reliability.",
                "talkingPoints": ["Quantify metric improvements", "Explain architectural trade-offs", "Highlight team leadership"]
            },
            {
                "id": 2,
                "question": f"How do you handle technical disagreements or shifting requirements when working as a {role_name}?",
                "category": "Situational",
                "whyAsked": "Evaluates communication, stakeholder alignment, and flexibility under pressure.",
                "starAnswer": "Situation: A critical requirement changed mid-sprint. Task: Align technical feasibility with business priorities. Action: I organized a design review, presented data-driven options, and proposed a phased rollout. Result: Delivered core features on schedule with zero downtime.",
                "talkingPoints": ["Data-driven decision making", "Cross-functional communication", "Risk mitigation"]
            },
            {
                "id": 3,
                "question": f"What core technical tools or methodologies do you prioritize for {role_name} tasks?",
                "category": "Technical",
                "whyAsked": "Verifies technical depth, tool proficiency, and adherence to industry standards.",
                "starAnswer": "Situation: Building maintainable software requires modern tooling. Task: Selecting optimal frameworks for scale. Action: Implemented automated CI/CD pipelines, containerization, and monitoring dashboards. Result: Increased deployment velocity and minimized production defects.",
                "talkingPoints": ["Tool selection rationale", "CI/CD & testing coverage", "Production observability"]
            },
            {
                "id": 4,
                "question": "Describe a situation where a system or feature failed in production. How did you resolve it?",
                "category": "Situational",
                "whyAsked": "Tests incident response, debugging efficiency, and composure during outages.",
                "starAnswer": "Situation: An unexpected resource bottleneck degraded API responses. Task: Rapidly restore system health. Action: Isolated failing processes, analyzed logs, and deployed a hotfix within 15 minutes. Result: Restored full uptime and implemented preventative alert thresholds.",
                "talkingPoints": ["Structured debugging approach", "Post-mortem analysis", "Preventative monitoring"]
            },
            {
                "id": 5,
                "question": f"Where do you see the biggest technological innovations impacting {role_name} in the next 2 years?",
                "category": "Leadership",
                "whyAsked": "Evaluates strategic vision, continuous learning, and adaptability to industry shifts.",
                "starAnswer": "Situation: Technology evolves rapidly. Task: Staying ahead of industry shifts. Action: Regularly evaluate AI integration, automated tooling, and cloud architectures. Result: Successfully adopted modern practices that accelerated team delivery speed.",
                "talkingPoints": ["AI-assisted workflows", "Scalability trends", "Continuous professional growth"]
            }
        ]
    }
