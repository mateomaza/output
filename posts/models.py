from django.conf import settings
from django.db import models
from django.db.models import Q
from .api.images import resize_image


MAX_LENGTH = settings.MAX_POST_LENGTH
User = settings.AUTH_USER_MODEL


class PostQuerySet(models.QuerySet):
    def by_username(self, username):
        return self.filter(user__username__iexact=username)

    def by_feed(self, user):
        followed_users_id = []
        if user.following.exists():
            followed_users_id = user.following.values_list(
                'user__id', flat=True)
        return self.filter(
            Q(user__id__in=followed_users_id) |
            Q(user=user)
        ).distinct().order_by('-timestamp')


class PostManager(models.Manager):
    def get_queryset(self):
        return PostQuerySet(self.model, using=self._db)

    def by_feed(self, user):
        return self.get_queryset().by_feed(user)


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default='')
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class Post(models.Model):
    # Maps to SQL Data
    user = models.ForeignKey(User, related_name='posts',
                             on_delete=models.CASCADE, default='')
    repost = models.ForeignKey('self', null=True, on_delete=models.SET_NULL)
    likes = models.ManyToManyField(
        User, related_name='post_user', through=PostLike, blank=True)
    content = models.TextField(max_length=MAX_LENGTH, default='')
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    resized_image = models.URLField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    objects = PostManager()

    class Meta:
        ordering = ['-id']

    @property
    def is_repost(self):
        return self.repost != None

    def __str__(self):
        return self.content
    
    def save(self, *args, **kwargs):
        resized_image_url = resize_image(self.image)
        if resized_image_url is not None:
            self.resized_image = resized_image_url
        super().save(*args, **kwargs)
