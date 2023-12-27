from datetime import timedelta

from django.db import models

from accounts.models import User


# Create your models here.
class Contest(models.Model):
    organizer = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name="created_contests"
    )
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    allow_auto_complete = models.BooleanField(default=True)
    start_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    enrolled_users = models.ManyToManyField(
        to=User, related_name="enrolled_contests", blank=True
    )  # Get User from email CSV and set enrolled_users
    is_private = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.organizer.username})"


class Question(models.Model):
    contest = models.ForeignKey(
        to=Contest, on_delete=models.CASCADE, related_name="questions"
    )
    title = models.CharField(max_length=500)
    difficulty = models.CharField(
        max_length=20, choices={"E": "Easy", "M": "Medium", "H": "Hard"}
    )
    description = models.TextField(blank=True)
    duration = models.DurationField(default=timedelta(minutes=10))

    def __str__(self) -> str:
        return f"{self.title} ({self.contest})"


class TestCase(models.Model):
    question = models.ForeignKey(
        to=Question, on_delete=models.CASCADE, related_name="testcases"
    )
    output = models.CharField(max_length=500)

    def __str__(self) -> str:
        return f"{self.id} -> {self.question}"


class Submission(models.Model):
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name="submissions"
    )
    contest = models.ForeignKey(
        to=Contest, on_delete=models.CASCADE, related_name="submissions"
    )
    question = models.ForeignKey(
        to=Question, on_delete=models.CASCADE, related_name="submissions"
    )
    duration = models.DurationField()
    attempt = models.PositiveSmallIntegerField()
    code = models.TextField(blank=True)
    success = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.user} ({self.question})"