from django import forms
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class ProfileForm(forms.ModelForm):
    location = forms.CharField(required=False)
    bio = forms.CharField(required=False)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']