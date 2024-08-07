# Generated by Django 5.0.6 on 2024-05-28 09:35

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, unique=True, validators=[django.core.validators.RegexValidator('^[a-zA-Z0-9_]{3,}$', message='Username must be alphanumeric and contain at least 3 characters')]),
        ),
    ]