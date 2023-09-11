from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.contrib import admin
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    username = models.CharField(max_length=69, unique=True, validators=[
                                RegexValidator(r'^\S+$', message="Usernames cannot contain spaces.")])
    username_last_updated = models.DateTimeField(default=timezone.now() - timedelta(days=365))
    email = models.CharField(max_length=420, blank=True)
    google_access_token = models.CharField(
        max_length=420, blank=True, null=True, unique=True)
    
admin.site.register(User)
