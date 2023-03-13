from django.contrib import admin

from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'user', 'id']
    search_fields = ['user__username', 'user__email']
    class Meta:
        model = Profile

admin.site.register(Profile)
