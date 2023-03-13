from django.http import Http404
from django.shortcuts import render, redirect

from .models import Profile
from .forms import ProfileForm


def profile_detail(request, username):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        raise Http404
    profile_obj = qs.first()
    context = {
        'username': username,
        'profile': profile_obj
    }
    return render(request, 'profiles/detail.html', context)


def profile_update(request):
    user = request.user
    profile = user.profile
    if not request.user.is_authenticated:
        return redirect('/login?next=/profile/update')
    data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'bio': profile.bio,
        'location': profile.location
    }
    form = ProfileForm(request.POST or None, instance=profile, initial=data)
    if form.is_valid():
        profile_obj = form.save(commit=False)
        first_name = form.cleaned_data.get('first_name')
        user.first_name = first_name
        last_name = form.cleaned_data.get('last_name')
        user.last_name = last_name
        email = form.cleaned_data.get('email')
        user.email = email
        profile_obj.save()
        user.save()
    context = {
        'form': form,
        'btn_label': 'Save',
        'title': 'Update profile'
    }
    return render(request, 'profiles/form.html', context)
