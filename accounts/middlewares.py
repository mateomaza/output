from django.shortcuts import redirect
from django.urls import reverse

class PasswordSettingMiddleware:
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user
        if user.is_authenticated and not user.has_usable_password():
            if not request.path.startswith(reverse('set_password')):
                return redirect(reverse('set_password'))  
        response = self.get_response(request)
        return response