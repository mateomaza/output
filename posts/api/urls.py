from django.urls import path
from .views import (
    posts_list, 
    post_detail, 
    post_create, 
    post_action, 
    post_delete
) 

urlpatterns = [path('', posts_list),
               path('<int:post_id>/', post_detail),
               path('create/', post_create),
               path('action/', post_action),
               path('delete/<int:post_id>/', post_delete)]