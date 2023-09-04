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
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None) 
        super().__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({'class': 'field-margin'})

    username = forms.CharField(
        label="Username",
        strip=False,
        required=False,
    )
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput,
        required=False
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
    current_password = forms.CharField(
        label="Current Password",
        strip=False,
        widget=forms.PasswordInput,
        required=False,
    )
    class Meta:
        model = User
        fields = ['username', 'email']

    def clean(self):
        cleaned_data = super().clean()
        password2 = cleaned_data.get('password2')
        current_password = cleaned_data.get('current_password')
        if current_password and not any(field in self.changed_data for field in ['username', 'email', 'password1', 'password2']):
            self.add_error('current_password', "Form did not proceed as no changes were made.")
        if password2 == current_password:
            self.add_error('password2', "New password cannot be the same as the current password.")

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if self.has_changed() and 'username' in self.changed_data:
            if User.objects.filter(username=username).exists():
                raise forms.ValidationError("This username is already taken.")
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if self.has_changed() and 'email' in self.changed_data:
            if User.objects.filter(email=email).exists():
                raise forms.ValidationError("This email is already in use.")
        return email
    
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and not password2:
            raise forms.ValidationError("Both fields are required to update the password")
        if password2 and not password1:
            raise forms.ValidationError("Both fields are required to update the password")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        if password1 and password2:
            try:
                validate_password(password2, self.user)
            except ValidationError as e:
                raise forms.ValidationError(e)
        return password2
    
    def clean_current_password(self):
        current_password = self.cleaned_data.get('current_password')
        if not current_password:
            raise ValidationError("Current password is required for any changes.")
        if not self.user.check_password(current_password):
            raise ValidationError("Current password is incorrect.")
        return current_password

    def save(self, commit=True):
        if self.errors:
            raise ValidationError("The form has validation errors and cannot be saved.")
        user = super().save(commit=False)
        password = self.cleaned_data.get('password2')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user
    
class ProfileSearchForm(forms.Form):
    username = forms.CharField(max_length=69, required=False, label='Search by Username')
