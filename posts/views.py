from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from posts.models import Post
from posts.forms import PostForm
from posts.serializers import PostSerializer, ActionSerializer


allowed_hosts = settings.ALLOWED_HOSTS

def home(request):
    return render(request, 'pages/home.html', context={}, status=200)


@api_view(['GET'])
def posts_list(request):
    qs = Post.objects.all()
    serializer = PostSerializer(qs, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def post_detail(request, post_id):
    qs = Post.objects.filter(id=post_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = PostSerializer(obj)
    return Response(serializer.data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_create(request, *args, **kwargs):
    serializer = PostSerializer(data=request.POST or None)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_action(request):
    serializer = ActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        post_id = data.get('id')
        action = data.get('action')
        qs = Post.objects.filter(id=post_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action == 'like':
            obj.likes.add(request.user)
        elif action == 'unlike':
            obj.likes.remove(request.user)
        elif action == 're-post':
            # todo
            pass
    return Response({'message': 'Tweet removed'}, status=200)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def post_delete(request, post_id):
    qs = Post.objects.filter(id=post_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    obj.delete()
    return Response({'message': 'Tweet removed'}, status=200)


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


def post_create_django(request, *args, **kwargs):
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