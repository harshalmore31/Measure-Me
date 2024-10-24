from django.contrib import admin
from .models import Student, TrainingImage

# Register your models here.

class TrainingImageInline(admin.TabularInline):
    model = TrainingImage
    extra = 1

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'roll_number', 'standard', 'division')
    search_fields = ('name', 'roll_number')
    list_filter = ('standard', 'division')
    inlines = [TrainingImageInline]

@admin.register(TrainingImage)
class TrainingImageAdmin(admin.ModelAdmin):
    list_display = ('student', 'image')
    list_filter = ('student',)
