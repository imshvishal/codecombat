# Generated by Django 5.0 on 2023-12-24 07:19

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allow_auto_complete', models.BooleanField(default=True)),
                ('start_time', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('enrolled_users', models.ManyToManyField(related_name='enrolled_contest', to=settings.AUTH_USER_MODEL)),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contest', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500)),
                ('difficulty', models.CharField(choices=[('E', 'Easy'), ('M', 'Medium'), ('H', 'Hard')], max_length=20)),
                ('description', models.CharField(max_length=2000)),
                ('duration', models.DurationField(default=datetime.timedelta(seconds=600))),
                ('contest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contest.contest')),
            ],
        ),
        migrations.CreateModel(
            name='TestCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('output', models.CharField(max_length=500)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contest.question')),
            ],
        ),
    ]
