import json
from collections.abc import Iterable
from functools import lru_cache

from django.db.models import Case, Count, Sum, When
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.models import User
from accounts.serializers import UserSerializer

from .code_executor import CodeExecutor
from .models import AttemptStatus, Contest, Question, Submission, TestCase
from .permissions import ContestPermission, QuestionPermission, SubmissionPermission
from .serializers import (
    AttemptStatusSerializer,
    ContestCreateSerializer,
    ContestSerializer,
    LeaderBoardSerializer,
    QuestionCreateSerializer,
    QuestionSerializer,
    SubmissionOfNoContestSerializer,
    SubmissionSerializer,
    TestCaseSerializer,
)


# TODO: Save live data like the time the editor left at andd code in the editor
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

    def perform_create_or_update(self, serializer):
        serializer.save()

    def perform_create(self, serializer):
        self.perform_create_or_update(serializer)

    def perform_update(self, serializer):
        self.perform_create_or_update(serializer)

    def get_serializer_context(self):
        return super().get_serializer_context() | {"request": self.request}


# Create your views here.
class ContestViewSet(CustomModelViewSet):
    lookup_field = "contest_code"
    serializer_class = ContestSerializer, ContestCreateSerializer
    queryset = Contest.objects.all()
    permission_classes = [IsAdminUser | ContestPermission]

    def perform_create_or_update(self, serializer):
        contest = serializer.save()
        questions = self.request.data.get("questions", "[]")
        for question_data in json.loads(questions):
            question_id = question_data.get("id", None)
            question_data["contest"] = contest.id
            if question_id:
                question_instance = Question.objects.get(id=question_id)
                print(question_instance)
                question_serializer = QuestionSerializer(
                    question_instance,
                    data=question_data,
                    partial=True,
                )
                print(question_serializer)
            else:
                print(2)
                question_serializer = QuestionCreateSerializer(data=question_data)
            question_serializer.is_valid(raise_exception=True)
            question = question_serializer.save()
            testcases = question_data.get("testcases", [])
            for testcase_data in testcases:
                testcase_id = testcase_data.get("id")
                if testcase_id:
                    testcase_instance = TestCase.objects.get(id=testcase_id)
                    testcase_serializer = TestCaseSerializer(
                        testcase_instance,
                        data=testcase_data,
                        partial=True,
                    )
                else:
                    testcase_serializer = TestCaseSerializer(
                        data=testcase_data | {"question": question.id}
                    )

                testcase_serializer.is_valid(raise_exception=True)
                testcase = testcase_serializer.save()

    @action(["get"], detail=True)
    def register(self, request, contest_code):
        contest = get_object_or_404(Contest, contest_code=contest_code)
        if contest.pending_users.filter(id=request.user.id).exists():
            return Response(
                {"detail": "You have applied already. Please wait for approval."},
                status=403,
            )
        if contest.enrolled_users.filter(id=request.user.id).exists():
            return Response(
                {"detail": "You have already been enrolled in the contest."}, status=403
            )
        if contest.is_private:
            contest.pending_users.add(request.user)
        else:
            contest.enrolled_users.add(request.user)
        contest.save()
        return Response({"detail": "OK"}, status=200)

    @action(["get"], detail=True)
    def deregister(self, request, contest_code):
        contest = get_object_or_404(Contest, contest_code=contest_code)
        if contest.enrolled_users.filter(id=request.user.id).exists():
            contest.enrolled_users.remove(request.user)
        if contest.pending_users.filter(id=request.user.id).exists():
            contest.pending_users.remove(request.user)
        contest.save()
        return Response({"detail": "OK"}, status=200)

    @action(["get"], detail=True)
    def pending_users(self, request, contest_code):
        contest = get_object_or_404(Contest, contest_code=contest_code)
        serializer = UserSerializer(contest.pending_users, many=True)
        return Response(serializer.data, status=200)

    @action(["post"], detail=True)
    def approve_users(self, request: Request, contest_code):
        contest = get_object_or_404(Contest, contest_code=contest_code)
        users = request.data.get("users", [])
        for userid in users:
            if contest.pending_users.filter(id=userid).exists():
                contest.pending_users.remove(userid)
                contest.enrolled_users.add(userid)
        contest.save()
        return Response({"detail": "OK"}, status=200)

    @action(["get"], detail=True)
    def approved_users(self, request: Request, contest_code):
        contest = get_object_or_404(Contest, contest_code=contest_code)
        serializer = UserSerializer(
            contest.enrolled_users, many=True, context={"request": request}
        )
        return Response(serializer.data, status=200)

    @action(["get"], detail=True)
    def questions(self, request: Request, contest_code):
        contest = get_object_or_404(Contest, contest_code=contest_code)
        serializer = QuestionSerializer(contest.questions, many=True)
        return Response(serializer.data, 200)

    @action(["get"], detail=True)
    def submissions(self, request: Request, contest_code):
        _submissions = Submission.objects.filter(
            question__contest__contest_code=contest_code
        ).all()
        serializer = SubmissionSerializer(_submissions, many=True)
        return Response(serializer.data, 200)

    @action(["get"], detail=True)
    @lru_cache()
    def leaderboard(self, request: Request, contest_code):
        submissions = (
            Submission.objects.filter(question__contest__contest_code=contest_code)
            .values("user")
            .annotate(
                total_duration=Sum(Case(When(success=True, then="duration"))),
                submissions_failed=Count(Case(When(success=False, then=1))),
                submissions_success=Count(Case(When(success=True, then=1))),
            )
            .order_by("-submissions_success", "total_duration", "submissions_failed")
        )
        if not submissions.exists():
            return Response({"detail": "No submissions."}, status=404)
        for i, submission in enumerate(submissions, start=1):
            submission["rank"] = i
            submission["user"] = User.objects.filter(pk=submission["user"]).last()
        serializer = LeaderBoardSerializer(submissions, many=True)
        return Response(serializer.data, status=200)


class QuestionViewSet(CustomModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()
    permission_classes = [IsAdminUser | (IsAuthenticated & QuestionPermission)]

    def perform_create_or_update(self, serializer):
        """
        There is no special endpoints for TestCases..
        all the testcases will be handled with the help of this method only
        """
        question = serializer.save()
        for testcase_data in self.request.data.get("testcases", []):
            testcase_serializer = TestCaseSerializer(
                data=testcase_data | {"question": question.id}
            )
            testcase_serializer.is_valid(raise_exception=True)
            testcase_serializer.save()

    @action(["get"], detail=True)
    def submissions(self, request: Request, pk):
        question = get_object_or_404(Question, pk=pk)
        serializer = SubmissionSerializer(
            question.submissions.filter(question=pk), many=True
        )
        return Response(serializer.data, 200)


class SubmissionViewSet(CustomModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAdminUser | (IsAuthenticated & SubmissionPermission)]

    @action(methods=["post"], detail=False)
    def run(self, request, *args, **kwargs):
        data = request.data | {"user": request.user.id}
        if (submission := self.get_serializer(data=data)).is_valid() or (
            submission := SubmissionOfNoContestSerializer(data=data)
        ).is_valid():
            if self.get_queryset().filter(
                user=submission.validated_data.get("user"),
                question=submission.validated_data.get("question"),
                success=True,
            ):
                return Response(
                    {"detail": "Already have a successfull submission."}, 403
                )
        else:
            return Response(submission.errors)
        print(submission.validated_data)
        with CodeExecutor(**submission.validated_data) as executor:
            result = executor.execute()
            if isinstance(submission, self.get_serializer_class()):
                submission.save(success=result.get("success", False))
            return Response(result, 200)


class AttemptStatusViewSet(CustomModelViewSet):
    queryset = AttemptStatus.objects.all()
    serializer_class = AttemptStatusSerializer
    permission_classes = [IsAdminUser | (IsAuthenticated & SubmissionPermission)]
