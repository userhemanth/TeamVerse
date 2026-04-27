import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.other_id = self.scope['url_route']['kwargs']['other_id']
        ids = sorted([int(self.user_id), int(self.other_id)])
        self.room_name = f"chat_{ids[0]}_{ids[1]}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('content', '')
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')

        message = await self.save_message(sender_id, receiver_id, content)
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id,
                    'content': content,
                    'created_at': str(message.created_at),
                }
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        from .models import Message
        return Message.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
        )
