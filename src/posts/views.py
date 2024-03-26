from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Post, Photo
from .forms import PostForm
from profiles.models import Profile

# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # we define a query set
    # qs = Post.objects.all()
    
    # this is the "new" way to check for the AJAX request method
    # instead of request.is_ajax() -> https://docs.djangoproject.com/en/4.0/releases/3.1/#id2
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title': instance.title,
                'content': instance.content,
                'author': instance.author.user.username,
                'id': instance.id,
            })

    context = {
        'form': form,
    }

    return render(request, 'posts/main.html', context)


def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form,
    }

    return render(request, 'posts/detail.html', context)


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


def post_detail_data_view(request, pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id': obj.id,
        'title': obj.title,
        'content': obj.content,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }

    return JsonResponse({'data': data})

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
        
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    # this is the "new" way to check for the AJAX request method
    # instead of request.is_ajax() -> https://docs.djangoproject.com/en/4.0/releases/3.1/#id2
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        new_title = request.POST.get('title')
        new_content = request.POST.get('content')
        obj.title = new_title
        obj.content = new_content
        obj.save()

    return JsonResponse({
        'title': new_title,
        'content': new_content,
    })

def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    # this is the "new" way to check for the AJAX request method
    # instead of request.is_ajax() -> https://docs.djangoproject.com/en/4.0/releases/3.1/#id2
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        obj.delete()
    return JsonResponse({})

def image_upload_view(request):
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image=img, post=post)

    return HttpResponse()