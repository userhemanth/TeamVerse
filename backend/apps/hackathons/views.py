from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Hackathon
from .serializers import HackathonSerializer, HackathonCreateSerializer


class HackathonListCreateView(generics.ListCreateAPIView):
    queryset = Hackathon.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HackathonCreateSerializer
        return HackathonSerializer

    def create(self, request, *args, **kwargs):
        serializer = HackathonCreateSerializer(data=request.data)
        if serializer.is_valid():
            hackathon = serializer.save(posted_by=request.user)
            return Response(HackathonSerializer(hackathon).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
