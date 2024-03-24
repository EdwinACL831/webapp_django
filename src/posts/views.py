from django.shortcuts import render
from .models import Post

# Create your views here.

def post_list_and_create(request):
    # we define a query set
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs}) 