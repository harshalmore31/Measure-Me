from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import logging

from .models import Student, TrainingImage, Measurement
from .serializers import StudentSerializer, TrainingImageSerializer, MeasurementSerializer

logger = logging.getLogger(__name__)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        logger.info(f"Received data: {request.data}")
        logger.info(f"Files: {request.FILES}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()

        if 'profile_photo' in request.FILES:
            student.profile_photo = request.FILES['profile_photo']
            student.save()

        if 'training_images' in request.FILES:
            for image in request.FILES.getlist('training_images'):
                TrainingImage.objects.create(student=student, image=image)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if 'profile_photo' in request.FILES:
            instance.profile_photo = request.FILES['profile_photo']
            instance.save()

        if 'training_images' in request.FILES:
            for image in request.FILES.getlist('training_images'):
                TrainingImage.objects.create(student=instance, image=image)

        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        logger.info(f"Returning students: {serializer.data}")
        return Response(serializer.data)

class TrainingImageViewSet(viewsets.ModelViewSet):
    queryset = TrainingImage.objects.all()
    serializer_class = TrainingImageSerializer

class MeasurementViewSet(viewsets.ModelViewSet):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
