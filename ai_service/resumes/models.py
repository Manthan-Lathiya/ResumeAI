"""
Resume model for ResumeAI.

Stores all sections of a user's resume:
- Personal info (name, email, phone, location, links)
- Summary / objective
- Work experience (list of jobs with bullet points)
- Education (list of degrees)
- Skills (list of skill names)
- Projects (list of portfolio projects)

We use JSONField for complex nested data (experience, education, projects)
because these are lists of objects with varying structures.
"""

import uuid
from django.db import models
from django.conf import settings


class Resume(models.Model):
    """
    A single resume belonging to a user.
    Users can have multiple resumes (one per job application, for example).
    """

    # Status choices — a resume is either a draft (still editing) or complete
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('complete', 'Complete'),
    ]

    # Primary key — UUID for security
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Which user owns this resume
    # on_delete=CASCADE means: if the user is deleted, delete all their resumes too
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'      # Access via user.resumes.all()
    )

    # Resume title (e.g., "Software Engineer Resume", "Marketing Resume")
    title = models.CharField(max_length=255)

    # ─── RESUME SECTIONS ───────────────────────────

    # Personal info stored as JSON:
    # { "fullName": "...", "email": "...", "phone": "...",
    #   "location": "...", "linkedin": "...", "website": "..." }
    personal_info = models.JSONField(default=dict, blank=True)

    # Professional summary or career objective
    summary = models.TextField(blank=True, default='')

    # Work experience stored as JSON array:
    # [{ "company": "...", "title": "...", "location": "...",
    #    "startDate": "...", "endDate": "...", "current": false,
    #    "bullets": ["Did X...", "Led Y..."] }]
    experience = models.JSONField(default=list, blank=True)

    # Education stored as JSON array:
    # [{ "institution": "...", "degree": "...",
    #    "startDate": "...", "endDate": "...", "gpa": "..." }]
    education = models.JSONField(default=list, blank=True)

    # Skills as a JSON array of strings: ["Python", "React", "SQL"]
    skills = models.JSONField(default=list, blank=True)

    # Projects stored as JSON array:
    # [{ "name": "...", "description": "...",
    #    "technologies": ["Go", "Docker"], "link": "..." }]
    projects = models.JSONField(default=list, blank=True)

    # Resume status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resumes'
        ordering = ['-updated_at']   # Most recently updated first

    def __str__(self):
        return f'{self.title} — {self.user.name}'
