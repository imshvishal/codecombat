# Generated by Django 5.0 on 2023-12-24 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('DEV', 'Developer'), ('ORG', 'Organization')], default='DEV', max_length=20),
        ),
    ]
