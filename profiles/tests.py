from django.test import TestCase
from .models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='mateo', password='123')
        self.user2 = User.objects.create_user(username='abc', password='123')
        
    def test_profile_created_viasignal(self):
        qs = Profile.objects.all()
        self.assertEqual(qs.count(), 2)
        
    def test_following(self):
        first = self.user
        second = self.user2
        first.profile.followers.add(second)
        qs = second.following.all().filter(user=first)
        self.assertTrue(qs.exists())
        qs = first.following.all()
        self.assertFalse(qs.exists())
        
        