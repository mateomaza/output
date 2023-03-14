from django.conf import settings
from django.shortcuts import render

allowed_hosts = settings.ALLOWED_HOSTS


def home(request):
    username = None
    if request.user.is_authenticated:
        username = request.user.username
    return render(request, 'pages/home.html', context={'username': username}, status=200)


def local_posts_list(request):
    return render(request, 'posts/list.html')


def local_post_detail(request, post_id):
    return render(request, 'posts/detail.html', context={'post_id': post_id})
