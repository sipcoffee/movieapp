from django.urls import path
from . import views

urlpatterns = [
    path('movies', views.movie_list_create),
    path('movies/<int:pk>', views.movie_detail),
    path('movies/<int:pk>/update-video', views.replace_movie_video),
    path('task-status/<int:taskId>', views.task_status),
]