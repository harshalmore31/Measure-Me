# Generated by Django 5.1.1 on 2024-10-16 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to='student_photos/'),
        ),
    ]