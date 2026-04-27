from rest_framework import serializers
from apps.users.serializers import UserSerializer
from apps.projects.serializers import ProjectSerializer
from .models import TeamRequest


class TeamRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = TeamRequest
        fields = ['id', 'sender', 'project', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sender', 'status', 'created_at', 'updated_at']


class TeamRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamRequest
        fields = ['project', 'message']
