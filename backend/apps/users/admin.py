from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'college', 'branch', 'year', 'is_available']
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('bio', 'college', 'branch', 'year', 'skills', 'github_url', 'linkedin_url', 'portfolio_url', 'is_available')}),
    )
