from django.urls import path
from .views import (
    post_list_and_create,
    hello_word_view,
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('hello-world/', hello_word_view, name='hello-world'),
]
