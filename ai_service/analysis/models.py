"""
Models for the Analysis app.

Stores results of AI-powered resume analysis:
- AnalysisResult: Stores ATS score, suggestions, and full analysis data
  for both standalone analyses and job description comparisons.
"""

import uuid
from django.db import models
from django.conf import settings


class AnalysisResult(models.Model):
    """
    Stores the result of an AI analysis on a resume.

    Two types of analysis:
    1. "analysis" — General resume review (ATS score, formatting, keywords, suggestions)
    2. "jd_comparison" — Compare resume against a specific job description
    """

    TYPE_CHOICES = [
        ('analysis', 'Resume Analysis'),
        ('jd_comparison', 'Job Description Comparison'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Link to the resume (optional — might be an uploaded file, not a saved resume)
    resume = models.ForeignKey(
        'resumes.Resume',
        on_delete=models.SET_NULL,   # Keep the analysis even if resume is deleted
        null=True,
        blank=True,
        related_name='analyses'
    )

    # Which user ran this analysis
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='analyses'
    )

    # Type of analysis
    analysis_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    # ATS compatibility score (0-100)
    ats_score = models.IntegerField(null=True, blank=True)

    # Full analysis result stored as JSON
    # Contains: formatting, sections, keywords, suggestions
    result = models.JSONField(default=dict)

    # For JD comparisons — the job description text
    job_description = models.TextField(blank=True, default='')

    # For uploaded file analyses — the original filename
    file_name = models.CharField(max_length=255, blank=True, default='')

    # The resume text that was analyzed (useful for reference)
    resume_text = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analysis_results'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.analysis_type} — Score: {self.ats_score} — {self.created_at}'
