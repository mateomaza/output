from django.contrib.auth.forms import UserCreationForm, SetPasswordForm
from django.contrib.auth.password_validation import validate_password
from .models import User
from django import forms

class CustomUserCreationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({'autocomplete': 'off'})
    email = forms.EmailField(required=False, help_text=("(optional)"))
    class Meta:
        model = User
        fields = ('username', 'email')
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email

class PasswordSetForm(SetPasswordForm):
    pass