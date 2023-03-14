from django.conf import settings

from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

from ..models import Profile

allowed_hosts = settings.ALLOWED_HOSTS


@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication])
def user_follow(request, username):
    if not request.user.is_authenticated:
        return Response({'message': 'You must login!'}, status=401)
    follower = request.user
    if follower.username == username:
        return Response({'followers_count': follower.profile.followers.count()}, status=200)
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({'message': "Profile doesn't exist"}, status=404)
    profile = qs.first()
    data = request.data or {}
    action = data.get('action')
    if action == 'follow':
        profile.followers.add(follower)
    if action == 'unfollow':
        profile.followers.remove(follower)
    return Response({'followers_count': profile.followers.count()}, status=200)
