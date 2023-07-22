from django import forms
from django.contrib.auth import get_user_model
from django.utils.safestring import SafeString
from django.contrib.auth.forms import UserChangeForm, ReadOnlyPasswordHashField, ReadOnlyPasswordHashWidget
from .models import Profile

User = get_user_model()


class ProfileForm(forms.ModelForm):
    
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)

    class Meta:
        model = Profile
        fields = ['bio', 'location']


class CustomReadOnlyPasswordHashWidget(ReadOnlyPasswordHashWidget):
    def render(self, name, value, attrs=None, renderer=None):
        rendered = super().render(name, value, attrs, renderer)
        if value and 'type="password"' in rendered:
            # Password is set and the widget is rendered as a password field.
            # Clear the displayed password value by returning a new widget without the value.
            return SafeString(rendered.replace('value="', 'value=""'))
        return rendered
    

class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label='', help_text='')

    class Meta:
        model = User
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(UserChangeForm, self).__init__(*args, **kwargs)
        f = self.fields.get('user_permissions', None)
        if f is not None:
            f.queryset = f.queryset.select_related('content_type')
        self.fields['password'].widget.attrs['value'] = ''
        

    def clean_password(self):
        return self.initial["password"]
    
class UserForm(UserChangeForm):

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
            return username

        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("This username is already taken.")

        return username

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")

        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user

    
    
