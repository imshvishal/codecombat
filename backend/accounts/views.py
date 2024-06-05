from django.conf import settings
from django.shortcuts import get_object_or_404
from djoser.views import UserViewSet as DjoserUserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from accounts.serializers import UserSerializer
from contests.serializers import ContestSerializer, SubmissionSerializer

from .permissions import UserPermission


class UserViewSet(DjoserUserViewSet):
    permission_classes = [IsAdminUser | UserPermission]
    serializer_class = UserSerializer

    def get_object(self):
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
        serializer = ContestSerializer(user.enrolled_contests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["GET"], True)
    def created_contests(self, request: Request, username):
        user = self.get_object()
        serializer = ContestSerializer(user.created_contests, many=True)
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
            user.submissions.filter(**filter_kwargs), many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
