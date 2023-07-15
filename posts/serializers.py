from django.conf import settings
from rest_framework import serializers
from profiles.serializers import PublicProfileSerializer
from .models import Post, PostLike

MAX_LENGTH = settings.MAX_POST_LENGTH
POST_ACTIONS = settings.POST_ACTION_OPTIONS


class CreateSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(source='user.profile', read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['profile', 'id', 'content', 'likes', 'timestamp', 'image']

    def get_likes(self, obj):
        return obj.likes.count()

    def validate_content(self, value):
        if len(value) > MAX_LENGTH:
            raise serializers.ValidationError('This post is too long!')
        return value


class PostSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(source='user.profile', read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    original = CreateSerializer(source='repost', read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    resized_image = serializers.URLField(read_only=True)
    
    class Meta:
        model = Post
        fields = ['profile', 'id', 'content', 'likes',
                  'is_repost', 'original', 'timestamp', 'has_liked', 'resized_image']

    def get_likes(self, obj):
        return obj.likes.count()

    def get_has_liked(self, obj):
        user = None
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        qs = PostLike.objects.filter(post=obj)
        user_like = qs.filter(user=user)
        has_liked = False
        if user_like:
            has_liked = True
        return has_liked
    
    def get_resized_image(self, obj):
        if obj.resized_image:
            return self.context['request'].build_absolute_uri(obj.resized_image)
        return None


class ActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)
    image = serializers.URLField(allow_blank=True, required=False)

    def validate_action(self, value):
        value = value.lower().strip()
        if not value in POST_ACTIONS:
            raise serializers.ValidationError('This is not a valid action')
        return value
