from rest_framework import permissions


class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "list":
            return False
        elif view.action in [
            "enrolled_contests",
            "created_contests",
            "submissions",
            "past_contests",
        ]:
            return view.kwargs.get("username") in [request.user.username, "@me"]
        return True

    def has_object_permission(self, request, view, user):
        if request.method not in permissions.SAFE_METHODS:
            return request.user.is_authenticated and request.user == user
        return True
