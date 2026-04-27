from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import TeamRequest
from .serializers import TeamRequestSerializer, TeamRequestCreateSerializer
from apps.projects.models import Project


class SendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TeamRequestCreateSerializer(data=request.data)
        if serializer.is_valid():
            project_id = serializer.validated_data['project'].id
            if TeamRequest.objects.filter(sender=request.user, project_id=project_id).exists():
                return Response({'detail': 'Already sent a request to this project.'}, status=status.HTTP_400_BAD_REQUEST)
            team_request = TeamRequest.objects.create(
                sender=request.user,
                project=serializer.validated_data['project'],
                message=serializer.validated_data.get('message', ''),
            )
            return Response(TeamRequestSerializer(team_request).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReceivedRequestsView(generics.ListAPIView):
    serializer_class = TeamRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TeamRequest.objects.filter(project__owner=self.request.user)


class SentRequestsView(generics.ListAPIView):
    serializer_class = TeamRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TeamRequest.objects.filter(sender=self.request.user)


class AcceptRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            team_request = TeamRequest.objects.get(pk=pk, project__owner=request.user)
        except TeamRequest.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        team_request.status = 'ACCEPTED'
        team_request.save()
        team_request.project.members.add(team_request.sender)
        return Response(TeamRequestSerializer(team_request).data)


class RejectRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            team_request = TeamRequest.objects.get(pk=pk, project__owner=request.user)
        except TeamRequest.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        team_request.status = 'REJECTED'
        team_request.save()
        return Response(TeamRequestSerializer(team_request).data)
