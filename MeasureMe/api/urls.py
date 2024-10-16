from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, TrainingImageViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'training-images', TrainingImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
