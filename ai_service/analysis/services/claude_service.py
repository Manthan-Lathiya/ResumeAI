"""
Claude AI Service — Anthropic API Integration

This module handles all communication with the Anthropic Claude API.
It sends resume text to Claude and gets back structured analysis results.

How it works:
1. We send Claude a carefully crafted prompt with the resume text
2. Claude analyzes the resume and returns a structured JSON response
3. We parse that JSON and return it to the caller

The key to good AI results is the PROMPT — we tell Claude exactly
what format to return the data in, so we always get consistent results.
"""

import json
import anthropic
from django.conf import settings


def get_claude_client():
    """Create and return an Anthropic API client."""
    api_key = settings.ANTHROPIC_API_KEY
    if not api_key:
        raise ValueError(
            'ANTHROPIC_API_KEY is not set. '
            'Add it to your .env file to use AI analysis.'
        )
    return anthropic.Anthropic(api_key=api_key)


def analyze_resume(resume_text):
    """
    Analyze a resume using Claude AI.

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
    client = get_claude_client()

    # This prompt is the most important part — it tells Claude exactly
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

    # Call Claude API
    message = client.messages.create(
        model='claude-sonnet-4-20250514',
        max_tokens=4096,
        messages=[
            {'role': 'user', 'content': prompt}
        ]
    )

    # Extract the text response from Claude
    response_text = message.content[0].text.strip()

    # Parse the JSON response
    # Sometimes Claude wraps JSON in markdown code blocks, so we clean that up
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
    Compare a resume against a job description using Claude AI.

    Returns a match score and specific suggestions for aligning
    the resume to the job requirements.

    Args:
        resume_text (str): The full text content of the resume
        job_description (str): The job description to compare against

    Returns:
        dict: Structured comparison result with match score and suggestions
    """
    client = get_claude_client()

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

    message = client.messages.create(
        model='claude-sonnet-4-20250514',
        max_tokens=4096,
        messages=[
            {'role': 'user', 'content': prompt}
        ]
    )

    response_text = message.content[0].text.strip()

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
