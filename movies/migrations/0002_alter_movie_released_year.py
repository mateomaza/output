# Generated by Django 4.1.3 on 2024-12-02 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("movies", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="movie",
            name="released_year",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]