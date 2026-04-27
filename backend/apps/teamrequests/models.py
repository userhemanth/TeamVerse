from django.db import models
from django.conf import settings


class TeamRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_team_requests')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='team_requests')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['sender', 'project']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.email} -> {self.project.title} ({self.status})"
