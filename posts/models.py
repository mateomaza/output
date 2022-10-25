from email.policy import default
from django.db import models
from django.conf import settings
import random

User = settings.AUTH_USER_MODEL

class Post(models.Model):
    # Maps to SQL Data
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=User)    
    content = models.TextField(max_length=280, default='')
    
    class Meta:
        ordering = ['-id']

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'likes': random.randint(0, 200)
        }
