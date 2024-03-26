from django.shortcuts import render
from django.http import JsonResponse
from .models import Post
from .forms import PostForm
from profiles.models import Profile

# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # we define a query set
    # qs = Post.objects.all()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()

    context = {
        'form': form,
    }

    return render(request, 'posts/main.html', context)

def load_post_data_view(request, numb_of_posts):
    visible = 3
    upper = numb_of_posts
    lower = upper - visible
    qs = Post.objects.all()
    size = qs.count()

    data = []
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'content': obj.content,
            'liked': True if request.user in obj.liked.all() else False,
            'count': obj.like_count,
            'author': obj.author.user.username,
        }
        data.append(item)
    return JsonResponse({'data': data[lower:upper], 'size': size})

def like_unlike_posts(request):
    # this is the "new" way to check for the AJAX request method
    # instead of request.is_ajax() -> https://docs.djangoproject.com/en/4.0/releases/3.1/#id2
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        
        return JsonResponse({'liked': liked, 'count': obj.like_count})
    else:
        print('no ajax request')

def hello_word_view(request):
    return JsonResponse({'text': 'Hello World'})