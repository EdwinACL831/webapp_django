from django.shortcuts import render
from django.http import JsonResponse
from .models import Post

# Create your views here.

def post_list_and_create(request):
    # we define a query set
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs})

def hello_word_view(request):
    return JsonResponse({'text': 'Hello World'})