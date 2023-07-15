from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.contrib import admin
from django.db import models

class User(AbstractUser):
    google_access_token = models.CharField(max_length=420, blank=True, null=True, unique=True)

User = get_user_model()
admin.site.register(User)