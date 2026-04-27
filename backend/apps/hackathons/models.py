from django.db import models
from django.conf import settings


class Hackathon(models.Model):
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hackathons')
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    registration_link = models.URLField()
    max_team_size = models.IntegerField(default=4)
    prize_pool = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    is_online = models.BooleanField(default=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return self.title
