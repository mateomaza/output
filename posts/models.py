from django.conf import settings
from email.policy import default
from django.db import models
import random


max_length = settings.MAX_TWEET_LENGTH

class Post(models.Model):
    # Maps to SQL Data
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=max_length, default='')

    class Meta:
        ordering = ['-id']
        
    def __str__(self):
        return self.content

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'likes': random.randint(0, 200)
        }
