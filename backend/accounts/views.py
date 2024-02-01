from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from contest.serializers import ContestSerializer, SubmissionSerializer

from .models import User
from .permissions import IsSameUser
from .serializers import UserSerializer


# @method_decorator(csrf_protect, na)
class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAdminUser | IsSameUser]

    @csrf_protect
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def list(self, request: Request, *args, **kwargs):
        raise PermissionDenied()

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
