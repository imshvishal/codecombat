from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from contest.serializers import ContestSerializer, SubmissionSerializer

from .models import User
from .permissions import IsSameUser
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsSameUser]

    def list(self, request: Request, *args, **kwargs):
        raise PermissionDenied(method=request.method)

    @action(["GET"], True)
    def enrolled_contests(self, request: Request, pk):
        user = self.queryset.get(pk=pk)
        serializer = ContestSerializer(user.enrolled_contests, many=True)
        return Response(serializer.data, status=200)

    @action(["GET"], True)
    def created_contests(self, request: Request, pk):
        user = self.queryset.get(pk=pk)
        serializer = ContestSerializer(user.created_contests, many=True)
        return Response(serializer.data, status=200)

    @action(["GET"], True)
    def submissions(self, request: Request, pk):
        user = self.queryset.get(pk=pk)
        contest = request.GET.get("contest", None)
        question = request.GET.get("question", None)
        filter = {}
        if contest:
            filter["contest"] = contest
        if question:
            filter["question"] = question
        serializer = SubmissionSerializer(user.submissions.filter(**filter), many=True)
        return Response(serializer.data, status=200)
