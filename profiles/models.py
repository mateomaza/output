from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

User = settings.AUTH_USER_MODEL


class FollowerRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default='')
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default='')
    location = models.CharField(max_length=220, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    followers = models.ManyToManyField(User, related_name='following', blank=True)


@receiver(post_save, sender=User)
def user_did_save(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
