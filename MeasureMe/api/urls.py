from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, MeasurementViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'measurements', MeasurementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
