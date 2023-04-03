from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import FileExtensionValidator, MaxFileSizeValidator
from profiles.serializers import PublicProfileSerializer
from .models import Post, PostLike

max_length = settings.MAX_POST_LENGTH
post_actions = settings.POST_ACTION_OPTIONS


class CreateSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(source='user.profile', read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    image_url = serializers.CharField(read_only=True)

    class Meta:
        model = Post
        fields = ['profile', 'id', 'content', 'likes', 'timestamp', 'image_url']

    def get_likes(self, obj):
        return obj.likes.count()
    
    def create_imaeg(self, validated_data):
        image_url = self.context.get('image_url', '')
        post = Post.objects.create(image_url=image_url, **validated_data)
        return post

    def validate_content(self, value):
        if len(value) > max_length:
            raise serializers.ValidationError('This post is too long!')
        return value


class PostSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(source='user.profile', read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    original = CreateSerializer(source='repost', read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    image = serializers.ImageField(allow_empty_file=True, validators=[
        FileExtensionValidator(allowed_extensions=['jpeg', 'jpg', 'png', 'gif', 'webp']),
        MaxFileSizeValidator(5 * 1024 * 1024),
    ])

    class Meta:
        model = Post
        fields = ['profile', 'id', 'content', 'likes',
                  'is_repost', 'original', 'timestamp', 'has_liked', 'image']

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


class ActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)

    def validate_action(self, value):
        value = value.lower().strip()
        if not value in post_actions:
            raise serializers.ValidationError('This is not a valid action')
        return value
