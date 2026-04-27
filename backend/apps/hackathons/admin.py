from django.contrib import admin
from .models import Hackathon


@admin.register(Hackathon)
class HackathonAdmin(admin.ModelAdmin):
    list_display = ['title', 'posted_by', 'start_date', 'end_date', 'is_online']
    list_filter = ['is_online']
