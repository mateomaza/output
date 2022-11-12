from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Post

User = get_user_model()


class UserTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='pepito', password='123')
        Post.objects.create(content='first', user=self.user)
        Post.objects.create(content='second', user=self.user)
        Post.objects.create(content='third', user=self.user)

    def test_post_created(self):
        post = Post.objects.create(content='yo', user=self.user)
        self.assertEqual(post.id, 4)
        self.assertEqual(post.user, self.user)
        
    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password=self.user.password)
        return client
        

    def test_post_list(self):
        client = self.get_client()
        response = client.get('/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)
        
    def test_action_like(self):
        client = self.get_client()
        response = client.post('/posts/action/', {'id': 1, 'action': 'like'})
        self.assertEqual(response.status_code, 200)
        
    
        
