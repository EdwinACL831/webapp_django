from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    like_unlike_posts,
    hello_word_view,
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('data/<int:numb_of_posts>/', load_post_data_view, name='data'),
    path('like-unlike/', like_unlike_posts, name='like-unlike'),
    path('hello-world/', hello_word_view, name='hello-world'),
]
