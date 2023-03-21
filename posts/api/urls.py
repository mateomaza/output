from django.urls import path
from .views import (
    posts_list,
    profile_posts,
    posts_feed,
    posts_global_feed,
    post_detail,
    post_create,
    post_action,
    post_delete
)
"""
CLIENT
Base Endpoint /api/posts/
"""
urlpatterns = [
    path('', posts_list),
    path('<str:username>/profile/', profile_posts),
    path('feed/', posts_feed),
    path('feed/global', posts_global_feed),
    path('<int:post_id>/', post_detail),
    path('create/', post_create),
    path('action/', post_action),
    path('<int:post_id>/delete/', post_delete)]
