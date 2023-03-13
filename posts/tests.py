from django.test import TestCase, Client
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Post

User = get_user_model()

class PostTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='mateo', password='123')
        self.user2 = User.objects.create_user(username='abc', password='123')
        Post.objects.create(content='first', user=self.user)
        Post.objects.create(content='second', user=self.user)
        Post.objects.create(content='third', user=self.user2)
        self.firstPost = Post.objects.get(id=1)
        self.currentCount = Post.objects.all().count()

    def test_post_created(self):
        post = Post.objects.create(content='create', user=self.user)
        self.assertEqual(post.id, 4)
        self.assertEqual(post.user, self.user)
        
    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password='123')
        return client

    def test_post_list(self):
        client = self.get_client()
        response = client.get('/api/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)
        
    def test_post_detail(self):
        client = self.get_client()
        response = client.get('/api/posts/1/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        _id = data.get('id')
        self.assertEqual(_id, 1)
        
    def test_related_name(self):
        user = self.user
        self.assertEqual(user.posts.count(), 2)
        
    def test_action_like_plus(self):
        client = self.get_client()
        response = client.post('/api/posts/action/', {'id': 1, 'action': 'like'})
        self.assertEqual(response.status_code, 200)
        user = self.user
        self.assertEqual(user.post_likes.count(), 1)
        like_instances = user.postlike_set.count()
        self.assertEqual(user.post_likes.count(), like_instances)
        
    def test_action_unlike(self):
        client = self.get_client()
        response = client.post('/api/posts/action/', {'id': 1, 'action': 'like'})
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/posts/action/', {'id': 1, 'action': 'unlike'})
        self.assertEqual(response.status_code, 200)
        likes_count = response.json().get('likes')
        self.assertEqual(likes_count, 0)
        
    def test_action_repost(self):
        client = self.get_client()
        response = client.post('/api/posts/action/', {'id': 1, 'action': 'repost', 'content': self.firstPost.content})
        self.assertEqual(response.status_code, 201)
        data = response.json()
        newPost_id = data.get('id')
        self.assertNotEqual(newPost_id, 1)
        self.assertEqual(newPost_id, self.currentCount + 1)
        
    def test_action_create(self):
        client = self.get_client()
        request_data = {'content': 'New post'}
        response = client.post('/api/posts/create/', request_data)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        newPost_id = response_data.get('id')
        self.assertEqual(newPost_id, self.currentCount + 1)
        
    def test_action_delete(self):
        client = self.get_client()
        response = client.delete('/api/posts/2/delete/')
        self.assertEqual(response.status_code, 200)
        client = self.get_client()
        response = client.get('/api/posts/2/')
        self.assertEqual(response.status_code, 404)
        response_incorrectOwner = client.delete('/api/posts/3/delete/')
        self.assertEqual(response_incorrectOwner.status_code, 403)
        
    def test_no_user(self):
        c = Client()
        create_response = c.post('/api/posts/create/', {'content': 'test'})
        self.assertEqual(create_response.status_code, 401)
        action_response = c.post('/api/posts/action/', {'id': 1,'action': 'like'})
        self.assertEqual(action_response.status_code, 401)
        delete_response = c.post('/api/posts/2/delete/')
        self.assertEqual(delete_response.status_code, 401)

        
        
        

        
        
        
            
        
    
        
