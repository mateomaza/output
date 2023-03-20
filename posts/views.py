from django.conf import settings
from django.shortcuts import render


from .models import Post, PostLike

allowed_hosts = settings.ALLOWED_HOSTS

from django.contrib.auth import get_user_model
User = get_user_model()
def local_posts_list(request):
    return render(request, 'posts/list.html')



def local_post_detail(request, post_id):
    qs = Post.objects.filter(id=post_id)
    post = qs.first()
    qs = PostLike.objects.filter(post=post)
    user_like = qs.filter(user=request.user)
    if user_like:
        has_liked = True
    context = {
        'post_id': post_id,
        'has_liked': has_liked
    }
    return render(request, 'posts/detail.html', context)
