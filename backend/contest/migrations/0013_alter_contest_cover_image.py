# Generated by Django 5.0 on 2023-12-31 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contest', '0012_contest_cover_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contest',
            name='cover_image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
