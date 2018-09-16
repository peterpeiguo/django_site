from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse

from os import listdir
from os.path import isfile, isdir, join

from urllib.parse import unquote

def get_episodes(show_name):
    video_folder = 'c:/src/data/videos'
    episodes = [f for f in listdir(join(video_folder, show_name)) if isfile(join(video_folder, show_name, f))]
    try:
        episodes = sorted(episodes, key = lambda a: int(a[:a.index(".")]))
    except Exception as e:
        pass
    return episodes

# Create your views here.
def index(request):
    video_folder = 'c:/src/data/videos'
    folders = [f for f in listdir(video_folder) if isdir(join(video_folder, f))]
    template = loader.get_template('list_shows.html')
    return HttpResponse(template.render({'folders': folders}, request))

def list_episodes(request, show_name):
    show_name = unquote(show_name)
    episodes = get_episodes(show_name)
    template = loader.get_template('episodes.html')
    return HttpResponse(template.render({'show_name': show_name, 'episodes': episodes}, request))    

def episode(request, show_name, episode):
    show_name = unquote(show_name)
    episodes = get_episodes(show_name)
    context = {'show_name': show_name, 'episode': episode}
    index = episodes.index(episode)
    if index > 0:
        context["previous_episode"] = episodes[index - 1]
    if index < len(episodes) - 1:
        context["next_episode"] = episodes[index + 1]

    template = loader.get_template('episode.html')
    return HttpResponse(template.render(context, request))     