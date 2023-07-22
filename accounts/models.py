from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = models.CharField(max_length=69, unique=True)
    google_access_token = models.CharField(max_length=420, blank=True, null=True, unique=True)

