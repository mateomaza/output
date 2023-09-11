from django.urls import reverse
class PasswordSettingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        user = request.user
        if user.is_authenticated and not user.has_usable_password() and not request.path.startswith(reverse('set_password')):
            request.session['password_setting_required'] = True
        else:
            request.session.pop('password_setting_required', None) 
        response = self.get_response(request)
        return response