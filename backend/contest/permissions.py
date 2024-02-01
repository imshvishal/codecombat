from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.request import Request

from .models import Contest


class ContestPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user.is_authenticated and request.user.user_type == "ORG"
        return True

    def has_object_permission(self, request, view, contest):
        if request.method not in SAFE_METHODS:
            return True
        return (
            contest.enrolled_users.filter(pk=request.user.id).exists()
            or request.user == contest.organizer
        )


class DataForValidContestPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            contest = Contest.objects.filter(pk=request.data.get("contest", 0)).last()
            return (
                request.user.is_authenticated
                and request.user.user_type == "ORG"
                and contest
                and contest.organizer == request.user
            )
        return False


class QuestionPermission(DataForValidContestPermission):
    def has_object_permission(self, request, view, question):
        if request.method not in SAFE_METHODS:
            return question.contest.organizer == request.user
        else:
            return (
                question.contest.organizer == request.user
                or question.contest.enrolled_users.filter(pk=request.user.id).exists()
            )


class SubmissionPermission(DataForValidContestPermission):
    def has_object_permission(self, request: Request, view, obj):
        if request.method == "POST":
            # TODO: check if the contest is live before submitting the submissions
            print(request.data)
            return (
                obj.question.contest.organizer == request.user
                or obj.question.contest.enrolled_users.filter(
                    pk=request.user.id
                ).exists()
            )
        return False
