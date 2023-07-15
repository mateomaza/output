from django.urls import path
from .views import profile_detail, profile_update

urlpatterns = [
    path('update/', profile_update, name='profile_update'),
    path('<str:username>/detail/', profile_detail),
]
