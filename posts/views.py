import random
from django.conf import settings
from django.shortcuts import render, redirect
from django.http import JsonResponse
from posts.models import Post
from posts.forms import PostForm


def home(request):
    print(request.user)
    return render(request, 'pages/home.html', context={}, status=200)


def posts_list(request):
    """
    REST API VIEW
    Consumed by JavaScript/Swift/Java/iOS/Android/ReactNative
    return json data
    """
    qs = Post.objects.all()
    posts_list = [x.serialize() for x in qs]
    data = {
        'dataResponse': posts_list
    }
    return JsonResponse(data)


def post_detail(request, post_id):
    """
    REST API VIEW
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


def post_create(request, *args, **kwargs):
    user = request.user
    if not request.user.is_authenticated:
        return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))
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
