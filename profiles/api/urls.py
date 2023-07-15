from django.urls import path
from .views import (
    profiles_list,
    profile_follow,
    current_profile
)
"""
CLIENT
Base Endpoint r'/api/profiles?/'
"""
urlpatterns = [path('list', profiles_list),
               path('<str:username>/follow/', profile_follow),
               path('<str:username>/', profile_follow),
               path('request/current/', current_profile)]
