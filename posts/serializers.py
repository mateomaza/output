from django.conf import settings
from rest_framework import serializers
from .models import Post

max_length = settings.MAX_TWEET_LENGTH

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content']
        
        def validate_content(self, value):
            if len(value) > max_length:
                raise serializers.ValidationError('This post is too long!')
            return value