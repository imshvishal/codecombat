from rest_framework import serializers

from .models import Contest, Question, Submission, TestCase


class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = "__all__"
