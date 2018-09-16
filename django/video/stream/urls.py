from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.index, name='list_shows'),
    path('list_episodes/<str:show_name>', views.list_episodes, name='list_episodes'),
    path('episode/<str:show_name>/<str:episode>', views.episode, name='episode')
]