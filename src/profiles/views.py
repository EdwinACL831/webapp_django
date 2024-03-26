from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def my_profile_view(request):
    obj = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=obj)
    # this is the "new" way to check for the AJAX request method
    # instead of request.is_ajax() -> https://docs.djangoproject.com/en/4.0/releases/3.1/#id2
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio': instance.bio,
                'avatar': instance.avatar.url,
                'user': instance.user.username
            })

    context = {
        'obj': obj,
        'form': form,
    }

    return render(request, 'profiles/main.html', context)
