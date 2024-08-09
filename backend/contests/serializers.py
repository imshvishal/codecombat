from dataclasses import fields
from urllib import request

from django.conf import settings
from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    SerializerMethodField,
)

from accounts.serializers import UserSerializer

from .models import AttemptStatus, Contest, Question, Submission, TestCase


class ContestCreateSerializer(ModelSerializer):
    class Meta:
        model = Contest
        exclude = ("pending_users",)


class TestCaseSerializer(ModelSerializer):
    class Meta:
        model = TestCase
        fields = "__all__"


class AttemptStatusSerializer(ModelSerializer):

    class Meta:
        model = AttemptStatus
        fields = "__all__"


class QuestionCreateSerializer(ModelSerializer):

    class Meta:
        model = Question
        fields = "__all__"


class ContestSerializer(ContestCreateSerializer):
    organizer = UserSerializer()
    cover_image = SerializerMethodField()
    is_live = SerializerMethodField()
    end_time = SerializerMethodField()
    questions = SerializerMethodField()
    pending_users = UserSerializer(many=True)
    enrolled_users = UserSerializer(many=True)

    class Meta:
        model = Contest
        fields = "__all__"
        extra_kwargs = {"pending_users": {"read_only": True}}

    def get_end_time(self, contest):
        return contest.end_time

    def get_is_live(self, contest):
        return contest.is_live

    def get_cover_image(self, contest):
        request = self.context.get("request")
        if contest.cover_image:
            url = contest.cover_image.url
            return (
                f"{request.scheme}://{request.get_host()}" + url
                if url.startswith("/")
                else contest.cover_image.url
            )
        return None

    def get_questions(self, contest):
        request = self.context.get("request")
        questions = contest.questions.all()
        if (
            request
            and request.user == contest.organizer
            or (
                contest.is_live
                and contest.enrolled_users.filter(pk=request.user.id).exists()
            )
        ):
            return QuestionCreateSerializer(
                questions,
                many=True,
                context=self.context.copy() | {"request": request},
            ).data
        else:
            return questions.count()


class QuestionSerializer(QuestionCreateSerializer):
    class Meta:
        model = Question
        fields = "__all__"

    testcases = SerializerMethodField()
    submission = SerializerMethodField()
    attempt_status = SerializerMethodField()
    contest = SerializerMethodField()

    def get_contest(self, question):
        return ContestSerializer(question.contest, context=self.context).data

    def get_attempt_status(self, question):
        return (
            AttemptStatusSerializer(instance).data
            if (
                instance := question.attempt_status.filter(
                    user=self.context.get("request").user
                ).last()
            )
            else None
        )

    def get_submission(self, question):
        instance = question.submissions.filter(
            user=self.context.get("request").user, success=True
        ).last()
        return SubmissionSerializer(instance).data if instance else None

    def get_testcases(self, question):
        request = self.context.get("request")
        testcases = question.testcases.all()
        testcase_serialized_data = TestCaseSerializer(
            testcases, many=True, context=self.context.copy() | {"request": request}
        ).data
        if request and request.user == question.contest.organizer:
            return testcase_serialized_data
        else:
            return (
                testcase_serialized_data
                if self.get_submission(question)
                else testcases.count()
            )


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
