from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_queryset(self):
        qs = Project.objects.all()
        status_filter = self.request.query_params.get('status')
        project_type = self.request.query_params.get('type')
        skill = self.request.query_params.get('skill')
        q = self.request.query_params.get('q')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if project_type:
            qs = qs.filter(project_type=project_type)
        if q:
            qs = qs.filter(title__icontains=q)
        if skill:
            all_projects = list(qs)
            qs = [p for p in all_projects if skill.lower() in [s.lower() for s in p.required_skills]]
        return qs

    def create(self, request, *args, **kwargs):
        serializer = ProjectCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            project = serializer.save()
            return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProjectCreateSerializer
        return ProjectSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = ProjectCreateSerializer(instance, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            project = serializer.save()
            return Response(ProjectSerializer(project).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
