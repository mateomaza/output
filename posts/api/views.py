from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from ..models import Post
from ..forms import PostForm
from ..serializers import PostSerializer, CreateSerializer, ActionSerializer

allowed_hosts = settings.ALLOWED_HOSTS


def get_paginated_queryset(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = PostSerializer(paginated_qs, many=True)
    return paginator.get_paginated_response(serializer.data)

@authentication_classes([SessionAuthentication])
@api_view(['GET'])
def posts_feed(request):
    qs = Post.objects.by_feed(request.user)
    return get_paginated_queryset(qs, request)


@api_view(['GET'])
def posts_list(request):
    qs = Post.objects.all()
    username = request.GET.get('username')
    if username != None:
        qs = qs.by_username(username)
    return get_paginated_queryset(qs, request)


@api_view(['GET'])
def post_detail(request, post_id):
    qs = Post.objects.filter(id=post_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = PostSerializer(obj)
    return Response(serializer.data, status=200)

from django.contrib.auth import get_user_model
User = get_user_model()
@api_view(['POST'])
def post_create(request):
    if not request.user.is_authenticated:
        mateo = User.objects.first()
        request.user = mateo
    serializer = CreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
def post_action(request):
    user = request.user
    if not user.is_authenticated:
        user.id = 0
        return Response({'message': 'You must login!'}, status=401)
    action_serializer = ActionSerializer(data=request.data)
    if action_serializer.is_valid(raise_exception=True):
        data = action_serializer.validated_data
        post_id = data.get('id')
        action = data.get('action')
        content = data.get('content')
        qs = Post.objects.filter(id=post_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        post_serializer = PostSerializer(obj)
        if action == 'like':
            obj.likes.add(user)
            return Response(post_serializer.data, status=200)
        if action == 'unlike':
            obj.likes.remove(user)
            return Response(post_serializer.data, status=200)
        if action == 'repost':
            new_post = Post.objects.create(
                user=user, repost=obj, content=content)
            serializer = PostSerializer(new_post)
            return Response(serializer.data, status=201)


@api_view(['DELETE', 'POST'])
@authentication_classes([SessionAuthentication])
def post_delete(request, post_id):
    try:
        qs = Post.objects.filter(id=post_id)
        post_user = qs[0].user
        if not qs.exists():
            return Response({'message': "Post doesn't exist"}, status=404)
        if not request.user.is_authenticated:
            return Response({'message': 'You must login!'}, status=401)
        if request.user != post_user:
            return Response({'message': 'You cannot delete this post'}, status=403)
        obj = qs.first()
        obj.delete()
        return Response({'message': 'Post removed'}, status=200)
    except IndexError:
        return Response({'message': "Post doesn't exist"}, status=404)


def posts_list_django(request):
    """
    REST API View
    Consumed by JavaScript/Swift/Java/iOS/Android/ReactNative
    return json data
    """
    qs = Post.objects.all()
    posts_list = [x.serialize() for x in qs]
    data = {
        'dataResponse': posts_list
    }
    return JsonResponse(data)


def post_detail_django(request, post_id):
    """
    REST API View
    Consumed by JavaScript/Swift/Java/iOS/Android/ReactNative
    return json data
    """
    data = {
        'id': post_id,
    }
    status = 200
    try:
        obj = Post.objects.get(id=post_id)
        data['content'] = obj.content
    except:
        data['message'] = "Post not found"
        status = 404
    return JsonResponse(data, status=status)


def post_create_django(request):
    """
    REST API Create View
    """
    user = request.user
    if not request.user.is_authenticated:
        return HttpResponse('401 Unauthorized', status=401)
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.user = user
            obj.save()
            return JsonResponse(obj.serialize(), status=201)
    else:
        form = PostForm()
    if form.errors:
        return JsonResponse(form.errors, status=400)
    return render(request, 'components/form.html', {'form': form})
