from .models import Movies
from rest_framework.decorators import api_view, permission_classes, parser_classes # type: ignore
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework import status # type: ignore
from rest_framework.response import Response # type: ignore
from movies.serializers import MovieSerializer, MovieTitleSerializer
from django.shortcuts import get_object_or_404
from celery.result import AsyncResult # type: ignore
from movies.tasks import process_movie_upload

@api_view(['GET', 'POST'])
def movie_list_create(request):
    if request.method == 'GET':
        movies = Movies.objects.all().order_by('-movie_id')
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Authentication required for POST requests
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Uploaded success."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
def movie_detail(request, pk):
    print('pk is ', pk)
    movie = get_object_or_404(Movies, pk=pk)

    if request.method == 'GET':
        serializer = MovieSerializer(movie)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not request.data['title']:
            return Response({'message':'Title is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.data['description']:
            return Response({'message':'Title is required'}, status=status.HTTP_400_BAD_REQUEST)

        movie = Movies.objects.get(movie_id=pk)
        movie.title = request.data['title']
        movie.description = request.data['description']
        movie.save()
        return Response({"message":"Update Successfully."}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        movie.delete()
        return Response({'message': 'Successfully deleted.'},status=status.HTTP_200_OK)
    
@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def replace_movie_video(request, pk):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    movie = get_object_or_404(Movies, pk=pk)

    video = request.FILES.get('video_file')
    if not video:
        return Response({'message': 'Video file is required'}, status=status.HTTP_400_BAD_REQUEST)

    movie.video_file = video
    movie.save()
    return Response({'message': 'Video updated successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def task_status(request, task_id):
    task = AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'progress': 0,
            'details': 'Task waiting in queue...'
        }
    elif task.state == 'PROGRESS':
        response = {
            'state': task.state,
            'progress': int((task.info.get('current', 0) / task.info.get('total', 1)) * 100),
            'details': f"Processing step {task.info.get('current')} of {task.info.get('total')}"
        }
    elif task.state == 'SUCCESS':
        response = {
            'state': task.state,
            'progress': 100,
            'result': task.result,
            'details': 'Task completed!'
        }
    else:
        # Failure or unknown state
        response = {
            'state': task.state,
            'details': str(task.info)
        }
    return Response(response)