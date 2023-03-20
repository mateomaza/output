from django.conf import settings

from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

from ..models import Profile
from ..serializers import PublicProfileSerializer

allowed_hosts = settings.ALLOWED_HOSTS

@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication])
def user_follow(request, username):
    qs = Profile.objects.filter(user__username=username)
    user = request.user
    if not qs.exists():
        return Response({'detail': 'User not found'}, status=404)
    obj = qs.first()
    data = request.data or {}
    if request.method == 'POST':
        action = data.get('action')
        if obj.user != user:
            if action == 'follow':
                obj.followers.add(user)
            if action == 'unfollow':
                obj.followers.remove(user)
    serializer = PublicProfileSerializer(instance=obj, context={'request': request})
    print(serializer)
    return Response(serializer.data, status=200)