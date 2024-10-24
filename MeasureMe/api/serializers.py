from rest_framework import serializers
from .models import Student, TrainingImage, Measurement
from django.conf import settings

class TrainingImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = TrainingImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

class StudentSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()
    training_images = TrainingImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll_number', 'standard', 'division', 'profile_photo', 'height', 'weight', 'training_images']

    def get_profile_photo(self, obj):
        if obj.profile_photo:
            return self.context['request'].build_absolute_uri(obj.profile_photo.url)
        return None

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = ['id', 'student', 'height', 'weight', 'timestamp']
