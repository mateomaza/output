from django.urls import path
from .views import (
    profiles_list,
    profile_follow,
    profile_detail
)
"""
CLIENT
Base Endpoint r'/api/profiles?/'
"""
urlpatterns = [path('list/', profiles_list),
               path('<str:username>/follow/', profile_follow),
               path('<str:username>/detail', profile_detail),]
