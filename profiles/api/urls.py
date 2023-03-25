from django.urls import path
from .views import (
    profile_follow
)
"""
CLIENT
Base Endpoint r'/api/profiles?/'
"""
urlpatterns = [path('<str:username>/follow', profile_follow),
               path('<str:username>/', profile_follow)]
