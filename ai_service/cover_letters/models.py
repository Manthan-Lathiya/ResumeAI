import uuid
from django.db import models
from django.conf import settings


class CoverLetter(models.Model):
    """
    Stores user's cover letter data, recipient info, AI-generated content,
    template layout, and theme colors.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cover_letters'
    )

    title = models.CharField(max_length=255, default='Untitled Cover Letter')
    job_title = models.CharField(max_length=255, blank=True, default='')
    company_name = models.CharField(max_length=255, blank=True, default='')
    recipient_name = models.CharField(max_length=255, blank=True, default='Hiring Manager')
    tone = models.CharField(max_length=50, default='Professional')
    job_description = models.TextField(blank=True, default='')

    # Cover Letter Content
    salutation = models.CharField(max_length=255, default='Dear Hiring Manager,')
    body_paragraphs = models.JSONField(default=list, blank=True)
    closing = models.CharField(max_length=255, default='Sincerely,')

    # Visual Layout & Styling
    template_id = models.CharField(max_length=50, default='classic', blank=True)
    theme_color = models.CharField(max_length=20, default='#2563eb', blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cover_letters'
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.title} — {self.user.name}'
