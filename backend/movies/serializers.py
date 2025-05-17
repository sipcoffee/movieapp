from rest_framework import serializers
from .models import Movies

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movies
        fields = '__all__'

class MovieTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movies
        fields = ['title', 'description']