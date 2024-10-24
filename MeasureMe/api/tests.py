from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Student, TrainingImage

class StudentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_data = {
            'name': 'Test Student',
            'roll_number': 'TS001',
            'standard': '10',
            'division': 'A',
            'height': 170.5,
            'weight': 65.0
        }
        self.student = Student.objects.create(**self.student_data)

    def test_create_student(self):
        response = self.client.post(reverse('student-list'), self.student_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)

    def test_get_students(self):
        response = self.client.get(reverse('student-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_student_detail(self):
        response = self.client.get(reverse('student-detail', kwargs={'pk': self.student.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.student_data['name'])

    def test_update_student(self):
        updated_data = {'name': 'Updated Test Student'}
        response = self.client.patch(reverse('student-detail', kwargs={'pk': self.student.id}), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], updated_data['name'])

    def test_delete_student(self):
        response = self.client.delete(reverse('student-detail', kwargs={'pk': self.student.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)