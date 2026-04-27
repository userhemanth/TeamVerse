from rest_framework import serializers
from apps.users.serializers import UserSerializer
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'owner', 'title', 'description', 'project_type',
            'required_skills', 'team_size', 'members', 'member_count',
            'status', 'college', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.count()


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'project_type', 'required_skills', 'team_size', 'status', 'college']

    def create(self, validated_data):
        user = self.context['request'].user
        project = Project.objects.create(owner=user, **validated_data)
        if not project.college:
            project.college = user.college
            project.save()
        return project
