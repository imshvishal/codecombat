# Generated by Django 5.0 on 2023-12-24 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contest', '0006_alter_contest_enrolled_users'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contest',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
