from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from ..models import Profile
from ..serializers import PublicProfileSerializer

allowed_hosts = settings.ALLOWED_HOSTS
User = get_user_model()

def get_paginated_queryset(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = PublicProfileSerializer(
        paginated_qs, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def profiles_list(request):
    if not request.user.is_authenticated:
        mateo = User.objects.first()
        request.user = mateo
    qs = Profile.objects.order_by('id')
    username = request.GET.get('username')
    if username != None:
        qs = qs.by_username(username)
    return get_paginated_queryset(qs, request)

@api_view(['GET'])
def profile_detail(request, username):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
            return Response({'detail': 'User not found'}, status=404)
    obj = qs.first()
    serializer = PublicProfileSerializer(
        instance=obj, context={'request': request})
    return Response(serializer.data, status=200)

@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication])
def profile_follow(request, username):
    if not request.user.is_authenticated:
        mateo = User.objects.first()
        request.user = mateo
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
    serializer = PublicProfileSerializer(
        instance=obj, context={'request': request})
    return Response(serializer.data, status=200)

@api_view(['GET'])
def current_profile(request):
    user = request.user
    if not request.user.is_authenticated:
        mateo = User.objects.first()
        user = mateo
    qs = Profile.objects.filter(user=user)
    obj = qs.first()
    serializer = PublicProfileSerializer(
        instance=obj, context={'request': request})
    return Response(serializer.data, status=202)
