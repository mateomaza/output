from django.urls import path
from . import views

urlpatterns = [
    path('', views.movies_list_api, name='movies_list_api'),
     path('high-rated-movies/', views.high_rated_movies_by_year, name='high_rated_movies'),
]
