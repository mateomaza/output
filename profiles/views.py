from django.http import Http404, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

from .models import Profile
from .forms import ProfileForm, UserForm, ProfileSearchForm


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

def profile_search(request):
    query = request.GET.get('username', '')
    print(query)
    results = User.objects.filter(username__icontains=query)
    user_data = [{'username': user.username} for user in results]
    if not user_data:
        return JsonResponse([], safe=False)
    return JsonResponse(user_data, safe=False)

@login_required
def profile_update(request):
    user = request.user
    profile = user.profile
    if not request.user.is_authenticated:
        return redirect('/login?next=/profile/update')
    profile_data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': profile.bio,
        'location': profile.location
    }
    user_data = {
        'username': user.username
    }
    profile_form = ProfileForm(request.POST or None, instance=profile, initial=profile_data)
    user_form = UserForm(request.POST or None, instance=user, initial=user_data, user=request.user)
    if request.method == 'POST':
        if profile_form.is_valid():
            profile_obj = profile_form.save(commit=False)
            first_name = profile_form.cleaned_data.get('first_name')
            user.first_name = first_name
            last_name = profile_form.cleaned_data.get('last_name')
            user.last_name = last_name
            profile_obj.save()
            user.save()
        if user_form.is_valid():
            user_obj = user_form.save(commit=False)
            user_obj.save()
            password1 = user_form.cleaned_data.get('password1')
            password2 = user_form.cleaned_data.get('password2')
            if password1 and password2:
                response_data = {
                    "message": "Profile updated successfully",
                    "password_change": True
                }
            else:
                response_data = {
                    "message": "Profile updated successfully",
                    "password_change": False
                }
            return JsonResponse(response_data, status=200)
        if not user_form.is_valid():
            errors = user_form.errors
            return JsonResponse(errors, status=400)
    context = {
        'profile_form': profile_form,
        'user_form': user_form,
        'btn_label': 'Save',
        'title': 'Update profile'
    }
    return render(request, 'profiles/form.html', context)
