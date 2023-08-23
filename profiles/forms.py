from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserChangeForm, ReadOnlyPasswordHashField
from django.contrib.auth.password_validation import validate_password
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
    current_password = forms.CharField(
        label="Current Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'id': 'current-password-field'}),
        required=False,
    )
    password1 = forms.CharField(
        label="New Password",
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
        if self.has_changed() and 'username' in self.changed_data:
            if User.objects.filter(username=username).exists():
                raise forms.ValidationError("This username is already taken.")
        return username
    
    def clean_current_password(self):
        current_password = self.cleaned_data.get("current_password")
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if self.has_changed() and 'username' in self.changed_data and not current_password:
            raise forms.ValidationError("Current password is missing.")
        if password1 and password2 and not current_password:
            raise forms.ValidationError("Current password is missing.")
        if self.has_changed() and 'username' in self.changed_data and not self.user.check_password(current_password):
            raise forms.ValidationError("Current password is incorrect.")
        if password1 and password2 and not self.user.check_password(current_password):
            raise forms.ValidationError("Current password is incorrect.")
        return current_password

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password2 and not password1:
            raise forms.ValidationError("If you want to change your password, you need to fill both fields.")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        try:
            validate_password(password2, self.user)
        except ValidationError as e:
            raise forms.ValidationError(e)
        return password2

    def save(self, commit=True):
        if self.errors:
            raise ValidationError("The form has validation errors and cannot be saved.")
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user
