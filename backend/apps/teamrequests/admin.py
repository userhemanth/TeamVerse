from django.contrib import admin
from .models import TeamRequest


@admin.register(TeamRequest)
class TeamRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'project', 'status', 'created_at']
    list_filter = ['status']
