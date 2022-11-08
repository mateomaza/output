from django.conf import settings
from email.policy import default
from django.db import models
import random


max_length = settings.MAX_TWEET_LENGTH
User = settings.AUTH_USER_MODEL

class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    
class Post(models.Model):
    # Maps to SQL Data
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    repost = models.ForeignKey('self', null=True, on_delete=models.SET_NULL)
    likes = models.ManyToManyField(User, related_name='tweet_user', through=PostLike, blank=True)
    content = models.TextField(max_length=max_length, default='')
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']
        
    @property
    def is_repost(self):
        return self.repost != None
        
    def __str__(self):
        return self.content