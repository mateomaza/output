from django.http import Http404
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model

from .models import Profile
from .forms import ProfileForm, UserForm


User = get_user_model()


def profile_detail(request, username):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        raise Http404
    obj = qs.first()
    is_following = False
    if request.user.is_authenticated:
        is_following = request.user in obj.followers.all()
    context = {
        'username': username,
        'profile': obj,
        'is_following': is_following
    }
    return render(request, 'profiles/detail.html', context)


def profile_update(request):
    user = request.user
    profile = user.profile
    if not request.user.is_authenticated:
        return redirect('/login?next=/profile/update')
    user_data = {
        'username': user.username
    }
    profile_data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': profile.bio,
        'location': profile.location
    }
    user_form = UserForm(request.POST or None, instance=user, initial=user_data)
    profile_form = ProfileForm(request.POST or None, instance=profile, initial=profile_data)
    if user_form.is_valid():
        password = user_form.cleaned_data.get('password1')
        if password:
            user_obj.set_password(password)
        user_obj = user_form.save(commit=False)
        user_obj.save()
    if profile_form.is_valid():
        profile_obj = profile_form.save(commit=False)
        first_name = profile_form.cleaned_data.get('first_name')
        user.first_name = first_name
        last_name = profile_form.cleaned_data.get('last_name')
        user.last_name = last_name
        profile_obj.save()
        user.save()
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'btn_label': 'Save',
        'title': 'Update profile'
    }
    return render(request, 'profiles/form.html', context)
