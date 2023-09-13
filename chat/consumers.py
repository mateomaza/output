import json
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from pusher import Pusher

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Process the received message as needed

        await self.send(text_data=json.dumps({
            'message': message
        }))

pusher = Pusher(
    app_id=settings.PUSHER_APP_ID,
    key=settings.PUSHER_KEY,
    secret=settings.PUSHER_SECRET,
    cluster=settings.PUSHER_CLUSTER,
    ssl=True,
)

def pusher_auth(request):
    channel_name = request.GET['channel_name']
    socket_id = request.GET['socket_id']
    auth = pusher.authenticate(
        channel=channel_name,
        socket_id=socket_id,
    )
    return JsonResponse(auth)
