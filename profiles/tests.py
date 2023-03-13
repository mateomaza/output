from django.test import TestCase
from rest_framework.test import APIClient
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
        
    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password='123')
        return client
        
    def test_follow_endpoint(self):
        client = self.get_client()
        follow_response = client.post(f'/api/profiles/{self.user2}/follow', {'action': 'follow'})
        self.assertEqual(follow_response.status_code, 200)
        data = follow_response.json()
        count = data.get('followers_count')
        self.assertEqual(count, 1)
        
    def test_unfollow_endpoint(self):
        first = self.user2
        second = self.user
        first.profile.followers.add(second)
        client = self.get_client()
        unfollow_response = client.post(f'/api/profiles/{self.user2}/follow', {'action': 'unfollow'})
        self.assertEqual(unfollow_response.status_code, 200)
        data = unfollow_response.json()
        count = data.get('followers_count')
        self.assertEqual(count, 0)
        
        
        
        