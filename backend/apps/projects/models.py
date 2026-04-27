from django.db import models
from django.conf import settings


class Project(models.Model):
    STATUS_CHOICES = [('OPEN', 'Open'), ('CLOSED', 'Closed')]
    TYPE_CHOICES = [
        ('HACKATHON', 'Hackathon'),
        ('SIDE_PROJECT', 'Side Project'),
        ('RESEARCH', 'Research'),
        ('STARTUP', 'Startup'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='SIDE_PROJECT')
    required_skills = models.JSONField(default=list)
    team_size = models.IntegerField(default=4)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='member_projects', blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='OPEN')
    college = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
