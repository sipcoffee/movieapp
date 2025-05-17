# movies/tasks.py
import time
from celery import shared_task # type: ignore
from .serializers import MovieSerializer

from .models import Movies
import time
import redis # type: ignore


@shared_task(bind=True)
def create_movie_task(self, movie_data):
    print('mov data ', movie_data)
    # Simulate a slow process (e.g. uploading, processing)
    for i in range(5):
        time.sleep(5)  # sleep 2 seconds 5 times => total 10 seconds
        # Optional: update state (for progress tracking)
        self.update_state(state='PROGRESS', meta={'current': i + 1, 'total': 5})

    serializer = MovieSerializer(data=movie_data)
    if serializer.is_valid():
        serializer.save()
        return {"status": "success", "data": serializer.data}
    else:
        return {"status": "error", "errors": serializer.errors}



r = redis.Redis(host='redis', port=6379, db=0)

@shared_task(bind=True)
def process_movie_upload(self, movie_data):
    task_id = self.request.id

    total_steps = 5
    for i in range(1, total_steps + 1):
        time.sleep(2)  # simulate slow processing
        r.set(f'task_progress:{task_id}', int((i / total_steps) * 100))

    # Save to DB after "processing"
    serializer = MovieSerializer(data=movie_data)
    if serializer.is_valid():
        serializer.save()
        r.set(f'task_progress:{task_id}', 100)
        return {'status': 'completed'}
    else:
        r.set(f'task_progress:{task_id}', -1)  # indicate failure
        return {'status': 'error', 'errors': serializer.errors}