from rest_framework import serializers
from .models import Profile


class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    followers_count = serializers.SerializerMethodField(read_only=True)
    following_count = serializers.SerializerMethodField(read_only=True)
    is_following = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'first_name', 'last_name', 'id',
                  'bio', 'location', 'followers_count', 'following_count', 'is_following']

    def get_username(self, obj):
        return obj.user.username

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.user.following.count()

    def get_is_following(self, obj):
        is_following = False
        context = self.context
        request = context.get('request')
        if request:
            is_following = request.user in obj.followers.all()
        return is_following
