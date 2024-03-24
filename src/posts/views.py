from django.shortcuts import render
from django.http import JsonResponse
from .models import Post

# Create your views here.

def post_list_and_create(request):
    # we define a query set
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs})

def load_post_data_view(request):
    qs = Post.objects.all()
    data = []
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'content': obj.content,
            'author': obj.author.user.username,
        }
        data.append(item)
    return JsonResponse({'data': data})

def hello_word_view(request):
    return JsonResponse({'text': 'Hello World'})