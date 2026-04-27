from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'project_type', 'status', 'team_size', 'created_at']
    list_filter = ['status', 'project_type']
    search_fields = ['title', 'description']
