from rest_framework import serializers
from apps.users.serializers import UserSerializer
from .models import Hackathon


class HackathonSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)

    class Meta:
        model = Hackathon
        fields = [
            'id', 'posted_by', 'title', 'description',
            'start_date', 'end_date', 'registration_link',
            'max_team_size', 'prize_pool', 'location',
            'is_online', 'tags', 'created_at',
        ]
        read_only_fields = ['id', 'posted_by', 'created_at']


class HackathonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = [
            'title', 'description', 'start_date', 'end_date',
            'registration_link', 'max_team_size', 'prize_pool',
            'location', 'is_online', 'tags',
        ]
