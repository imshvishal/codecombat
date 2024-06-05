from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer

from accounts.serializers import UserSerializer

from .models import Contest, Question, Submission, TestCase


class ContestCreateSerializer(ModelSerializer):
    class Meta:
        model = Contest
        exclude = ("pending_users",)

    def get_questions(self, contest):
        questions = contest.questions.all()
        serializer = QuestionSerializer(questions, many=True)
        return serializer.data


class ContestSerializer(ContestCreateSerializer):
    organizer = UserSerializer()


class QuestionSerializer(ModelSerializer):
    testcases = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = "__all__"

    def get_testcases(self, question):
        testcases = question.testcases.all().count()
        return testcases


class TestCaseSerializer(ModelSerializer):
    class Meta:
        model = TestCase
        fields = "__all__"


class SubmissionSerializer(ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"


class SubmissionOfNoContestSerializer(ModelSerializer):
    class Meta:
        model = Submission
        fields = ["lang", "code"]
        extra_kwargs = {"code": {"required": True}}


class LeaderBoardSerializer(Serializer):
    user = UserSerializer()
    rank = serializers.IntegerField()
    submissions_failed = serializers.IntegerField()
    submissions_success = serializers.IntegerField()
    total_duration = serializers.DurationField()

    class Meta:
        depth = 1
