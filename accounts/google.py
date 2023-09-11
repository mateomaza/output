from django.shortcuts import redirect
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.contrib.auth.validators import UnicodeUsernameValidator
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import output.secrets
import requests
import random
import string

User = get_user_model()
CLIENT_ID = '964996014175-2b6i3nd3lgmhfr96v61vkl09kua804m0.apps.googleusercontent.com'
CLIENT_SECRET = output.secrets.CLIENT_SECRET

def google_auth(request):
    redirect_uri = 'http://localhost:8000/auth/google/callback'
    auth_url = get_google_auth_url(redirect_uri)
    return redirect(auth_url)

def google_callback(request):
    code = request.GET.get('code')
    redirect_uri = 'http://localhost:8000/auth/google/callback'
    tokens = exchange_code_for_tokens(code, redirect_uri)
    user = authenticate_with_google(tokens)
    if user is not None:
        login(request, user)
        return redirect('/') 
    else:
        login(request, user)
        return redirect('/set_password')

def get_google_auth_url(redirect_uri):
    client_id = CLIENT_ID
    scope = 'openid email profile'
    auth_url = f'https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&response_type=code&prompt=select_account'
    return auth_url

def exchange_code_for_tokens(code, redirect_uri):
    client_id = CLIENT_ID
    client_secret = CLIENT_SECRET
    token_endpoint = 'https://oauth2.googleapis.com/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    response = requests.post(token_endpoint, headers=headers, data=data)
    if response.status_code == 200:
        tokens = response.json()
        return tokens
    else:
        raise Exception('Failed to exchange code for tokens')

def authenticate_with_google(tokens):
    access_token = tokens['access_token']
    id_token_value = tokens['id_token']
    id_info = id_token.verify_oauth2_token(id_token_value, google_requests.Request(), CLIENT_ID)
    email = id_info['email']
    user = User.objects.get(email=email)
    if user is not None:
        user.google_access_token = access_token
        user.save()
        return user
    random_string = ''.join(random.choices(string.digits, k=8))
    validator = UnicodeUsernameValidator()
    while True:
        username = email.split('@')[0] + random_string
        try:
            validator(username)
            break
        except Exception: 
            pass
    user = User.objects.create_user(username=username, email=email, google_access_token=access_token)
    user.save()
