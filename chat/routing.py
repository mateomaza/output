from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path

import consumers  # Import your consumer(s)

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        re_path(r"ws/some_path/$", consumers.ChatConsumer.as_asgi()),  # Example WebSocket URL
    ]),
})