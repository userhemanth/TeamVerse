from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    YEAR_CHOICES = [(1, '1st Year'), (2, '2nd Year'), (3, '3rd Year'), (4, '4th Year')]

    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    college = models.CharField(max_length=200, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    year = models.IntegerField(null=True, blank=True, choices=YEAR_CHOICES)
    skills = models.JSONField(default=list)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
