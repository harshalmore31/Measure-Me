from rest_framework import serializers
from .models import Student, TrainingImage

class TrainingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingImage
        fields = ['id', 'image']

class StudentSerializer(serializers.ModelSerializer):
    training_images = TrainingImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll_number', 'standard', 'division', 'profile_photo', 'height', 'weight', 'training_images']
