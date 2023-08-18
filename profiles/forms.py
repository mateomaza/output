from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserChangeForm, ReadOnlyPasswordHashField
from .models import Profile

User = get_user_model()

class ProfileForm(forms.ModelForm):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    class Meta:
        model = Profile
        fields = ['bio', 'location']

class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label='', help_text='')
    class Meta:
        model = User
        fields = '__all__'

class UserForm(UserChangeForm):
    username = forms.CharField(
        label="Username",
        strip=False,
        required=False,
    )
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput,
        required=False,
    )
    password2 = forms.CharField(
        label="Confirm Password",
        strip=False,
        widget=forms.PasswordInput,
        required=False,
    )
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise forms.ValidationError("Username cannot be empty.")
        if self.has_changed() and 'username' in self.changed_data:
            if User.objects.filter(username=username).exists():
                raise forms.ValidationError("This username is already taken.")
        return username
    
    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password2 and not password1:
            raise forms.ValidationError("Password needs to be set first.")
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and not password2:
            raise forms.ValidationError("Password needs to be confirmed.")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        return password2

    def save(self, commit=True):
        if self.errors:
            raise ValidationError(
                "The form has validation errors and cannot be saved.")
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user
