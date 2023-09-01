from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from .forms import CustomUserCreationForm, PasswordSetForm

def login_view(request):
    form = AuthenticationForm(request, data=request.POST or None)
    if form.is_valid():
        user_ = form.get_user()
        login(request, user_)
        return redirect('/')
    context = {
        'form': form,
        'btn_label': "Login",
        'title': 'Login',
        'google': True
    }
    password_changed = request.GET.get('password_changed')
    if password_changed:
        messages.info(request, "You've successfully updated your password. Please log in again.")
    return render(request, 'accounts/auth.html', context)

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('/login')
    context = {
        'form': None,
        'btn_label': 'Yes',
        'title': 'Logout?',
        'description': 'Are you sure you want to continue?'
    }
    return render(request, 'accounts/auth.html', context)

def register_view(request):
    form = CustomUserCreationForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=True)
        user.set_password(form.cleaned_data.get('password1'))
        return redirect('/')
    context = {
        'form': form,
        'btn_label': 'Register',
        'title': 'Register'
    }
    return render(request, 'accounts/auth.html', context)

def decision_view(request):
    return render(request, 'accounts/decision.html')

@login_required
def set_password(request):
    if request.method == 'POST':
        form = PasswordSetForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            return redirect('/') 
    else:
        form = PasswordSetForm(request.user)
    return render(request, 'accounts/set_password.html', {'form': form})
