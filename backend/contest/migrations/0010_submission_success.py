# Generated by Django 5.0 on 2023-12-26 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contest', '0009_alter_contest_organizer'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='success',
            field=models.BooleanField(default=True),
        ),
    ]