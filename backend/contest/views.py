from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.models import User
from accounts.serializers import UserSerializer

from .models import Contest, Submission
from .serializers import (
    ContestSerializer,
    LeaderBoardSerializer,
    QuestionSerializer,
    SubmissionSerializer,
)


# Create your views here.
class ContestViewSet(ModelViewSet):
    serializer_class = ContestSerializer
    queryset = Contest.objects.all()

    @action(["get", "post"], detail=True)
    def questions(self, request: Request, pk):
        if request.method == "GET":
            contest = get_object_or_404(Contest, pk=pk)
            serializer = QuestionSerializer(contest.questions, many=True)
            return Response(serializer.data, status=200)

    @action(["get", "post"], detail=True)
    def users(self, request: Request, pk):
        if request.method == "GET":
            contest = get_object_or_404(Contest, pk=pk)
            serializer = UserSerializer(contest.enrolled_users, many=True)
            return Response(serializer.data, status=200)

    @action(["get"], detail=True)
    def submissions(self, request: Request, pk):
        if request.method == "GET":
            user = request.GET.get("user")
            question = request.GET.get("question")
            filter = {}
            if user:
                filter["user"] = user
            if question:
                filter["question"] = question
            serializer = SubmissionSerializer(
                Submission.objects.filter(**filter), many=True
            )
            return Response(serializer.data, status=200)

    @action(["get"], detail=True)
    def leaderboard(self, request: Request, pk):
        contest = get_object_or_404(Contest, pk=pk)
        submissions = (
            contest.submissions.values("user")
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
