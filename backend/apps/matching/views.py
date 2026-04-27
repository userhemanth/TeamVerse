from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.users.serializers import UserSerializer
from apps.projects.serializers import ProjectSerializer
from .algorithm import match_users_to_project, match_projects_to_user

User = get_user_model()


class MatchUsersForProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            return Response({'detail': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)

        users = User.objects.filter(is_available=True)
        results = match_users_to_project(project, users)
        data = [{'user': UserSerializer(r['user']).data, 'score': r['score']} for r in results]
        return Response(data)


class MatchProjectsForUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(status='OPEN')
        results = match_projects_to_user(request.user, projects)
        data = [{'project': ProjectSerializer(r['project']).data, 'score': r['score']} for r in results]
        return Response(data)
