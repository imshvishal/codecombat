from collections.abc import Iterable
from functools import lru_cache

from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.models import User
from accounts.serializers import UserSerializer

from .code_executor import CodeExecutor
from .models import Contest, Question, Submission
from .permissions import ContestPermission, QuestionPermission, SubmissionPermission
from .serializers import (
    ContestCreateSerializer,
    ContestSerializer,
    LeaderBoardSerializer,
    QuestionSerializer,
    SubmissionOfNoContestSerializer,
    SubmissionSerializer,
    TestCaseSerializer,
)


class CustomModelViewSet(ModelViewSet):
    def get_serializer_class(self):
        if (
            isinstance(self.serializer_class, Iterable)
            and len(self.serializer_class) > 1
        ):
            if self.request.method == "GET":
                return self.serializer_class[0]
            else:
                return self.serializer_class[1]
        else:
            return self.serializer_class

    def list(self, request, *args, **kwargs):
        raise PermissionDenied()

    def perform_create_or_update(self, serializer):
        serializer.save()

    def perform_create(self, serializer):
        self.perform_create_or_update(serializer)

    def perform_update(self, serializer):
        self.perform_create_or_update(serializer)


# Create your views here.
class ContestViewSet(CustomModelViewSet):
    serializer_class = ContestSerializer, ContestCreateSerializer
    queryset = Contest.objects.all()
    # permission_classes = [IsAdminUser | ContestPermission]

    def perform_create_or_update(self, serializer):
        contest = serializer.save()
        questions = self.request.data.get("questions", [])
        for question_data in questions:
            question_serializer = QuestionSerializer(
                data=question_data | {"contest": contest.id}
            )
            question_serializer.is_valid(raise_exception=True)
            question = question_serializer.save()
            testcases = question_data.get("testcases", [])
            for testcase_data in testcases:
                testcase_serializer = TestCaseSerializer(
                    data=testcase_data | {"question": question.id}
                )
                testcase_serializer.is_valid(raise_exception=True)
                testcase_serializer.save()

    @action(["get"], detail=True)
    def users(self, request: Request, pk):
        contest = get_object_or_404(Contest, pk=pk)
        serializer = UserSerializer(contest.enrolled_users, many=True)
        return Response(serializer.data, status=200)

    @action(["get"], detail=True)
    def questions(self, request: Request, pk):
        contest = get_object_or_404(Contest, pk=pk)
        serializer = QuestionSerializer(contest.questions, many=True)
        return Response(serializer.data, 200)

    @action(["get"], detail=True)
    def submissions(self, request: Request, pk):
        contest = get_object_or_404(Contest, pk=pk)
        serializer = SubmissionSerializer(
            [
                submission
                for question in contest.questions.all()
                for submission in question.submissions.all()
            ],
            many=True,
        )
        return Response(serializer.data, 200)

    @action(["get"], detail=True)
    @lru_cache()
    def leaderboard(self, request: Request, pk):
        contest = get_object_or_404(Contest, pk=pk)
        submissions = (
            Submission.objects.filter(
                question__in=contest.questions.all(), success=True
            )
            .values("user")
            .annotate(total_duration=Sum("duration"), submissions=Count("user"))
            .order_by("-submissions", "total_duration")
        )
        for i, submission in enumerate(submissions, start=1):
            submission["rank"] = i
            submission["user"] = UserSerializer(
                User.objects.filter(pk=submission["user"]).last() or {}
            ).data
        serializer = LeaderBoardSerializer(submissions, many=True)
        return Response(serializer.data, status=200)


class QuestionViewSet(CustomModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()
    permission_classes = [IsAdminUser | QuestionPermission]

    def perform_create_or_update(self, serializer):
        """There is no special endpoints for TestCases.. all the testcases will be handled with the help of this method only"""
        question = serializer.save()
        for testcase_data in self.request.data.get("testcases", []):
            testcase_serializer = TestCaseSerializer(
                data=testcase_data | {"question": question.id}
            )
            testcase_serializer.is_valid(raise_exception=True)
            testcase_serializer.save()

    @action(["get"], detail=True)
    def submissions(self, request: Request, pk):
        """It will return all the submissions of that user for the question."""
        question = get_object_or_404(Question, pk=pk)
        serializer = SubmissionSerializer(
            question.submissions.filter(user=request.user), many=True
        )
        return Response(serializer.data, 200)


class SubmissionViewSet(CustomModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    # permission_classes = [IsAdminUser | SubmissionPermission]

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(methods=["post"], detail=False)
    def run(self, request, *args, **kwargs):
        if (submission := self.get_serializer(data=request.data)).is_valid() or (
            submission := SubmissionOfNoContestSerializer(data=request.data)
        ).is_valid():
            if self.get_queryset().filter(
                user=submission.validated_data.get("user"),
                question=submission.validated_data.get("question"),
                success=True,
            ):
                return Response(
                    {"error": "Already have a successfull submission."}, 403
                )
        else:
            return Response(submission.errors)
        with CodeExecutor(**submission.validated_data) as executor:
            result = executor.execute()
            if isinstance(submission, self.get_serializer_class()):
                submission.save(success=result.get("success", False))
            return Response(result, 200)

    # TODO: remove TestCode
    @action(methods=["post", "get"], detail=False)
    def run_temp(self, request, *args, **kwargs):
        if request.method == "POST":
            result = self.run_code(request)
            return Response(result)
        return Response()
