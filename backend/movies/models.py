from django.db import models

class Movies(models.Model):
    movie_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    date_added = models.DateTimeField(auto_now=True)
    video_file = models.FileField(upload_to='videos/')

    def __str__(self):
        return self.title