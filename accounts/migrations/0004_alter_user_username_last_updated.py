# Generated by Django 4.1.3 on 2023-09-11 17:07

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_user_username_last_updated_alter_user_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username_last_updated',
            field=models.DateTimeField(default=datetime.datetime(2022, 9, 11, 17, 7, 26, 754340, tzinfo=datetime.timezone.utc)),
        ),
    ]