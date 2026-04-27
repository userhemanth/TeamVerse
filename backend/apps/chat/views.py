from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer, MessageCreateSerializer

User = get_user_model()


class ConversationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        try:
            other_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        messages = Message.objects.filter(
            Q(sender=request.user, receiver=other_user) |
            Q(sender=other_user, receiver=request.user)
        )
        # Mark as read
        messages.filter(receiver=request.user, is_read=False).update(is_read=True)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            message = Message.objects.create(
                sender=request.user,
                receiver=serializer.validated_data['receiver'],
                content=serializer.validated_data['content'],
            )
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InboxView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Get all users the current user has conversed with
        sent_to = Message.objects.filter(sender=user).values_list('receiver', flat=True).distinct()
        received_from = Message.objects.filter(receiver=user).values_list('sender', flat=True).distinct()
        contact_ids = set(list(sent_to) + list(received_from))
        contacts = User.objects.filter(id__in=contact_ids)

        inbox = []
        for contact in contacts:
            last_msg = Message.objects.filter(
                Q(sender=user, receiver=contact) | Q(sender=contact, receiver=user)
            ).last()
            unread = Message.objects.filter(sender=contact, receiver=user, is_read=False).count()
            from apps.users.serializers import UserSerializer
            inbox.append({
                'user': UserSerializer(contact).data,
                'last_message': MessageSerializer(last_msg).data if last_msg else None,
                'unread_count': unread,
            })
        inbox.sort(key=lambda x: x['last_message']['created_at'] if x['last_message'] else '', reverse=True)
        return Response(inbox)
