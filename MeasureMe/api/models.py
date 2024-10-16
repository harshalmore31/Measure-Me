from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=255)
    roll_number = models.CharField(max_length=50, unique=True)
    standard = models.CharField(max_length=50)
    division = models.CharField(max_length=50)
    profile_photo = models.ImageField(upload_to='student_photos/', null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.roll_number}"

# Optional: Model for training images
class TrainingImage(models.Model):
    student = models.ForeignKey(Student, related_name='training_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='training_images/')

    def __str__(self):
        return f"Training image for {self.student.name}"
