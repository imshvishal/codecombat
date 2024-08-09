from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.request import Request

from .models import Contest, Question, Submission


class ContestPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == "list":
            return False
        elif view.action == "create":
            return request.user.is_authenticated and request.user.user_type == "ORG"
        contest = Contest.objects.filter(
            contest_code__iexact=view.kwargs.get("contest_code")
        ).last()
        if view.action in ["pending_users", "approve_users", "submissions"]:
            return contest and contest.organizer == request.user
        elif view.action in ("register",):
            print(contest, request.user.is_authenticated)
            return contest and request.user.is_authenticated
        elif view.action == "deregister":
            return (
                contest
                and request.user.is_authenticated
                and (
                    contest.enrolled_users.filter(pk=request.user.id).exists()
                    or contest.pending_users.filter(pk=request.user.id).exists()
                )
            )
        elif view.action == "questions":
            return request.user == contest.organizer or (
                contest.enrolled_users.filter(pk=request.user.id).exists()
                and contest.is_live
            )
        return True

    def has_object_permission(self, request, view, contest):
        if request.method not in SAFE_METHODS:
            return request.user == contest.organizer
        return True


class QuestionPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == "list":
            return False
        elif view.action == "create":
            contest = Contest.objects.filter(pk=request.data.get("contest", 0)).last()
            return contest and contest.organizer == request.user
        question = Question.objects.filter(pk=view.kwargs.get("question_id")).last()
        if view.action == "submissions":
            return question and request.user == question.contest.organizer
        return True

    def has_object_permission(self, request, view, question):
        if request.method not in SAFE_METHODS:
            return question.contest.organizer == request.user
        return question.contest.organizer == request.user or (
            question.contest.enrolled_users.filter(pk=request.user.id).exists()
            and question.contest.is_live
        )


class SubmissionPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == "list":
            return False
        elif view.action in ["create", "run"]:
            question = Question.objects.filter(
                pk=request.data.get("question", 0)
            ).last()
            return (
                (
                    question.contest.organizer == request.user
                    or (
                        question.contest.enrolled_users.filter(
                            pk=request.user.id
                        ).exists()
                        and question.contest.is_live
                    )
                )
                if question
                else True
            )
        return True

    def has_object_permission(self, request: Request, view, obj):
        if view.action == "delete":
            return False
        if request.method not in SAFE_METHODS:
            return (
                False
                if isinstance(obj, Submission)
                else obj.question.contest.is_live
                and obj.question.contest.enrolled_users.filter(
                    pk=request.user.id
                ).exists()
            )
        return (
            obj.question.contest.organizer == request.user
            or obj.question.contest.enrolled_users.filter(pk=request.user.id).exists()
        )
