from dataclasses import fields

from django.conf import settings
from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    SerializerMethodField,
)

from accounts.serializers import UserSerializer

from .models import Contest, Question, Submission, TestCase


class ContestCreateSerializer(ModelSerializer):
    class Meta:
        model = Contest
        exclude = ("pending_users",)


class ContestSerializer(ContestCreateSerializer):
    organizer = UserSerializer()
    cover_image = SerializerMethodField()
    is_live = SerializerMethodField()
    end_time = SerializerMethodField()

    class Meta:
        model = Contest
        fields = "__all__"
        extra_kwargs = {"pending_users": {"read_only": True}}

    def get_end_time(self, contest):
        return contest.end_time

    def get_is_live(self, contest):
        return contest.is_live

    def get_cover_image(self, contest):
        if contest.cover_image:
            url = contest.cover_image.url
            return (
                settings.BACKEND_DOMAIN + url
                if url.startswith("/")
                else contest.cover_image.url
            )
        return None


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
