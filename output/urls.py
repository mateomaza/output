"""output URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, re_path, include
from posts.views import global_feed, personal_feed, local_posts_list, local_post_detail
from accounts.views import login_view, logout_view, register_view, decision_view, set_password
from accounts.google import google_auth, google_callback
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login_view),
    path('logout/', logout_view),
    path('register/', register_view),
    path('decision/', decision_view),
    path('', global_feed, name='home'),
    path('feed/', personal_feed),
    path('list/', local_posts_list),
    path('<int:post_id>/', local_post_detail),
    re_path(r'profiles?/', include('profiles.urls')),
    path('api/posts/', include('posts.api.urls')),
    re_path(r'api/profiles?/', include('profiles.api.urls')),
    path('auth/google/login/', google_auth, name='google-login'),
    path('auth/google/callback/', google_callback, name='google-callback'),
    path('set_password/', set_password)
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
