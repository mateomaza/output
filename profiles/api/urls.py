from django.urls import path
from .views import (
    user_follow
) 
"""
CLIENT
Base Endpoint r'/api/profiles?/'
"""
urlpatterns = [path('<str:username>/follow', user_follow)]