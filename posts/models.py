from email.policy import default
from django.db import models
from django.conf import settings
import random


class Post(models.Model):
    # Maps to SQL Data
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=280, default='')

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
