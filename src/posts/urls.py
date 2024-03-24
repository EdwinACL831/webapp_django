from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    hello_word_view,
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('data/', load_post_data_view, name='data'),
    path('hello-world/', hello_word_view, name='hello-world'),
]
