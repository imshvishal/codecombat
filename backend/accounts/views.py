from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from contest.serializers import ContestSerializer, SubmissionSerializer

from .models import User
from .permissions import UserPermission
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    lookup_field = "username"
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAdminUser | UserPermission]

    def get_object(self):
        instance = get_object_or_404(
            self.queryset,
            username=(
                un
                if (un := self.kwargs["username"]) != "@me"
                else self.request.user.username
            ),
        )
        return instance

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
