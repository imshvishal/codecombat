from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from djoser.views import UserViewSet as DjoserUserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from accounts.serializers import UserSerializer
from contests.serializers import ContestSerializer, SubmissionSerializer

from .permissions import UserPermission


class UserViewSet(DjoserUserViewSet):
    permission_classes = [IsAdminUser | UserPermission]
    serializer_class = UserSerializer

    def get_serializer_context(self):
        return super().get_serializer_context() | {"request": self.request}

    def get_object(self):
        if (
            self.kwargs.get("username") == "@me"
            and not self.request.user.is_authenticated
        ):
            raise AuthenticationFailed()
        instance = get_object_or_404(
            self.queryset,
            username=(
                un
                if (un := self.kwargs["username"]) != "@me"
                else self.request.user.username
            ),
        )
        self.check_object_permissions(self.request, instance)
        return instance

    @action(["GET"], True)
    def enrolled_contests(self, request: Request, username):
        user = self.get_object()
        contests = [
            contest
            for contest in user.enrolled_contests.all().order_by("-start_time")
            if contest.end_time >= timezone.now()
        ]
        serializer = ContestSerializer(
            contests, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["GET"], True)
    def created_contests(self, request: Request, username):
        user = self.get_object()
        serializer = ContestSerializer(
            user.created_contests.all().order_by("-created_at"),
            many=True,
            context={"request": request},
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["GET"], True)
    def past_contests(self, request: Request, username):
        user = self.get_object()
        contests = [
            contest
            for contest in user.enrolled_contests.all()
            if contest.end_time < timezone.now()
        ]
        serializer = ContestSerializer(
            contests, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["GET"], True)
    def submissions(self, request: Request, username):
        user = self.get_object()
        contest = request.GET.get("contest", None)
        question = request.GET.get("question", None)
        filter_kwargs = {}
        if contest:
            filter_kwargs["question__contest__contest_code"] = contest
        if question:
            filter_kwargs["question"] = question
        serializer = SubmissionSerializer(
            user.submissions.filter(**filter_kwargs),
            many=True,
            context={"request": request},
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
