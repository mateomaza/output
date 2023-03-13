from django.urls import path
from .views import (
    posts_list, 
    post_detail, 
    post_create, 
    post_action, 
    post_delete
) 
"""
CLIENT
Base Endpoint /api/posts/
"""
urlpatterns = [path('', posts_list),
               path('<int:post_id>/', post_detail),
               path('create/', post_create),
               path('action/', post_action),
               path('<int:post_id>/delete/', post_delete)]