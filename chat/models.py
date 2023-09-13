from django.conf import settings
from django.db import models

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Chat(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chats')
    messages = models.ManyToManyField(Message)