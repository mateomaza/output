from django.conf import settings
from rest_framework import serializers
from .models import Post

max_length = settings.MAX_POST_LENGTH
post_actions = settings.POST_ACTION_OPTIONS
    
class CreateSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'content', 'likes']
    def get_likes(self, obj):
        return obj.likes.count()
    def validate_content(self, value):
        if len(value) > max_length:
            raise serializers.ValidationError('This post is too long!')
        return value
    
    
class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    original = CreateSerializer(source='repost', read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'content', 'likes', 'is_repost', 'original']
    def get_likes(self, obj):
        return obj.likes.count()
        
        
class ActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)
    def validate_action(self, value):
        value = value.lower().strip()
        if not value in post_actions:
            raise serializers.ValidationError('This is not a valid action')
        return value