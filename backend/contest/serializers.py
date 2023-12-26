from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    SerializerMethodField,
)

from accounts.serializers import UserSerializer

from .models import Contest, Question, Submission, TestCase


class ContestSerializer(ModelSerializer):
    questions = SerializerMethodField()

    class Meta:
        model = Contest
        fields = "__all__"
        # depth = 1

    def get_questions(self, contest):
        return contest.questions.all().count()


class QuestionSerializer(ModelSerializer):
    testcases = SerializerMethodField()

    class Meta:
        model = Question
        fields = "__all__"

    def get_testcases(self, question):
        return question.testcases.all().count()


class TestCaseSerializer(ModelSerializer):
    class Meta:
        model = TestCase
        fields = "__all__"


class SubmissionSerializer(ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"


class LeaderBoardSerializer(Serializer):
    user = UserSerializer()
    rank = serializers.IntegerField()
    submissions = serializers.IntegerField()
    total_duration = serializers.DurationField()

    class Meta:
        depth = 1
