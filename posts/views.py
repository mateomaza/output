from django.conf import settings
from django.shortcuts import render


from .models import Post, PostLike

allowed_hosts = settings.ALLOWED_HOSTS


def home(request):
    username = None
    if request.user.is_authenticated:
        username = request.user.username
    return render(request, 'pages/home.html', context={'username': username}, status=200)


def local_posts_list(request):
    return render(request, 'posts/list.html')



def local_post_detail(request, post_id):
    qs = Post.objects.filter(id=post_id)
    post = qs.first()
    qs = PostLike.objects.filter(post=post)
    user_like = qs.filter(user=request.user)
    has_liked = False
    if user_like:
        has_liked = True
    context = {
        'post_id': post_id,
        'has_liked': has_liked
    }
    return render(request, 'posts/detail.html', context)
