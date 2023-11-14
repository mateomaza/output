from django.http import JsonResponse
from rest_framework.decorators import api_view
from .pusher import pusher
from .models import Message, Chat
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
def get_user_chats(request, user_id):
    chats = Chat.objects.filter(participants__id=user_id).annotate(
        last_message_time=models.Max('messages__timestamp')
    ).order_by('-last_message_time')
    chats_data = [{'id': chat.id, 'participants': [participant.username for participant in chat.participants.all()], 'last_message_time': chat.last_message_time} for chat in chats]
    
    return JsonResponse({'chats': chats_data})

@api_view(['POST, GET'])
def send_message(request):
    if request.method == 'POST':
        sender = request.POST.get('sender')
        receiver = request.POST.get('receiver')
        content = request.POST.get('content')

        message = Message(sender=sender, receiver=receiver, content=content)
        message.save()

        pusher.trigger('chat_channel', 'new_message', {
            'sender': sender,
            'receiver': receiver,
            'content': content,
            'timestamp': message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })

        return JsonResponse({'status': 'success', 'message': 'Message sent'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

def is_mutual_follow(user1_username, user2_username):
    user1 = User.objects.get(username=user1_username)
    user2 = User.objects.get(username=user2_username)
    return user1 in user2.following.all() and user2 in user1.following.all()

@api_view(['GET'])
def check_mutual_follow(request, username):
    if not request.user.is_authenticated:
            mateo = User.objects.first()
            request.user = mateo
    current_user = request.user.username
    mutual_follow = is_mutual_follow(current_user, username)
    return JsonResponse({'mutual_follow': mutual_follow}, status=200)

@api_view(['POST, GET'])
def create_chat(request, username):
    if not request.user.is_authenticated:
            mateo = User.objects.first()
            request.user = mateo
    try:
        target_user = User.objects.get(username=username)
        if request.user.follows(target_user) and target_user.follows(request.user):
            chat, created = Chat.objects.get_or_create(participants=[request.user, target_user])
            return JsonResponse({'status': 'success', 'chat_id': chat.id}, status=201 if created else 200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Users must follow each other to start a chat'}, status=403)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
